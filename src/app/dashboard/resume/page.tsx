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
  Target,
  RefreshCw,
  Compass,
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { getPusherClient } from '@/lib/pusher-client'
import { getResumeChannel, RESUME_EVENTS } from '@/lib/pusher-shared'

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
  'Running AI analysis...',
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
  const [activeTarget, setActiveTarget] = useState<any | null>(null)
  const [loadingCompare, setLoadingCompare] = useState(false)
  const [reportTab, setReportTab] = useState<'report' | 'comparison'>('report')
  const { user } = useUser()

  // ---- Pusher Subscription ----
  useEffect(() => {
    if (!user) return

    const pusher = getPusherClient()
    const channelName = getResumeChannel(user.id)
    const channel = pusher.subscribe(channelName)

    channel.bind(RESUME_EVENTS.UPLOAD_STARTED, (data: any) => {
      setLoadingMessage(`Uploading ${data.fileName || 'file'}...`)
      setProgress(10)
    })

    channel.bind(RESUME_EVENTS.UPLOAD_COMPLETE, () => {
      setLoadingMessage('Extracting text...')
      setProgress(30)
    })

    channel.bind(RESUME_EVENTS.TEXT_EXTRACTED, () => {
      setLoadingMessage('Initializing AI analysis...')
      setProgress(40)
    })

    channel.bind(RESUME_EVENTS.AI_STARTED, () => {
      setLoadingMessage('AI is reviewing your resume...')
      setProgress(60)
    })

    channel.bind(RESUME_EVENTS.AI_COMPLETE, (data: any) => {
      setProgress(100)
    })

    channel.bind(RESUME_EVENTS.ERROR, (data: any) => {
      setErrorMessage(data.message || 'An error occurred during analysis.')
      setStep('error')
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(channelName)
    }
  }, [user])

  // ---- On page load: fetch existing resume result & active target ----
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
    async function fetchActiveTarget() {
      try {
        const res = await fetch('/api/career-target')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setActiveTarget(data)
          }
        }
      } catch (err) {
        console.error('Failed to fetch active career target:', err)
      }
    }
    fetchExistingResume()
    fetchActiveTarget()
  }, [])

  // ---- Animated progress bar fallback (removed, using real Pusher events) ----

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

      // Pusher AI_COMPLETE event sets progress to 100, but we can do it here too just in case

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
        if (reviewData.careerTargetAlignment) {
          setActiveTarget(reviewData.careerTargetAlignment)
        } else {
          // fetch latest target from DB to see if target was updated in background
          fetch('/api/career-target')
            .then(res => res.json())
            .then(data => { if (data) setActiveTarget(data) })
            .catch(() => {})
        }
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
      <div className="!bg-[#FAFAFA] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm mb-6">
        <h1 className="font-display text-3xl font-extrabold !text-[#0F172A]">
          AI Resume Reviewer
        </h1>
        <p className="!text-[#475569] text-sm mt-1">
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
              Supports PDF and DOCX formats. Maximum size 5MB. Files are analyzed securely using AI.
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
            className="space-y-6"
          >
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-border-default p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={resetReviewer}
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-teal font-semibold transition-colors bg-bg-subtle px-3 py-1.5 rounded-lg border border-border-default"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Upload Another</span>
                </button>
                <span className="text-xs text-text-secondary font-medium truncate max-w-[200px] border-l pl-4 border-border-subtle">
                  📄 {fileName}
                </span>
              </div>

              {activeTarget && (
                <div className="flex bg-bg-subtle p-1 rounded-lg border border-border-default self-stretch sm:self-auto">
                  <button
                    onClick={() => setReportTab('report')}
                    className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                      reportTab === 'report'
                        ? 'bg-white text-text-primary shadow-sm'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    ATS report
                  </button>
                  <button
                    onClick={() => setReportTab('comparison')}
                    className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                      reportTab === 'comparison'
                        ? 'bg-white text-text-primary shadow-sm'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Excellence Alignment
                  </button>
                </div>
              )}
            </div>

            {/* 3 Idiots Excellence Banner */}
            {activeTarget && reportTab === 'comparison' && (
              <div className="bg-gradient-to-r from-teal/10 to-indigo/5 border border-teal/20 rounded-xl p-5 flex items-start gap-4 shadow-sm">
                <div className="p-3 bg-teal text-white rounded-lg">
                  <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0D9488] font-display">
                    3 Idiots Wisdom: Aim for Excellence (The Resume, Not The Job)
                  </h4>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    "Make yourself capable, aim for excellence, and success will chase you." Compare your current resume side-by-side with the target Resume of Excellence. Your goal is to fill the missing gaps (marked in amber) and build target projects until this blueprint becomes your actual resume.
                  </p>
                </div>
              </div>
            )}

            {reportTab === 'comparison' && activeTarget ? (
              // COMPARISON TAB
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Current Resume Stats & Detected Gaps */}
                <div className="space-y-6">
                  <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2 border-b pb-3">
                      Your Current Resume Stats
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-bg-subtle/40 p-4 rounded-xl border border-border-subtle">
                        <span className="block text-2xl font-black text-teal">{review.overallScore}</span>
                        <span className="text-[10px] text-text-muted font-bold uppercase">Overall Score</span>
                      </div>
                      <div className="bg-bg-subtle/40 p-4 rounded-xl border border-border-subtle">
                        <span className="block text-2xl font-black text-indigo">{review.atsScore}</span>
                        <span className="text-[10px] text-text-muted font-bold uppercase">ATS Score</span>
                      </div>
                      <div className="bg-bg-subtle/40 p-4 rounded-xl border border-border-subtle">
                        <span className="block text-2xl font-black text-gold">{review.quantifiedAchievements}</span>
                        <span className="text-[10px] text-text-muted font-bold uppercase">Quantified Impact</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Strengths Detected</h4>
                      <ul className="space-y-1.5 text-xs text-text-secondary">
                        {review.strengths.slice(0, 4).map((st, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-teal font-bold">✓</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Key Critical Suggestions</h4>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {review.weaknesses.slice(0, 3).map((wk, i) => {
                          const SEV = wk.severity === 'high' ? '🔴 High' : wk.severity === 'medium' ? '🟡 Medium' : '🟢 Low'
                          return (
                            <div key={i} className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-xs">
                              <div className="font-bold flex items-center justify-between">
                                <span className="text-text-primary">⚠️ {wk.issue}</span>
                                <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">{SEV}</span>
                              </div>
                              <p className="mt-1 text-text-secondary leading-normal text-[11px]">{wk.suggestion}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {activeTarget.gapAnalysis && (
                    <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2 border-b pb-3">
                        Bridge Gaps Checklist
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Matched Skills ({activeTarget.gapAnalysis.matchingSkills?.length || 0})</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeTarget.gapAnalysis.matchingSkills?.map((sk: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full">
                                ✓ {sk}
                              </span>
                            ))}
                            {(!activeTarget.gapAnalysis.matchingSkills || activeTarget.gapAnalysis.matchingSkills.length === 0) && (
                              <span className="text-xs text-text-muted italic">None matching yet</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1.5">Missing Skills Gaps ({activeTarget.gapAnalysis.missingSkills?.length || 0})</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeTarget.gapAnalysis.missingSkills?.map((sk: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                                ✗ {sk}
                              </span>
                            ))}
                            {(!activeTarget.gapAnalysis.missingSkills || activeTarget.gapAnalysis.missingSkills.length === 0) && (
                              <span className="text-xs text-green-700 italic">All skills matched!</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Perfect Target Resume Mapping */}
                <div className="space-y-6">
                  {activeTarget.gapAnalysis ? (
                    <>
                      {activeTarget.perfectResume ? (
                        <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4 max-h-[550px] overflow-y-auto font-sans text-xs">
                          <div className="text-center pb-3 border-b border-gray-200">
                            <h4 className="text-sm font-bold text-gray-900 uppercase">Target Resume of Excellence</h4>
                            <p className="text-[10px] text-teal font-semibold mt-0.5">Blueprint for {activeTarget.targetTitle}</p>
                          </div>

                          {/* Target Summary */}
                          <div className="space-y-1">
                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Target Profile Summary</span>
                            <p className="italic text-gray-600 leading-relaxed">{activeTarget.perfectResume.summary}</p>
                          </div>

                          {/* Target Skills */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Target Skills Mapping</span>
                            <div className="space-y-2 pl-1">
                              {activeTarget.perfectResume.skills.map((grp: any, i: number) => (
                                <div key={i} className="space-y-1">
                                  <span className="font-bold text-gray-800 text-[10px] uppercase block">{grp.category}:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {grp.items.map((item: string, idx: number) => {
                                      const isMatched = activeTarget.gapAnalysis.matchingSkills?.some((s: string) => s.toLowerCase() === item.toLowerCase() || item.toLowerCase().includes(s.toLowerCase()))
                                      return (
                                        <span
                                          key={idx}
                                          className={`text-[9px] font-semibold px-2 py-0.5 rounded border transition-all ${
                                            isMatched
                                              ? 'bg-green-50 text-green-700 border-green-200'
                                              : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                          }`}
                                        >
                                          {isMatched ? '✓' : '✗'} {item}
                                        </span>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Target Experience / Milestones */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Target Milestones Checklist</span>
                            <div className="space-y-2.5 pl-1">
                              {activeTarget.perfectResume.experience.map((exp: any, i: number) => (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between font-bold text-gray-800 text-[10px]">
                                    <span>{exp.role} @ {exp.organization}</span>
                                    <span className="text-gray-400 font-normal">{exp.duration}</span>
                                  </div>
                                  <ul className="list-disc pl-4 space-y-1 text-gray-500 text-[11px]">
                                    {exp.bullets.map((bullet: string, idx: number) => (
                                      <li key={idx} className="leading-relaxed">{bullet}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Target Projects */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Standout Portfolio Projects (Aspirational)</span>
                            <div className="space-y-3 pl-1">
                              {activeTarget.perfectResume.projects.map((proj: any, i: number) => (
                                <div key={i} className="space-y-1 p-2.5 bg-bg-base/40 rounded-lg border border-border-default">
                                  <div className="flex justify-between font-bold text-gray-800 text-[10px]">
                                    <span>{proj.title}</span>
                                    <span className="text-teal text-[9px] uppercase font-bold">{proj.technologies.join(' | ')}</span>
                                  </div>
                                  <p className="text-gray-500 text-[10px] leading-relaxed">{proj.description}</p>
                                  <ul className="list-disc pl-4 space-y-0.5 text-gray-500 text-[10px] mt-1">
                                    {proj.bullets.map((bullet: string, idx: number) => (
                                      <li key={idx} className="leading-relaxed">{bullet}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-border-default rounded-card p-8 text-center text-xs text-text-muted">
                          Constructing perfect resume for this target... please refresh target or run comparison again.
                        </div>
                      )}

                      {/* Bridge Gaps Action Roadmap Card */}
                      <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-text-primary">Ready to build this Resume?</h4>
                            <p className="text-xs text-text-muted mt-0.5">We've constructed a week-by-week learning roadmap to unlock these missing elements.</p>
                          </div>
                          <Link
                            href="/dashboard/roadmap"
                            className="px-5 py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-all shadow-teal-glow flex items-center gap-1"
                          >
                            <span>Start Prep Roadmap</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white border border-border-default rounded-card p-8 text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
                      <Target className="w-12 h-12 text-teal animate-pulse" />
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">Run Target Gap Analysis</h4>
                        <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto leading-relaxed">
                          We will contrast your current resume details with the target Resume of Excellence to find your exact skill and project gaps.
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          if (!resumeData?.resumeId) return
                          setLoadingCompare(true)
                          try {
                            const res = await fetch('/api/career-target/compare', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ resumeId: resumeData.resumeId })
                            })
                            if (res.ok) {
                              const updated = await res.json()
                              setActiveTarget(updated)
                            }
                          } catch (err) {
                            console.error('Failed to run comparison:', err)
                          } finally {
                            setLoadingCompare(false)
                          }
                        }}
                        disabled={loadingCompare}
                        className="px-6 py-2.5 bg-teal text-white text-xs font-bold rounded-btn transition-all shadow-teal-glow flex items-center gap-1.5"
                      >
                        {loadingCompare ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Analyzing gaps...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Run Analysis Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // REGULAR REPORT TAB
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ---- Left Column: Score Overview (Col span 5) ---- */}
                <div className="lg:col-span-5 space-y-4">
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
                        <span>AI Analysis</span>
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

                  {/* Target Career Readiness Card */}
                  {activeTarget ? (
                    <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
                      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-teal" />
                          <h4 className="font-display text-sm font-bold text-text-primary">
                            Target: {activeTarget.targetTitle}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal/5 text-teal border border-teal/10 uppercase">
                          {activeTarget.targetType}
                        </span>
                      </div>

                      {!activeTarget.gapAnalysis ? (
                        <div className="text-center py-4 space-y-3">
                          <p className="text-xs text-text-secondary">
                            Analyze how well your resume matches the ideal profile for this target.
                          </p>
                          <button
                            onClick={async () => {
                              if (!resumeData?.resumeId) return
                              setLoadingCompare(true)
                              try {
                                const res = await fetch('/api/career-target/compare', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ resumeId: resumeData.resumeId })
                                })
                                if (res.ok) {
                                  const updated = await res.json()
                                  setActiveTarget(updated)
                                }
                              } catch (err) {
                                console.error('Failed to run comparison:', err)
                              } finally {
                                const el = document.getElementById('compare-tab-btn')
                                if (el) el.click()
                                setLoadingCompare(false)
                              }
                            }}
                            disabled={loadingCompare}
                            className="w-full py-2 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-all flex items-center justify-center gap-1.5"
                          >
                            {loadingCompare ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Analyzing gaps...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Run Target Gap Analysis</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Readiness score gauge */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-text-secondary">Path Readiness Score</span>
                            <span className="text-sm font-extrabold text-teal">
                              {activeTarget.readinessScore}% Ready
                            </span>
                          </div>
                          <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-teal h-full rounded-full transition-all duration-1000"
                              style={{ width: `${activeTarget.readinessScore}%` }}
                            />
                          </div>

                          {/* Matching vs Missing Skills */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block mb-1">
                                Matching Skills ({activeTarget.gapAnalysis.matchingSkills?.length || 0})
                              </span>
                              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-0.5">
                                {activeTarget.gapAnalysis.matchingSkills?.map((s: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] font-medium px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-100"
                                  >
                                    ✓ {s}
                                  </span>
                                ))}
                                {(activeTarget.gapAnalysis.matchingSkills?.length || 0) === 0 && (
                                  <span className="text-[9px] text-text-muted italic">None matching yet</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                                Missing Gaps ({activeTarget.gapAnalysis.missingSkills?.length || 0})
                              </span>
                              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-0.5">
                                {activeTarget.gapAnalysis.missingSkills?.map((s: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] font-medium px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-100"
                                  >
                                    ✗ {s}
                                  </span>
                                ))}
                                {(activeTarget.gapAnalysis.missingSkills?.length || 0) === 0 && (
                                  <span className="text-[9px] text-green-700 italic">All skills matched!</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Target Action Steps */}
                          {activeTarget.gapAnalysis.actionSteps && activeTarget.gapAnalysis.actionSteps.length > 0 && (
                            <div className="pt-2 border-t border-border-subtle space-y-1.5">
                              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                                Action Plan to Bridge Gaps
                              </span>
                              <div className="space-y-1">
                                {activeTarget.gapAnalysis.actionSteps.map((stepStr: string, idx: number) => (
                                  <div key={idx} className="flex items-start gap-1.5 text-[10px] text-text-secondary leading-tight">
                                    <span className="text-teal font-bold">{idx + 1}.</span>
                                    <span>{stepStr}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-bg-subtle/30 border border-dashed border-border-default rounded-card p-5 shadow-card text-center space-y-3">
                      <Compass className="w-6 h-6 text-text-muted mx-auto" />
                      <div>
                        <h4 className="text-xs font-bold text-text-primary">Want to target a specific career?</h4>
                        <p className="text-[10px] text-text-muted mt-1 font-medium leading-relaxed">
                          Define a SDE, Data Analyst, Gig, or Research outcome to measure your alignment gaps.
                        </p>
                      </div>
                      <Link
                        href="/dashboard/path"
                        className="w-full py-2 bg-white border border-border-default text-text-primary hover:border-teal hover:text-teal text-xs font-bold rounded-btn transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Define Your Path ✦</span>
                      </Link>
                    </div>
                  )}

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
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
