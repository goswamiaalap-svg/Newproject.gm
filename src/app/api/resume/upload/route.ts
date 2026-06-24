// =============================================================================
// Resume Upload API — POST /api/resume/upload
//
// Accepts a multipart/form-data request containing a PDF or DOCX file.
// Flow:
//   1. Validates file type (PDF/DOCX) and size (max 5MB)
//   2. Uploads the raw file to Supabase Storage (bucket: "resumes", path: userId/filename)
//   3. Extracts plain text using pdf-parse (PDF) or mammoth (DOCX)
//   4. Creates a Resume document in MongoDB with status: "processing"
//   5. Returns the resumeId for the client to poll /api/resume/review
//
// Authentication: Requires Clerk session. User ID is read from auth().userId.
// =============================================================================

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import Resume from '@/lib/models/Resume'
import { getSupabaseAdmin, RESUMES_BUCKET } from '@/lib/supabase'
import { getPusherServer, getResumeChannel, RESUME_EVENTS } from '@/lib/pusher'
import { createRequire } from 'module'

export const dynamic = 'force-dynamic'

// Max file size: 5MB in bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed MIME types and their matching extensions
const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

export async function POST(req: Request) {
  try {
    // ---- 1. Auth check ----
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ---- 2. Parse the multipart form data ----
    let formData: FormData
    try {
      formData = await req.formData()
    } catch (parseFormErr: any) {
      console.error('[Resume Upload] Form parse error:', parseFormErr)
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // ---- 3. Validate file type ----
    const fileExtension = ALLOWED_TYPES[file.type]
    if (!fileExtension) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or DOCX file.' },
        { status: 400 }
      )
    }

    // ---- 4. Validate file size ----
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum file size is 5MB.' },
        { status: 400 }
      )
    }

    // ---- 5. Upload to Supabase Storage ----
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${userId}/${timestamp}_${sanitizedName}`

    let fileArrayBuffer: ArrayBuffer
    try {
      fileArrayBuffer = await file.arrayBuffer()
    } catch (bufErr: any) {
      console.error('[Resume Upload] File buffer conversion failed:', bufErr)
      return NextResponse.json({ error: 'Failed to read file contents' }, { status: 400 })
    }
    const fileBuffer = Buffer.from(fileArrayBuffer)

    let fileUrl = ''
    try {
      const supabase = getSupabaseAdmin()

      // Ensure the bucket exists (create programmatically if it doesn't exist)
      try {
        await supabase.storage.createBucket(RESUMES_BUCKET, {
          public: true,
        })
      } catch (err) {
        // Ignore error if bucket already exists
      }

      // Emit upload started event
      try {
        const pusher = getPusherServer()
        await pusher.trigger(getResumeChannel(userId), RESUME_EVENTS.UPLOAD_STARTED, { fileName: file.name })
      } catch (e) {
        console.error('[Pusher] Failed to emit UPLOAD_STARTED:', e)
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(RESUMES_BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: true, // Overwrite if same path already exists
        })

      if (uploadError) {
        console.error('[Resume Upload] Supabase storage upload error:', uploadError)
        return NextResponse.json(
          { error: `Failed to upload file to storage: ${uploadError.message || JSON.stringify(uploadError)}` },
          { status: 500 }
        )
      }

      if (!uploadData || !uploadData.path) {
        throw new Error('Supabase upload succeeded but returned no path metadata')
      }

      // Get the public URL for the stored file
      const { data: urlData } = supabase.storage
        .from(RESUMES_BUCKET)
        .getPublicUrl(uploadData.path)

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to retrieve public URL from Supabase')
      }

      fileUrl = urlData.publicUrl

      // Emit upload complete event
      try {
        const pusher = getPusherServer()
        await pusher.trigger(getResumeChannel(userId), RESUME_EVENTS.UPLOAD_COMPLETE, { fileUrl })
      } catch (e) {
        console.error('[Pusher] Failed to emit UPLOAD_COMPLETE:', e)
      }
    } catch (supabaseError: any) {
      console.error('[Resume Upload] Supabase operation failed:', supabaseError)
      return NextResponse.json(
        { error: `Supabase storage error: ${supabaseError.message || 'Connection or configuration issue'}` },
        { status: 500 }
      )
    }

    // ---- 6. Extract plain text from the file ----
    let extractedText = ''

    try {
      if (fileExtension === 'pdf') {
        const requireFn = createRequire(import.meta.url)
        const pdf = requireFn('pdf-parse')

        const pdfData = await pdf(fileBuffer)
        extractedText = pdfData.text
      } else if (fileExtension === 'docx') {
        const mammoth = await import('mammoth')
        const result = await mammoth.extractRawText({ buffer: fileBuffer })
        extractedText = result.value
      }
    } catch (parseError: any) {
      console.error('[Resume Upload] Text extraction failed:', parseError)
      return NextResponse.json(
        { error: `Failed to extract text: ${parseError.message || 'Ensure file is not corrupted'}` },
        { status: 422 }
      )
    }

    if (!extractedText || !extractedText.trim()) {
      return NextResponse.json(
        { error: 'Your resume appears to be empty or contains only images. Please upload a text-based PDF or DOCX.' },
        { status: 422 }
      )
    }

    // Emit text extracted event
    try {
      const pusher = getPusherServer()
      await pusher.trigger(getResumeChannel(userId), RESUME_EVENTS.TEXT_EXTRACTED, {})
    } catch (e) {
      console.error('[Pusher] Failed to emit TEXT_EXTRACTED:', e)
    }

    // ---- 7. Save Resume document to MongoDB ----
    try {
      await connectToDatabase()

      const resume = await Resume.create({
        userId,
        fileUrl,
        fileName: file.name,
        extractedText,
        status: 'processing',
        uploadedAt: new Date(),
      })

      return NextResponse.json(
        {
          resumeId: resume._id.toString(),
          fileName: file.name,
          message: 'Resume uploaded successfully. Starting AI review...',
        },
        { status: 201 }
      )
    } catch (dbError: any) {
      console.error('[Resume Upload] MongoDB save error:', dbError)
      return NextResponse.json(
        { error: `Database error: ${dbError.message || 'Failed to save resume record'}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('[Resume Upload] Critical unhandled route crash:', error)
    return NextResponse.json(
      { error: `Server Error: ${error.message || 'An unexpected error occurred'}` },
      { status: 500 }
    )
  }
}
