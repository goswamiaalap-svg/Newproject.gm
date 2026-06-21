// =============================================================================
// Resume Status API — GET /api/resume
//
// Fetches the most recent resume document for the authenticated user.
// Used by the /dashboard/resume page on load to show previous results.
// Returns null (empty 204) if the user has no resume yet.
// =============================================================================

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import Resume from '@/lib/models/Resume'

export async function GET() {
  // Auth check
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectToDatabase()

    // Find the most recent completed resume for this user
    const resume = await Resume.findOne(
      { userId, status: 'complete' },
      { extractedText: 0 } // Exclude the raw text — we only need metadata and results
    ).sort({ uploadedAt: -1 })

    if (!resume) {
      // No resume yet — return 204 No Content so the frontend shows the upload UI
      return new NextResponse(null, { status: 204 })
    }

    return NextResponse.json({
      resumeId: resume._id.toString(),
      fileName: resume.fileName,
      fileUrl: resume.fileUrl,
      uploadedAt: resume.uploadedAt,
      status: resume.status,
      reviewResult: resume.reviewResult,
    })
  } catch (error) {
    console.error('[GET /api/resume] Error fetching resume:', error)
    return NextResponse.json({ error: 'Failed to fetch resume data' }, { status: 500 })
  }
}
