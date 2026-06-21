'use client'

// =============================================================================
// Resume Page — /dashboard/resume
//
// This is the fully functional AI Resume Reviewer page. It handles:
//  1. On load: fetches the user's most recent completed resume from /api/resume
//  2. Upload state: real file upload via FormData to /api/resume/upload
//  3. Processing state: animated loading while calling /api/resume/review
//  4. Results state: renders real Claude AI data (scores, strengths, weaknesses)
//  5. Error handling: shows clear messages for all failure cases
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from 'lucide-react'

// ---- Types ----
interface Weakness {
  issue: string
  severity: 'high' | 'medium' | 'low'
  suggestion: string
}

interface ReviewResult {
  overallScore: number
  atsScore: number
  quantifiedAchievements: number
  strengths: string[]
  weaknesses: Weakness[]
}

interface ResumeData {
  resumeId: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  status: string
  reviewResult: ReviewResult
}

// Map Claude's severity to display config
const SEVERITY_CONFIG = {
  high: {
    bg: 'bg-red-50/50',
    border: 'border-red-100',
    text: 'text-red-950',
    badge: 'bg-red-100 text-red-700',
    icon: '🔴',
    label: 'High Priority',
  },
  medium: {
    bg: 'bg-amber-50/50',
    border: 'border-amber-100',
    text: 'text-amber-950',
    badge: 'bg-amber-100 text-amber-700',
    icon: '🟡',
    label: 'Medium Priority',
  },
  low: {
    bg: 'bg-green-50/50',
    border: 'border-green-100',
    text: 'text-green-950',
    badge: 'bg-green-100 text-green-700',
    icon: '🟢',
    label: 'Low Priority',
  },
}

// ---- Loading messages cycling during analysis ----
const LOADING_MESSAGES = [
  'Parsing document structure...',
  'Extracting headers & contact info...',
  'Evaluating action verbs...',
  'Checking ATS keyword matching...',
  'Quantifying impact statements...',
  'Running Claude AI analysis...',
  'Compiling evaluation report...',
]

