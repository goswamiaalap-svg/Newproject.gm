'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  Award,
  Clock,
  ArrowRight,
  Play,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Code2,
  Layers,
  Cpu,
  UserCheck,
  Building2,
  HelpCircle,
  Check,
  FileCode,
  RotateCcw,
  Bot
} from 'lucide-react'
import { trackEvent } from '@/lib/events'
import confetti from 'canvas-confetti'

interface Question {
  id: number
  question: string
  category: string
  difficulty: string
  timeLimit: number
  hint?: string
}

interface InterviewResult {
  overallScore: number
  targetRole: string
  breakdown: {
    correctness: number
    clarity: number
    depth: number
    communication: number
    speed: number
  }
  questionResults: Array<{
    questionId: number
    score: number
    feedback: string
    idealAnswer: string
  }>
}

const CATEGORIES = [
  { id: 'DSA', name: 'Data Structures & Algorithms', desc: 'Coding, complexity, & optimization', icon: Code2, color: 'from-blue-500 to-indigo-600' },
  { id: 'System Design', name: 'System Design & Architecture', desc: 'High-level scale, database & caching', icon: Layers, color: 'from-teal-500 to-emerald-600' },
  { id: 'OS Concepts', name: 'CS Core (OS, DBMS, Networks)', desc: 'Processes, concurrency, SQL & IP', icon: Cpu, color: 'from-purple-500 to-violet-600' },
  { id: 'Behavioral', name: 'Behavioral & HR Round', desc: 'STAR technique, leadership & scenarios', icon: UserCheck, color: 'from-amber-500 to-orange-600' },
]

const COMPANIES = [
  { id: 'Amazon', name: 'Amazon', badge: 'Leadership Principles & Coding' },
  { id: 'Google', name: 'Google', badge: 'Googliness & DSA Rigor' },
  { id: 'TCS', name: 'TCS Digital', badge: 'Core Aptitude & Fundamentals' },
  { id: 'Flipkart', name: 'Flipkart', badge: 'Machine Coding & Architecture' },
  { id: 'Microsoft', name: 'Microsoft', badge: 'Problem Solving & Systems' },
  { id: 'Meta', name: 'Meta', badge: 'Speed Coding & Behavioral' },
]

