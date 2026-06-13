'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react'

export default function ResumePage() {
  const [step, setStep] = useState<'upload' | 'loading' | 'results'>('upload')
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('Parsing document structure...')
  const [analysisData, setAnalysisData] = useState<any>(null)

  // Fetch existing resume analysis from DB on load
  useEffect(() => {
    fetch('/api/resume')
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setAnalysisData(data)
          setStep('results')
        }
      })
      .catch(console.error)
  }, [])

  const loadingMessages = [
    'Parsing document structure...',
    'Extracting headers & contact info...',
    'Evaluating action verbs...',
    'Checking ATS keyword matching...',
    'Quantifying impact statements...',
    'Compiling evaluation report...',
  ]

  // Handle Mock File Drop/Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      setStep('loading')
    }
  }

  // Handle Drag & Drop Mock
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name)
      setStep('loading')
    }
  }

  // Handle simulated loading
  useEffect(() => {
    if (step !== 'loading') return

    setProgress(0)
    let currentMsgIdx = 0
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Hit the backend to process and save the resume
          fetch('/api/resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName })
          })
          .then(res => res.json())
          .then(data => {
            setAnalysisData(data)
            setStep('results')
          })
          return 100
        }
        return prev + 4
      })
    }, 100)

    const messageInterval = setInterval(() => {
      currentMsgIdx = (currentMsgIdx + 1) % loadingMessages.length
      setLoadingMessage(loadingMessages[currentMsgIdx])
    }, 800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [step])

  const resetReviewer = () => {
    setFileName('')
    setProgress(0)
    setStep('upload')
  }

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
        {/* Step 1: Upload */}
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-border-default rounded-card p-10 shadow-card flex flex-col items-center justify-center text-center max-w-2xl mx-auto min-h-[350px]"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full bg-teal/5 flex items-center justify-center text-teal mb-6">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="font-display text-lg font-bold text-text-primary mb-2">
              Upload your resume
            </h3>
            <p className="text-text-muted text-xs max-w-sm mb-8">
              Supports PDF, DOCX, or TXT format. Maximum size 5MB. Files are analyzed securely using Claude API.
            </p>

            <label className="px-6 py-3 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn cursor-pointer transition-all shadow-teal-glow active:scale-95">
              <span>Choose File</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <p className="text-[10px] text-text-muted mt-4">
              Or drag and drop your file here
            </p>
          </motion.div>
        )}

        {/* Step 2: Loading Analysis */}
        {step === 'loading' && (
          <motion.div
            key="loading"
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
              Analyzing {fileName || 'Resume'}
            </p>
            <p className="text-text-muted text-xs h-8 flex items-center justify-center">
              {loadingMessage}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-bg-subtle h-2 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="bg-teal h-full rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-[10px] font-mono text-text-muted mt-2">{progress}% completed</span>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Visual Resume Mockup (Col span 5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={resetReviewer}
                  className="flex items-center gap-1 text-xs text-text-secondary hover:text-teal font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Upload another file</span>
                </button>
                <span className="text-[10px] text-text-muted truncate max-w-[200px]">
                  📄 {fileName || 'resume.pdf'}
                </span>
              </div>

              {/* Document Mockup View */}
              <div className="bg-white border border-border-default rounded-card p-6 shadow-card min-h-[500px] font-mono relative overflow-hidden select-none">
                {/* Visual Highlights representing errors */}
                <div className="absolute left-6 right-6 top-28 h-6 bg-red-500/10 border border-red-500/20 rounded cursor-pointer group flex items-center justify-between px-2 text-[9px] text-red-700">
                  <span>🔴 Missing quantified achievements</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Fix</span>
                </div>
                
                <div className="absolute left-6 right-6 top-[280px] h-6 bg-yellow-500/10 border border-yellow-500/20 rounded cursor-pointer group flex items-center justify-between px-2 text-[9px] text-yellow-700">
                  <span>🟡 Weak passive verb used: &quot;worked on&quot;</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Fix</span>
                </div>

                {/* PDF Text Skeleton */}
                <div className="text-center pb-6 border-b border-border-subtle">
                  <h3 className="font-sans font-bold text-lg text-text-primary">PRIYA SHARMA</h3>
                  <p className="text-[10px] text-text-muted mt-1">Jaipur, India | priya@jklu.edu.in | github.com/priya</p>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Experience Section */}
                  <div>
                    <h4 className="font-sans font-bold text-xs text-text-primary border-b border-border-subtle pb-1">EXPERIENCE</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-[10px] text-text-primary font-bold">
                        <span>Frontend Intern — Tech Solutions</span>
                        <span>Summer 2023</span>
                      </div>
                      <ul className="list-disc pl-4 text-[9px] text-text-secondary space-y-1">
                        <li>Worked on creating layout components using React.</li>
                        <li>Responsible for testing user interaction interfaces.</li>
                        <li>Improved application speed and bug counts.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Education Section */}
                  <div>
                    <h4 className="font-sans font-bold text-xs text-text-primary border-b border-border-subtle pb-1">EDUCATION</h4>
                    <div className="mt-2 flex justify-between text-[10px] text-text-primary">
                      <div>
                        <span className="font-bold">B.Tech in Computer Science</span>
                        <p className="text-text-secondary mt-0.5">JK Lakshmipat University, Jaipur</p>
                      </div>
                      <span className="font-bold">CGPA: 8.8 / 10.0</span>
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div>
                    <h4 className="font-sans font-bold text-xs text-text-primary border-b border-border-subtle pb-1">WHAT I BUILT</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-[10px] text-text-primary font-bold">
                        <span>Smart Attendance System</span>
                        <span>Spring 2024</span>
                      </div>
                      <ul className="list-disc pl-4 text-[9px] text-text-secondary space-y-1">
                        <li>Created a face recognition dashboard for classes.</li>
                        <li>Connected backend with database using Flask.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Score & Details (Col span 7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Score Summary Card */}
              <div className="bg-white border border-border-default rounded-card p-6 shadow-card flex flex-col sm:flex-row items-center gap-6">
                {/* Circular Score Ring */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="#EEF2FF"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="#0D9488"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 48}
                      initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - (analysisData?.overallScore || 0) / 100) }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-extrabold text-text-primary">{analysisData?.overallScore}</span>
                    <span className="text-[9px] text-text-muted font-bold uppercase">ATS Score</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal/5 text-teal text-[10px] font-bold border border-teal/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ATS Compatible Format</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-text-primary">Excellent Foundation!</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Your resume has high ATS readability. However, you can significantly boost callbacks by quantifying your impact metrics and standardizing your section headers.
                  </p>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
                <h4 className="font-display text-sm font-bold text-text-primary">Score Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisData?.breakdown.map((item: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-text-secondary">
                        <span>{item.label}</span>
                        <span>{item.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.score / item.maxScore) * 100}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full rounded-full ${item.score >= 80 ? 'bg-teal' : item.score >= 70 ? 'bg-indigo' : 'bg-gold'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Feedback list */}
              <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
                <h4 className="font-display text-sm font-bold text-text-primary">Actionable Suggestions</h4>
                
                <div className="space-y-3">
                  {analysisData?.feedback.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-btn border text-xs leading-relaxed space-y-1.5 ${
                        item.severity === 'critical'
                          ? 'bg-red-50/50 border-red-100 text-red-950'
                          : item.severity === 'improve'
                          ? 'bg-amber-50/50 border-amber-100 text-amber-950'
                          : 'bg-green-50/50 border-green-100 text-green-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                      </div>
                      <p className="text-text-secondary text-[11px] leading-normal">{item.description}</p>
                      {item.fix && (
                        <div className="pt-1.5 border-t border-black/5 flex gap-1.5 items-start">
                          <span className="font-bold text-[10px] uppercase tracking-wide text-text-primary">How to fix:</span>
                          <span className="text-[10px] text-text-secondary leading-normal">{item.fix}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