export default function ResumePage() {
  // Step: 'upload' | 'uploading' | 'reviewing' | 'results' | 'error'
  const [step, setStep] = useState<'upload' | 'uploading' | 'reviewing' | 'results' | 'error'>(
    'upload'
  )
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  // ---- On page load: fetch existing resume result ----
  useEffect(() => {
    async function fetchExistingResume() {
      try {
        const res = await fetch('/api/resume')
        // 204 = no resume yet, show upload UI
        if (res.status === 204) return
        if (!res.ok) return

        const data: ResumeData = await res.json()
        if (data?.reviewResult) {
          setResumeData(data)
          setFileName(data.fileName || 'resume.pdf')
          setStep('results')
        }
      } catch {
        // Silently fail on load — don't block the upload UI
        console.error('Failed to fetch existing resume')
      }
    }
    fetchExistingResume()
  }, [])

  // ---- Cycling progress bar animation during review ----
  useEffect(() => {
    if (step !== 'reviewing') return

    setProgress(0)
    let msgIdx = 0

    // Slowly advance the bar up to ~90% — the final 10% jumps to 100 when Claude responds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 2
      })
    }, 400)

    const messageInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[msgIdx])
    }, 1200)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [step])

  // ---- Upload handler: called for both click-to-select and drag-and-drop ----
  const handleFileUpload = useCallback(async (file: File) => {
    // Client-side validation
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Unsupported file type. Please upload a PDF or DOCX file.')
      setStep('error')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setErrorMessage('File is too large. Maximum file size is 5MB.')
      setStep('error')
      return
    }

    setFileName(file.name)
    setStep('uploading')

    // ---- Step 1: Upload the file ----
    const formData = new FormData()
    formData.append('file', file)

    let resumeId: string
    try {
      const uploadRes = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      })

      let uploadData: any = {}
      let isJson = false
      try {
        const text = await uploadRes.text()
        uploadData = JSON.parse(text)
        isJson = true
      } catch (e) {
        // Response is not valid JSON
      }

      if (!uploadRes.ok) {
        const errorMsg = isJson ? uploadData.error : `Server Error: ${uploadRes.status}`
        throw new Error(errorMsg || 'Upload failed')
      }

      resumeId = uploadData.resumeId
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload resume. Please try again.'
      setErrorMessage(message)
      setStep('error')
      return
    }

    // ---- Step 2: Trigger Claude AI review ----
    setStep('reviewing')

    try {
      const reviewRes = await fetch('/api/resume/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })

      let reviewData: any = {}
      let isJson = false
      try {
        const text = await reviewRes.text()
        reviewData = JSON.parse(text)
        isJson = true
      } catch (e) {
        // Response is not valid JSON
      }

      if (!reviewRes.ok) {
        const errorMsg = isJson ? reviewData.error : `Server Error: ${reviewRes.status}`
        throw new Error(errorMsg || 'AI analysis failed')
      }

      // Complete the progress bar
      setProgress(100)

      // Short delay before showing results for visual polish
      setTimeout(() => {
        setResumeData({
          resumeId,
          fileName: file.name,
          fileUrl: reviewData.fileUrl || '',
          uploadedAt: new Date().toISOString(),
          status: 'complete',
          reviewResult: reviewData.reviewResult,
        })
        setStep('results')
      }, 600)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI analysis failed. Please try again.'
      setErrorMessage(message)
      setStep('error')
    }
  }, [])

  // ---- File input change handler ----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  // ---- Drag and Drop handlers ----
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }
  const handleDragLeave = () => setIsDragOver(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const resetReviewer = () => {
    setFileName('')
    setProgress(0)
    setErrorMessage('')
    setStep('upload')
  }

  const review = resumeData?.reviewResult

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-text-primary">
          AI Resume Reviewer
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Scan your resume for ATS compatibility and get instant actionable feedback.
        </p>
      </div>

      <AnimatePresence mode="wait">

        {/* ===== STEP 1: Upload ===== */}
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`bg-white border-2 border-dashed rounded-card p-10 shadow-card flex flex-col items-center justify-center text-center max-w-2xl mx-auto min-h-[350px] transition-colors ${
              isDragOver ? 'border-teal bg-teal/5' : 'border-border-default'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full bg-teal/5 flex items-center justify-center text-teal mb-6">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="font-display text-lg font-bold text-text-primary mb-2">
              Upload your resume
            </h3>
            <p className="text-text-muted text-xs max-w-sm mb-8">
              Supports PDF and DOCX formats. Maximum size 5MB. Files are analyzed securely using Claude AI.
            </p>

            <label className="px-6 py-3 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn cursor-pointer transition-all shadow-teal-glow active:scale-95">
              <span>Choose File</span>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <p className="text-[10px] text-text-muted mt-4">
              Or drag and drop your file here
            </p>
          </motion.div>
        )}

        {/* ===== STEP 2: Uploading ===== */}
        {step === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-border-default rounded-card p-10 shadow-card flex flex-col items-center justify-center text-center max-w-md mx-auto min-h-[300px]"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-teal/10 border-t-teal animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-8 h-8 text-teal animate-pulse" />
              </div>
            </div>
            <p className="font-semibold text-text-primary text-sm mb-1">
              Uploading {fileName}...
            </p>
            <p className="text-text-muted text-xs">Extracting text from your document</p>
          </motion.div>
        )}

        {/* ===== STEP 3: Reviewing with Claude ===== */}
        {step === 'reviewing' && (
          <motion.div
            key="reviewing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-border-default rounded-card p-10 shadow-card flex flex-col items-center justify-center text-center max-w-md mx-auto min-h-[300px]"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-teal/10 border-t-teal animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-teal animate-pulse" />
              </div>
            </div>

            <p className="font-semibold text-text-primary text-sm mb-1">
              Analyzing {fileName}
            </p>
            <p className="text-text-muted text-xs h-8 flex items-center justify-center">
              {loadingMessage}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-bg-subtle h-2 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="bg-teal h-full rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-[10px] font-mono text-text-muted mt-2">
              {progress}% completed
            </span>
          </motion.div>
        )}

        {/* ===== STEP 4: Error ===== */}
        {step === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-red-100 rounded-card p-10 shadow-card flex flex-col items-center justify-center text-center max-w-md mx-auto min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display text-lg font-bold text-text-primary mb-2">
              Something went wrong
            </h3>
            <p className="text-text-secondary text-sm mb-6 max-w-xs">
              {errorMessage || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={resetReviewer}
              className="px-6 py-2.5 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors active:scale-95"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* ===== STEP 5: Results ===== */}
        {step === 'results' && review && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* ---- Left Column: Score Overview (Col span 5) ---- */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={resetReviewer}
                  className="flex items-center gap-1 text-xs text-text-secondary hover:text-teal font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Upload another file</span>
                </button>
                <span className="text-[10px] text-text-muted truncate max-w-[200px]">
                  📄 {fileName}
                </span>
              </div>

              {/* Overall Score Ring Card */}
              <div className="bg-white border border-border-default rounded-card p-6 shadow-card flex flex-col sm:flex-row items-center gap-6">
                {/* Circular Score Ring */}
                <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="56" cy="56" r="48"
                      stroke="#EEF2FF" strokeWidth="8" fill="transparent"
                    />
                    <motion.circle
                      cx="56" cy="56" r="48"
                      stroke="#0D9488" strokeWidth="8" fill="transparent"
                      strokeDasharray={2 * Math.PI * 48}
                      initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 48 * (1 - (review.overallScore || 0) / 100),
                      }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-extrabold text-text-primary">
                      {review.overallScore}
                    </span>
                    <span className="text-[9px] text-text-muted font-bold uppercase">Score</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal/5 text-teal text-[10px] font-bold border border-teal/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Claude AI Analysis</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-text-primary">
                    {review.overallScore >= 80
                      ? 'Excellent Foundation!'
                      : review.overallScore >= 60
                      ? 'Good Start!'
                      : 'Needs Improvement'}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {review.overallScore >= 80
                      ? 'Your resume has strong ATS readability. Review the suggestions below to maximize your callback rate.'
                      : review.overallScore >= 60
                      ? 'Your resume has a decent foundation. Addressing the highlighted weaknesses will significantly improve your chances.'
                      : 'Your resume needs significant improvements. Work through each suggestion below to boost your score.'}
                  </p>
                </div>
              </div>

              {/* Breakdown Bars Card */}
              <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-5">
                <h4 className="font-display text-sm font-bold text-text-primary">Score Breakdown</h4>

                {/* ATS Score bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium text-text-secondary">
                    <span>ATS Compatibility</span>
                    <span>{review.atsScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${review.atsScore}%` }}
                      transition={{ duration: 1, delay: 0 }}
                      className={`h-full rounded-full ${
                        review.atsScore >= 80 ? 'bg-teal' : review.atsScore >= 60 ? 'bg-indigo' : 'bg-gold'
                      }`}
                    />
                  </div>
                </div>

                {/* Quantified Achievements bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium text-text-secondary">
                    <span>Quantified Achievements</span>
                    <span>{review.quantifiedAchievements}%</span>
                  </div>
                  <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${review.quantifiedAchievements}%` }}
                      transition={{ duration: 1, delay: 0.1 }}
                      className={`h-full rounded-full ${
                        review.quantifiedAchievements >= 80
                          ? 'bg-teal'
                          : review.quantifiedAchievements >= 60
                          ? 'bg-indigo'
                          : 'bg-gold'
                      }`}
                    />
                  </div>
                </div>

                {/* Overall score bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium text-text-secondary">
                    <span>Overall Quality</span>
                    <span>{review.overallScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${review.overallScore}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        review.overallScore >= 80
                          ? 'bg-teal'
                          : review.overallScore >= 60
                          ? 'bg-indigo'
                          : 'bg-gold'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Strengths Card */}
              {review.strengths && review.strengths.length > 0 && (
                <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-3">
                  <h4 className="font-display text-sm font-bold text-text-primary flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {review.strengths.map((strength, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed"
                      >
                        <span className="text-teal mt-0.5 flex-shrink-0">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ---- Right Column: Weaknesses & Suggestions (Col span 7) ---- */}
            <div className="lg:col-span-7 space-y-4">

              {/* ATS Score highlight banner */}
              <div className="bg-white border border-border-default rounded-card p-5 shadow-card flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-teal/5 border border-teal/10 flex-shrink-0">
                  <span className="text-xl font-extrabold text-teal">{review.atsScore}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-0.5">
                    ATS Compatibility Score
                  </p>
                  <p className="text-sm text-text-primary font-semibold">
                    {review.atsScore >= 80
                      ? '🎉 Great! Your resume is highly ATS-compatible.'
                      : review.atsScore >= 60
                      ? '⚠️ Moderate compatibility. Review keyword suggestions.'
                      : '❌ Low compatibility. Prioritize ATS fixes immediately.'}
                  </p>
                </div>
              </div>

              {/* Weaknesses / Suggestions */}
              <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
                <h4 className="font-display text-sm font-bold text-text-primary flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Actionable Suggestions
                </h4>

                {review.weaknesses && review.weaknesses.length > 0 ? (
                  <div className="space-y-3">
                    {review.weaknesses.map((item, idx) => {
                      const config = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.medium
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-btn border text-xs leading-relaxed space-y-2 ${config.bg} ${config.border} ${config.text}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-bold text-xs">
                              <span>{config.icon}</span>
                              <span className="leading-snug">{item.issue}</span>
                            </div>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex-shrink-0 ${config.badge}`}
                            >
                              {config.label}
                            </span>
                          </div>
                          {item.suggestion && (
                            <div className="pt-1.5 border-t border-black/5 flex gap-1.5 items-start">
                              <span className="font-bold text-[10px] uppercase tracking-wide text-text-primary flex-shrink-0">
                                How to fix:
                              </span>
                              <span className="text-[10px] text-text-secondary leading-normal">
                                {item.suggestion}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-muted text-sm">
                    <XCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    No significant weaknesses found. Great resume!
                  </div>
                )}
              </div>

              {/* Upload another file prompt */}
              <div className="bg-bg-subtle border border-border-default rounded-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-text-primary">Updated your resume?</p>
                  <p className="text-[11px] text-text-muted">Re-upload to get a fresh AI review.</p>
                </div>
                <button
                  onClick={resetReviewer}
                  className="px-4 py-2 bg-white border border-border-default text-xs font-bold text-text-primary rounded-btn hover:border-teal hover:text-teal transition-colors"
                >
                  Upload New
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