const DIFFICULTIES = [
  { id: 'Easy', label: 'Easy (Entry Level)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Medium', label: 'Medium (SDE-1 / SDE-2)', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Hard', label: 'Hard (Senior SDE)', color: 'bg-rose-50 text-rose-700 border-rose-200' },
]

export default function MockInterviewPage() {
  const [stage, setStage] = useState<'setup' | 'interview' | 'evaluating' | 'results'>('setup')
  const [category, setCategory] = useState('DSA')
  const [difficulty, setDifficulty] = useState('Medium')
  const [company, setCompany] = useState('Amazon')
  
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(180)
  const [showHint, setShowHint] = useState(false)
  
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<any>(null)

  const [evaluationProgress, setEvaluationProgress] = useState(0)
  const [interviewResult, setInterviewResult] = useState<InterviewResult | null>(null)
  const [evalError, setEvalError] = useState<string | null>(null)
  const [activeAccordionIdx, setActiveAccordionIdx] = useState<number | null>(0)

  // Initialize Speech Recognition capability check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
      }
    }
  }, [])

  // Timer effect during active interview stage
  useEffect(() => {
    if (stage !== 'interview' || questions.length === 0) return

    const activeQ = questions[currentQuestionIdx]
    if (activeQ) {
      setTimeLeft(activeQ.timeLimit || 180)
    }

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown)
          handleNextQuestion()
          return 0
        }
        return prev - 1
      })
    }, 1000) // Correct 1 second tick rate

    return () => clearInterval(countdown)
  }, [stage, currentQuestionIdx, questions])

  // Camera stream handler
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
        mediaStreamRef.current = null
      }
      setIsCameraActive(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        mediaStreamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setIsCameraActive(true)
      } catch (err) {
        console.warn('Camera access denied or unavailable:', err)
        alert('Could not access camera preview. Please check browser permissions.')
      }
    }
  }

  // Voice speech-to-text handler
  const toggleMic = () => {
    if (!speechSupported) {
      alert('Voice Speech-to-Text is not supported in this browser version. You can type your solution directly.')
      return
    }

    if (isMicActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsMicActive(false)
    } else {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
          let transcript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          if (transcript) {
            setCurrentAnswer((prev) => {
              const cleaned = prev ? prev.trim() + ' ' : ''
              return cleaned + transcript
            })
          }
        }

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err)
          setIsMicActive(false)
        }

        recognition.onend = () => {
          setIsMicActive(false)
        }

        recognition.start()
        recognitionRef.current = recognition
        setIsMicActive(true)
      } catch (err) {
        console.error('Speech recognition start failed:', err)
        setIsMicActive(false)
      }
    }
  }

  // Fetch dynamic AI questions and start session
  const handleStartInterview = async () => {
    setIsFetchingQuestions(true)
    setEvalError(null)
    try {
      const res = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, company }),
      })
      const data = await res.json()
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
      } else {
        throw new Error(data.error || 'Failed to generate interview questions')
      }
    } catch (err: any) {
      console.warn('Questions API fallback activated:', err)
      setQuestions([
        {
          id: 1,
          question: `[${company} ${difficulty} Round] Given an array of integers nums and an integer target, return indices of two numbers that add up to target. Detail your time and space complexity O(N).`,
          category,
          difficulty,
          timeLimit: 180,
          hint: 'Consider using a Hash Map to store values and indices for O(1) lookup.'
        },
        {
          id: 2,
          question: `[${company} ${difficulty} Round] Design a Least Recently Used (LRU) Cache supporting get(key) and put(key, value) in O(1) average time complexity.`,
          category,
          difficulty,
          timeLimit: 240,
          hint: 'Use a Doubly Linked List paired with a Hash Map.'
        },
        {
          id: 3,
          question: `[${company} ${difficulty} Round] Explain process vs thread execution, context switching overhead, and thread synchronization strategies.`,
          category,
          difficulty,
          timeLimit: 180,
          hint: 'Discuss virtual memory, CPU registers, PCB/TCB data structures, and Mutexes.'
        }
      ])
    } finally {
      setAnswers({})
      setCurrentQuestionIdx(0)
      setCurrentAnswer('')
      setShowHint(false)
      setStage('interview')
      setIsFetchingQuestions(false)
      trackEvent('Mock interview started', { category, company, difficulty })
    }
  }

  // Next question or submit evaluation
  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestionIdx]
    if (!currentQ) return

    const updatedAnswers = {
      ...answers,
      [currentQ.id]: currentAnswer,
    }
    setAnswers(updatedAnswers)

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1)
      setCurrentAnswer('')
      setShowHint(false)
    } else {
      // Final question complete -> submit evaluation
      submitEvaluation(updatedAnswers)
    }
  }

  // Submit interview responses to AI evaluation API
  const submitEvaluation = async (finalAnswers: Record<number, string>) => {
    setStage('evaluating')
    setEvalError(null)
    setEvaluationProgress(15)

    const timer1 = setTimeout(() => setEvaluationProgress(45), 1000)
    const timer2 = setTimeout(() => setEvaluationProgress(75), 2500)
    const timer3 = setTimeout(() => setEvaluationProgress(90), 4000)

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: `${company} - ${category} (${difficulty})`,
          questions,
          answers: finalAnswers,
        }),
      })

      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Evaluation server error')
      }

      const data = await res.json()
      setEvaluationProgress(100)
      setInterviewResult(data)
      setStage('results')

      // Trigger celebratory confetti if score is solid
      if (data.overallScore >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    } catch (err: any) {
      console.error('Evaluation failed:', err)
      setEvalError(err.message || 'Failed to submit interview for evaluation.')
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const insertTemplateText = (templateType: 'code' | 'star' | 'system') => {
    if (templateType === 'code') {
      setCurrentAnswer((prev) => prev + '\n```javascript\n// Approach & Complexity:\n// Time: O(N), Space: O(N)\nfunction solution(input) {\n  // Implementation here\n}\n```')
    } else if (templateType === 'star') {
      setCurrentAnswer((prev) => prev + '\n**Situation:** \n**Task:** \n**Action:** \n**Result:** ')
    } else if (templateType === 'system') {
      setCurrentAnswer((prev) => prev + '\n1. Requirements & Scale:\n2. API Endpoints:\n3. Database Schema:\n4. Caching & Scaling Strategy:')
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner (Hidden during live interview studio mode) */}
      {stage !== 'interview' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>AI-Powered Technical Assessment</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Mock Interview Simulator
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
              Rehearse target-company interview rounds with real-time AI evaluation, dynamic problem generation, and detailed SDE feedback.
            </p>
          </div>
          {stage === 'results' && (
            <button
              onClick={() => setStage('setup')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Configure New Interview</span>
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STAGE 1: SETUP */}
        {stage === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs space-y-8">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  1. Select Category / Domain
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    const isSelected = category === cat.id
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start gap-3.5 relative overflow-hidden ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-600/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl text-white bg-gradient-to-br ${cat.color} shadow-xs shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 pr-6">
                          <h4 className="font-bold text-sm text-slate-900">{cat.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{cat.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Company Template Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  2. Select Target Company Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COMPANIES.map((comp) => {
                    const isSelected = company === comp.id
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => setCompany(comp.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/40 font-bold text-slate-900 shadow-xs ring-2 ring-teal-500/20'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className="text-sm font-semibold text-slate-900">{comp.name}</span>
                        </div>
                        <span className="block text-[10px] text-slate-500 mt-1 line-clamp-1">{comp.badge}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  3. Select Round Difficulty
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {DIFFICULTIES.map((diff) => {
                    const isSelected = difficulty === diff.id
                    return (
                      <button
                        key={diff.id}
                        type="button"
                        onClick={() => setDifficulty(diff.id)}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                          isSelected
                            ? `${diff.color} ring-2 ring-slate-400/20 shadow-xs`
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {diff.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={isFetchingQuestions}
                onClick={handleStartInterview}
                className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-teal-600/20 transition-all active:scale-[0.99] disabled:opacity-75 cursor-pointer text-base"
              >
                {isFetchingQuestions ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating AI Interview Questions...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Start Mock Interview Session</span>
                  </>
                )}
              </button>
            </div>

            {/* Preparation Guidelines Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <Bot className="w-5 h-5" />
                  <span className="!text-teal-400">AI Assessment Rules</span>
                </div>
                <ul className="space-y-4 text-xs leading-relaxed">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-teal-300 font-bold flex items-center justify-center shrink-0 border border-slate-700">1</span>
                    <span className="!text-slate-300"><strong className="!text-slate-100">Dynamic Generation:</strong> Questions are generated specifically for your selected role & target company template.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-teal-300 font-bold flex items-center justify-center shrink-0 border border-slate-700">2</span>
                    <span className="!text-slate-300"><strong className="!text-slate-100">Code & Explanation:</strong> For DSA/System Design, type your code and mention time/space complexities clearly.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-teal-300 font-bold flex items-center justify-center shrink-0 border border-slate-700">3</span>
                    <span className="!text-slate-300"><strong className="!text-slate-100">Camera & Voice:</strong> Enable webcam preview or Voice-to-Text speech transcription during the session.</span>
                  </li>
                </ul>
              </div>

              {/* Sample Target Card */}
              <div className="bg-gradient-to-br from-indigo-50/80 to-teal-50/80 rounded-3xl p-5 border border-indigo-100/80 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Active Parameters</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <p><span className="font-semibold text-slate-900">Target Role:</span> {company} SDE Assessment</p>
                  <p><span className="font-semibold text-slate-900">Category:</span> {category}</p>
                  <p><span className="font-semibold text-slate-900">Difficulty:</span> {difficulty}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: INTERVIEW STUDIO ROOM */}
        {stage === 'interview' && questions.length > 0 && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="fixed inset-0 z-50 bg-slate-950 !text-slate-100 flex flex-col justify-between p-4 md:p-6 overflow-hidden"
          >
            {/* Top Control Header */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                <span className="font-mono text-xs !text-teal-300 font-extrabold tracking-wider uppercase">
                  LIVE ASSESSMENT • {company} ({category})
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 !text-slate-200 font-semibold border border-slate-700">
                  {difficulty} Level
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 font-mono font-bold text-sm px-4 py-1.5 rounded-full border shadow-inner ${
                  timeLeft <= 30
                    ? 'bg-rose-950/80 border-rose-500/50 !text-rose-300 animate-pulse'
                    : 'bg-slate-800 border-slate-700 !text-teal-300'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Quit session? Your progress will not be saved.')) {
                      setStage('setup')
                    }
                  }}
                  className="text-xs !text-slate-300 hover:!text-rose-400 font-semibold transition-colors px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 cursor-pointer"
                >
                  Quit Session
                </button>
              </div>
            </div>

            {/* Studio Workspace Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 py-4 overflow-hidden">
              {/* Left Column: Live Camera Feed & AI Monitor */}
              <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between p-5 relative">
                <div className="flex justify-between items-center z-10">
                  <span className="text-[10px] uppercase font-bold !text-slate-300 tracking-wider flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-teal-400" />
                    Webcam & Audio Interface
                  </span>
                  {/* Media Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleCamera}
                      title={isCameraActive ? 'Disable Camera' : 'Enable Camera'}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isCameraActive ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isCameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleMic}
                      title={isMicActive ? 'Stop Voice Recording' : 'Start Voice Recording'}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isMicActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isMicActive ? <Mic className="w-4 h-4 text-rose-400" /> : <MicOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Video / Audio Area */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85">
                  {isCameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 p-6 text-center">
                      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 shadow-xl">
                        <Bot className="w-10 h-10 text-teal-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold !text-slate-100">AI Recruiter Listening</h4>
                        <p className="text-[11px] !text-slate-400 mt-0.5">Click camera icon top right to enable live preview</p>
                      </div>
                      {/* Audio visualizer bars */}
                      <div className="flex gap-1.5 items-end h-8 mt-2">
                        {[1, 2, 3, 4, 3, 2, 4, 5, 3, 2, 4, 2].map((v, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full ${isMicActive ? 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)] animate-bounce' : 'bg-slate-700'}`}
                            style={{
                              height: isMicActive ? `${v * 18}%` : '20%',
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: '0.8s'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] !text-slate-300 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isMicActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                    {isMicActive ? 'Voice Transcript Active' : 'Mic Muted (Click Mic icon)'}
                  </span>
                  <span className="!text-slate-400">SSL Encrypted Session</span>
                </div>
              </div>

              {/* Right Column: Question & Solution Workspace */}
              <div className="lg:col-span-8 flex flex-col gap-4 overflow-y-auto pr-1">
                {/* Question Box - Crisp High Contrast Dark Theme */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-4 relative shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs !text-teal-300 font-extrabold uppercase tracking-wider bg-teal-500/10 border border-teal-500/30 px-3.5 py-1 rounded-full shadow-xs">
                      Question {currentQuestionIdx + 1} of {questions.length}
                    </span>
                    {questions[currentQuestionIdx]?.hint && (
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs !text-indigo-300 hover:!text-white font-bold flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 transition-all cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-indigo-400" />
                        <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                      </button>
                    )}
                  </div>

                  <h3 className="font-display text-lg md:text-xl font-extrabold !text-white leading-relaxed pt-1">
                    {questions[currentQuestionIdx]?.question || 'Please describe your approach, algorithm complexity, and solution.'}
                  </h3>

                  {showHint && questions[currentQuestionIdx]?.hint && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs !text-amber-200 font-medium leading-relaxed shadow-xs"
                    >
                      💡 <strong className="!text-amber-300 font-bold">Hint:</strong> {questions[currentQuestionIdx]?.hint}
                    </motion.div>
                  )}
                </div>

                {/* Response / Code Editor Box */}
                <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 gap-3 shadow-xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-xs !text-slate-200 uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-teal-400" />
                      Candidate Transcript & Solution Editor
                    </span>
                    {/* Quick helper insertions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => insertTemplateText('code')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 !text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        + Code Template
                      </button>
                      <button
                        onClick={() => insertTemplateText('star')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 !text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        + STAR Outline
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type or speak your solution here... Detail your thought process, algorithm steps, time/space complexity O(N), and edge case handling."
                    className="flex-1 w-full min-h-[220px] bg-slate-950 !text-teal-300 border border-slate-800 rounded-2xl p-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 font-mono leading-relaxed placeholder:!text-slate-500 resize-none shadow-inner"
                  />
                </div>

                {/* Bottom Navigation CTA */}
                <div className="flex justify-between items-center pt-2 px-1">
                  <span className="text-xs font-bold !text-slate-300 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl shadow-xs">
                    Question {currentQuestionIdx + 1} / {questions.length}
                  </span>

                  <button
                    onClick={handleNextQuestion}
                    className="px-7 py-3 bg-teal-500 hover:bg-teal-400 !text-slate-950 font-extrabold text-xs md:text-sm rounded-2xl flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <span>
                      {currentQuestionIdx === questions.length - 1 ? 'Submit All & Evaluate' : 'Next Question'}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: EVALUATING */}
        {stage === 'evaluating' && (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 rounded-3xl p-10 shadow-xl flex flex-col items-center justify-center text-center max-w-lg mx-auto min-h-[380px] space-y-6"
          >
            {evalError ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">Evaluation Error</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">{evalError}</p>
                </div>
                <button
                  onClick={() => submitEvaluation(answers)}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow transition-colors"
                >
                  Retry Evaluation
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="w-10 h-10 text-indigo-600 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Generating AI Evaluation Report
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Analyzing technical correctness, complexity bounds, articulation, and problem-solving depth...
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs space-y-2">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-indigo-600 h-full rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${evaluationProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{evaluationProgress}% Complete</span>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* STAGE 4: RESULTS */}
        {stage === 'results' && interviewResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header / Score Ring Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-8">
              {/* Circular Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#F1F5F9"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke={interviewResult.overallScore >= 75 ? '#0D9488' : interviewResult.overallScore >= 55 ? '#D97706' : '#E11D48'}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - (interviewResult.overallScore || 0) / 100) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {interviewResult.overallScore}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    Overall Score
                  </span>
                </div>
              </div>

              {/* Score Feedback & Details */}
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Evaluation Complete • {interviewResult.targetRole}</span>
                </div>

                <h3 className="font-display text-2xl font-extrabold text-slate-900">
                  {interviewResult.overallScore >= 80
                    ? 'Outstanding Interview Performance!'
                    : interviewResult.overallScore >= 60
                    ? 'Solid Foundation & Good Logic!'
                    : 'Needs Practice & Refinement'}
                </h3>

                <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-2xl">
                  {interviewResult.overallScore >= 80
                    ? 'Your technical reasoning and articulation match senior candidate standards. Keep honing edge case explanations and system constraints.'
                    : interviewResult.overallScore >= 60
                    ? 'You demonstrated core concept understanding. To push into top tier marks, elaborate on Big-O trade-offs and cover defensive programming.'
                    : 'Focus on structuring your responses systematically. Practice writing out explicit algorithm steps before coding.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <button
                    onClick={() => setStage('setup')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                  >
                    Configure New Session
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Parameters Grid */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h4 className="font-display text-base font-bold text-slate-900">
                Performance Parameters Breakdown
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(interviewResult.breakdown).map(([label, scoreVal], idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</span>
                    <p className="font-display text-2xl font-extrabold text-slate-900 mt-1">{scoreVal}%</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-3">
                      <div
                        className="h-full bg-teal-500 transition-all duration-1000"
                        style={{ width: `${scoreVal}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Answers Review Accordion */}
            <div className="space-y-4">
              <h4 className="font-display text-base font-bold text-slate-900">
                Detailed Question-by-Question Review
              </h4>

              {interviewResult.questionResults.map((qRes, idx) => {
                const isOpened = activeAccordionIdx === idx
                const origQuestion = questions.find((q) => q.id === qRes.questionId)
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm transition-all"
                  >
                    {/* Accordion Trigger */}
                    <button
                      onClick={() => setActiveAccordionIdx(isOpened ? null : idx)}
                      className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-50/80 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <span className={`text-xs font-bold font-mono px-3 py-1 rounded-lg border ${
                          qRes.score >= 75
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : qRes.score >= 50
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          Score: {qRes.score}%
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          Q{idx + 1}: {origQuestion?.question || `Question #${qRes.questionId}`}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpened ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence initial={false}>
                      {isOpened && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-slate-100"
                        >
                          <div className="p-6 space-y-5 text-xs leading-relaxed bg-slate-50/40">
                            {/* Candidate Answer */}
                            <div className="space-y-1.5">
                              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-500">
                                Your Submitted Response:
                              </span>
                              <div className="p-3.5 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 whitespace-pre-wrap">
                                {answers[qRes.questionId] || '[No answer submitted]'}
                              </div>
                            </div>

                            {/* Feedback */}
                            <div className="space-y-1.5">
                              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-500">
                                AI Evaluation & Feedback:
                              </span>
                              <p className="text-slate-700 bg-white p-3.5 border border-slate-200 rounded-xl leading-relaxed">
                                {qRes.feedback}
                              </p>
                            </div>

                            {/* Ideal Reference Answer */}
                            <div className="space-y-1.5 p-4 bg-slate-900 !text-teal-50 rounded-2xl border border-slate-800">
                              <span className="font-bold !text-teal-400 block text-[11px] uppercase tracking-wider">
                                Ideal Senior SDE Reference Answer:
                              </span>
                              <p className="font-mono text-[11px] leading-relaxed !text-teal-200 whitespace-pre-wrap pt-1">
                                {qRes.idealAnswer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
