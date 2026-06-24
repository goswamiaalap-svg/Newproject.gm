export function getResumeChannel(userId: string): string {
  return `resume-review-${userId}`
}

export const RESUME_EVENTS = {
  UPLOAD_STARTED: 'upload-started',
  UPLOAD_COMPLETE: 'upload-complete',
  TEXT_EXTRACTED: 'text-extracted',
  AI_STARTED: 'ai-started',
  AI_COMPLETE: 'ai-complete',
  ERROR: 'review-error',
} as const
