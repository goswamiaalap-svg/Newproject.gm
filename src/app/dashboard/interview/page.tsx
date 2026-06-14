'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Award, Clock, ArrowRight, Play, Camera, Mic, CheckCircle, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react'
import { mockInterviewQuestions, mockInterviewResults } from '@/lib/mock-data'

interface Question {
  id: number
  question: string
  category: string
  difficulty: string
  timeLimit: number
}

export default function MockInterviewPage() {
  const [stage, setStage] = useState<'setup' | 'interview' | 'evaluating' | 'results'>('setup')
  const [category, setCategory] = useState('DSA')
  const [difficulty, setDifficulty] = useState('Medium')
  const [company, setCompany] = useState('Amazon')
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(180)
  const [interviewResult, setInterviewResult] = useState<any>(null)
  
  // We'll just display the question directly to avoid React state race conditions with fast intervals causing typos.

  // Interview timer
  useEffect(() => {
    if (stage !== 'interview') return
    
    setTimeLeft(activeQuestions[currentQuestionIdx].timeLimit)
    
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown)
          handleNextQuestion()
          return 0
        }
        return prev - 1
      })
    }, 100) // Fast speed for demo or normal 1000ms. Let's make it 1000ms.
    
    return () => clearInterval(countdown)
  }, [stage, currentQuestionIdx])

  const handleStartInterview = () => {
    setStage('interview')
    setCurrentQuestionIdx(0)
    setCurrentAnswer('')
    setAnswers({})
  }

  const handleNextQuestion = () => {
    // Save current answer
    setAnswers((prev) => ({
      ...prev,
      [activeQuestions[currentQuestionIdx].id]: currentAnswer,
    }))

    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1)
      setCurrentAnswer('')
    } else {
      setStage('evaluating')
      
      // Submit interview data to backend
      fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: company,
          answers: {
            ...answers,
            [activeQuestions[currentQuestionIdx].id]: currentAnswer,
          }
        })
      })
      .then(res => res.json())
      .then(data => {
        setInterviewResult(data)
        setStage('results')
      })
      .catch(console.error)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="space-y-6">
      {/* Header (Hidden during interview room) */}
      {stage !== 'interview' && (
        <div>
          <h1 className="font-display text-3xl font-extrabold text-text-primary">
            Mock Interview Simulator
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Rehearse technical and behavioral rounds with AI. Review your communication, depth, and logic.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Stage 1: Setup */}
        {stage === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Form */}
            <div className="md:col-span-7 bg-white border border-border-default rounded-card p-6 shadow-card space-y-5">
              <h3 className="font-display text-lg font-bold text-text-primary">
                Select Interview Parameters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                    Category / Role
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-bg-base border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors cursor-pointer"
                  >
                    <option value="DSA">Data Structures & Algorithms (SDE)</option>
                    <option value="System Design">System Design (Architect)</option>
                    <option value="OS Concepts">Computer Science Core (OS, DBMS, CN)</option>
                    <option value="Behavioral">Behavioral / HR Round</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors cursor-pointer"
                    >
                      <option value="Easy">Easy (Entry level)</option>
                      <option value="Medium">Medium (SDE-1 / SDE-2)</option>
                      <option value="Hard">Hard (Senior SDE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                      Target Company Template
                    </label>
                    <select
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-2.5 bg-bg-base border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors cursor-pointer"
                    >
                      <option value="Amazon">Amazon</option>
                      <option value="Google">Google</option>
                      <option value="TCS">TCS Digital</option>
                      <option value="Flipkart">Flipkart</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                className="w-full mt-4 py-3.5 bg-teal hover:bg-teal-600 text-white font-semibold rounded-btn flex items-center justify-center gap-2 shadow-teal-glow transition-all active:scale-95 text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Mock Interview</span>
              </button>
            </div>

            {/* Visual Guidelines Panel */}
            <div className="md:col-span-5 bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
              <h4 className="font-display text-sm font-bold text-text-primary">
                Preparation Guidelines
              </h4>
              <ul className="space-y-3 text-xs text-text-secondary leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-teal font-bold">1.</span>
                  <span>Enable your webcam and microphone for communication depth scoring (simulated locally).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal font-bold">2.</span>
                  <span>Speak or type your solution as clearly as possible, detailing time/space complexity for coding questions.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal font-bold">3.</span>
                  <span>Adhere to the countdown timers. Unfinished responses are evaluated as-is.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Stage 2: Interview Room (Light Mode) */}
        {stage === 'interview' && (
          <motion.div
            key="interview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-subtle text-text-primary flex flex-col justify-between p-6 overflow-hidden"
          >
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-border-default pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                <span className="font-mono text-xs text-text-secondary tracking-wider font-bold">LIVE MOCK SIMULATION • {company} Round</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono font-bold text-text-primary bg-white px-4 py-1.5 rounded-full border border-border-default shadow-sm">
                <Clock className="w-4 h-4 text-teal" />
                <span className={timeLeft <= 30 ? 'text-red-500 animate-pulse' : ''}>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Layout: Video Feed on Left, Question & Answer Box on Right */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 overflow-hidden">
              {/* Webcam Placeholder (Col 4) */}
              <div className="lg:col-span-4 bg-white rounded-hero border border-border-default shadow-card overflow-hidden flex flex-col justify-between p-5 relative">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Webcam Interface</span>
                  <div className="flex gap-1.5">
                    <span className="p-1 rounded bg-teal/10"><Camera className="w-3.5 h-3.5 text-teal" /></span>
                    <span className="p-1 rounded bg-teal/10"><Mic className="w-3.5 h-3.5 text-teal" /></span>
                  </div>
                </div>

                {/* Simulated Webcam Silhouette / Audio Waveform */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-50/50">
                  <div className="w-20 h-20 rounded-full bg-teal-light flex items-center justify-center text-teal border border-teal/20 shadow-soft">
                    <Video className="w-8 h-8" />
                  </div>
                  <div className="flex gap-1 items-end h-8">
                    {[1, 2, 3, 4, 3, 2, 4, 5, 2, 1, 3, 4, 2].map((v, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-teal shadow-teal-glow animate-bounce"
                        style={{ height: `${v * 15}%`, animationDelay: `${i * 0.1}s`, animationDuration: '1s' }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-text-muted font-semibold text-center relative z-10">
                  Audio & Video streams are encrypted.
                </div>
              </div>

              {/* Question & Input Area (Col 8) */}
              <div className="lg:col-span-8 flex flex-col justify-between gap-4 overflow-y-auto">
                {/* Question */}
                <div className="bg-white rounded-hero border border-border-default shadow-card p-6 space-y-3 min-h-[160px]">
                  <span className="text-[10px] text-teal font-extrabold uppercase tracking-widest bg-teal-light px-2.5 py-1 rounded-full">
                    Question {currentQuestionIdx + 1} of {activeQuestions.length}
                  </span>
                  <p className="font-display text-lg md:text-xl font-bold text-text-primary leading-relaxed mt-4">
                    {activeQuestions[currentQuestionIdx]?.question}
                  </p>
                </div>

                {/* Textarea answer */}
                <div className="flex-1 flex flex-col bg-white rounded-hero border border-border-default shadow-card p-5 gap-3">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Your Transcript / Code Solution</span>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your explanation, algorithm approach, or standard bulleted code blocks here..."
                    className="flex-1 w-full bg-transparent text-sm resize-none focus:outline-none text-text-primary leading-relaxed placeholder-text-muted font-mono"
                  />
                </div>

                {/* Navigation CTA */}
                <div className="flex justify-end items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to quit the current interview? Your progress will not be saved.')) {
                        setStage('setup')
                      }
                    }}
                    className="text-xs text-text-muted hover:text-red-500 font-bold transition-colors"
                  >
                    Quit Session
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn flex items-center gap-1.5 shadow-teal-glow transition-all"
                  >
                    <span>{currentQuestionIdx === activeQuestions.length - 1 ? 'Submit & Evaluate' : 'Next Question'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 3: Evaluating responses */}
        {stage === 'evaluating' && (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-border-default rounded-card p-10 shadow-card flex flex-col items-center justify-center text-center max-w-md mx-auto min-h-[320px]"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-indigo/10 border-t-indigo animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="w-8 h-8 text-indigo animate-pulse" />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-text-primary mb-2">
              Generating Evaluation Report
            </h3>
            <p className="text-text-muted text-xs leading-relaxed max-w-xs">
              AI is reviewing transcript clarity, technical correctness parameters, and logic depth scores...
            </p>
          </motion.div>
        )}

        {/* Stage 4: Results */}
        {stage === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header / Score Ring card */}
            <div className="bg-white border border-border-default rounded-card p-6 shadow-card flex flex-col sm:flex-row items-center gap-6">
              {/* Score circle */}
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
                    stroke="#6366F1"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 48}
                    initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - (interviewResult?.overallScore || 0) / 100) }}
                    transition={{ duration: 1.2 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-text-primary">{interviewResult?.overallScore || 0}%</span>
                  <span className="text-[8px] text-text-muted font-bold uppercase">Average Score</span>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo/5 text-indigo text-[10px] font-bold border border-indigo/10">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Evaluation Complete</span>
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary">Solid performance!</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Your communication and core logic correctness are excellent. Expand on database constraints and caching in System Design sections to target senior SDE marks.
                </p>
                <button
                  onClick={() => setStage('setup')}
                  className="px-4 py-2 bg-indigo hover:bg-indigo-600 text-white text-xs font-semibold rounded-btn transition-colors"
                >
                  Configure New Session
                </button>
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
              <h4 className="font-display text-sm font-bold text-text-primary">Performance Parameters</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {interviewResult && Object.entries(interviewResult.breakdown).map(([label, val], idx) => (
                  <div key={idx} className="bg-bg-base/50 p-4 rounded-btn border border-border-subtle text-center">
                    <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider">{label}</p>
                    <p className="font-display text-2xl font-bold text-text-primary mt-2">{val as any}%</p>
                    <div className="w-full h-1 bg-bg-subtle rounded-full overflow-hidden mt-3">
                      <div className="bg-indigo h-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Breakdown Accordions */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-bold text-text-primary">Detailed Answers Review</h4>

              {interviewResult?.questionResults?.map((qRes: any, idx: number) => {
                const isOpened = activeAccordionIdx === idx
                return (
                  <div
                    key={idx}
                    className="bg-white border border-border-default rounded-card overflow-hidden shadow-card transition-all"
                  >
                    {/* Header trigger */}
                    <button
                      onClick={() => setActiveAccordionIdx(isOpened ? null : idx)}
                      className="w-full flex justify-between items-center p-5 text-left hover:bg-bg-base/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo/5 text-indigo border border-indigo/10">
                          Score: {qRes.score}%
                        </span>
                        <span className="text-xs font-semibold text-text-primary line-clamp-1">
                          Question {qRes.questionId}: {mockInterviewQuestions.find((q) => q.id === qRes.questionId)?.question}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isOpened && 'rotate-180'}`} />
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence initial={false}>
                      {isOpened && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-border-subtle"
                        >
                          <div className="p-5 space-y-4 text-xs leading-relaxed">
                            {/* Feedback */}
                            <div className="space-y-1">
                              <span className="font-bold text-text-primary block">AI Evaluation Feedback:</span>
                              <p className="text-text-secondary">{qRes.feedback}</p>
                            </div>

                            {/* Ideal Answer */}
                            <div className="space-y-1 p-3 bg-teal/5 border border-teal/10 rounded-btn text-teal-950">
                              <span className="font-bold text-teal block">Ideal Reference Answer:</span>
                              <p className="font-mono text-[11px] leading-relaxed text-text-secondary mt-1">{qRes.idealAnswer}</p>
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
