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

export const dynamic = 'force-dynamic'

export function calculateResumeMetrics(text: string) {
  if (!text) {
    return {
      wordCount: 0,
      estimatedPages: 0,
      hasEmail: false,
      hasPhone: false,
      hasLinkedIn: false,
      hasGitHub: false,
      hasExperience: false,
      hasProjects: false,
      hasSkills: false,
      hasEducation: false,
      metricsCount: 0,
      strongVerbsCount: 0,
    }
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 450))

  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(text)
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/.test(text)
  
  const lowerText = text.toLowerCase()
  const hasLinkedIn = lowerText.includes('linkedin.com')
  const hasGitHub = lowerText.includes('github.com') || lowerText.includes('github.io')

  const hasExperience = /work|experience|employment|history|professional|career/i.test(text)
  const hasProjects = /projects|creations|built|portfolio|personal projects/i.test(text)
  const hasSkills = /skills|abilities|technologies|tools|competencies/i.test(text)
  const hasEducation = /education|university|college|degree|btech|mtech|academic/i.test(text)

  const metricsMatches = text.match(/\b\d+%\b|\b\d+\s*\+\b|\b\d+\s*(?:users|clients|percent|million|k|employees|metrics|speed|performance|seconds|ms|hours|hours\/week|gpa|cgpa)\b/gi)
  const metricsCount = metricsMatches ? metricsMatches.length : 0

  const strongVerbs = [
    'developed', 'architected', 'implemented', 'optimized', 'designed',
    'built', 'engineered', 'led', 'managed', 'created', 'solved',
    'increased', 'decreased', 'improved', 'accelerated', 'launched',
    'deployed', 'scaled', 'reduced', 'saved', 'automated'
  ]
  let strongVerbsCount = 0
  strongVerbs.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi')
    const matches = text.match(regex)
    if (matches) {
      strongVerbsCount += matches.length
    }
  })

  return {
    wordCount,
    estimatedPages,
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasGitHub,
    hasExperience,
    hasProjects,
    hasSkills,
    hasEducation,
    metricsCount,
    strongVerbsCount,
  }
}

export async function GET() {
  try {
    // Auth check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    // Find the most recent completed resume for this user
    const resume = await Resume.findOne(
      { userId, status: 'complete' }
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
      resumeMetrics: calculateResumeMetrics(resume.extractedText),
    })
  } catch (error: any) {
    console.error('[GET /api/resume] Error fetching resume:', error)
    return NextResponse.json(
      { error: `Failed to fetch resume data: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
