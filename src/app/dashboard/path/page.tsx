'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Briefcase,
  Globe,
  Award,
  BookOpen,
  CheckCircle,
  Lightbulb,
  Cpu,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react'

// Define types matching backend models
interface TargetSuggestion {
  title: string
  description: string
  whyItFits: string
}

interface IdealProfile {
  skills: {
    technical: string[]
    soft: string[]
  }
  projects: {
    title: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  }[]
  experience: {
    milestones: string[]
  }
}

interface TargetResume {
  summary: string
  skills: {
    category: string
    items: string[]
  }[]
  projects: {
    title: string
    description: string
    technologies: string[]
    bullets: string[]
  }[]
  experience: {
    role: string
    organization: string
    duration: string
    bullets: string[]
  }[]
}

export default function DefinePathPage() {
  const router = useRouter()
  const [step, setStep] = useState<'choose_mode' | 'input_details' | 'view_suggestions' | 'ideal_profile'>('choose_mode')
  
  // Selection state
  const [hasTarget, setHasTarget] = useState<boolean | null>(null)
  const [targetType, setTargetType] = useState<'job' | 'gig' | 'solo' | 'research' | 'open_source' | 'higher_ed' | null>(null)
  
  // Inputs
  const [targetTitle, setTargetTitle] = useState('')
  const [targetDescription, setTargetDescription] = useState('')
  const [interests, setInterests] = useState('')
  const [skills, setSkills] = useState('')

  // Loading & suggestions state
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<TargetSuggestion[]>([])
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState<number | null>(null)

  // Loading & result state for profile
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [idealProfile, setIdealProfile] = useState<IdealProfile | null>(null)
  const [perfectResume, setPerfectResume] = useState<TargetResume | null>(null)
  const [activeTab, setActiveTab] = useState<'resume' | 'benchmarks'>('resume')
  const [error, setError] = useState<string | null>(null)

  // Load existing target on mount
  React.useEffect(() => {
    const fetchActiveTarget = async () => {
      try {
        const res = await fetch('/api/career-target')
        if (res.ok) {
          const data = await res.json()
          if (data && data.targetTitle) {
            setTargetTitle(data.targetTitle)
            setTargetDescription(data.targetDescription || '')
            setTargetType(data.targetType)
            setIdealProfile(data.idealProfile)
            setPerfectResume(data.perfectResume || null)
            setStep('ideal_profile')
            setHasTarget(true)
          }
        }
      } catch (err) {
        console.error('Failed to fetch active target:', err)
      }
    }
    fetchActiveTarget()
  }, [])

  const categories = [
    { id: 'job', label: 'Job / Employment', desc: 'Product companies, tech startups, service firms', icon: Briefcase, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'gig', label: 'Gig / Freelancing', desc: 'Upwork, contracting, remote freelance, consulting', icon: Globe, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'solo', label: 'Solo Creator / SaaS', desc: 'Indie hacking, build own products, content business', icon: Lightbulb, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'research', label: 'Research & Academia', desc: 'PhD, research assistant, publishing papers', icon: BookOpen, color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { id: 'open_source', label: 'Open Source / DevRel', desc: 'GitHub contributions, developer advocacy, dev community', icon: Cpu, color: 'bg-rose-50 text-rose-600 border-rose-200' },
    { id: 'higher_ed', label: 'Higher Ed / Studies', desc: 'Master\'s degree, MBA, PG entrance, GRE/GATE prep', icon: Award, color: 'bg-orange-50 text-orange-600 border-orange-200' },
  ] as const

  const handleNextFromMode = () => {
    if (hasTarget === true) {
      setStep('input_details')
    } else if (hasTarget === false) {
      setStep('input_details')
    }
  }

  const handleFetchSuggestions = async () => {
    if (!targetType) return
    setLoadingSuggestions(true)
    setError(null)
    try {
      const res = await fetch('/api/career-target/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, interests, skills }),
      })
      if (!res.ok) throw new Error('Failed to fetch suggestions')
      const data = await res.json()
      setSuggestions(data.suggestions || [])
      setStep('view_suggestions')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleGenerateProfile = async (title: string, desc: string) => {
    setLoadingProfile(true)
    setError(null)
    setStep('ideal_profile')
    try {
      const type = targetType || 'job'
      const res = await fetch('/api/career-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: type,
          targetTitle: title,
          targetDescription: desc || `Pursuing a career path as a ${title}`,
        }),
      })
      if (!res.ok) throw new Error('Failed to generate ideal profile')
      const targetDoc = await res.json()
      setIdealProfile(targetDoc.idealProfile)
      setPerfectResume(targetDoc.perfectResume)
      setActiveTab('resume')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleConfirmPath = () => {
    router.push('/dashboard')
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header Banner */}
      <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <Compass className="w-8 h-8 text-teal" /> Define Your Career Path
          </h1>
          <p className="text-[#475569] text-sm mt-1">
            Establish clarity over features. Define your target outcome, preview your target Resume of Excellence, and build a roadmap to achieve it.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: CHOOSE MODE */}
        {step === 'choose_mode' && (
          <motion.div
            key="choose_mode"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-border-default rounded-2xl p-8 shadow-card space-y-6"
          >
            <h2 className="text-xl font-bold text-text-primary text-center">Do you already know what career goal you're aiming for?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => setHasTarget(true)}
                className={`flex flex-col items-center justify-center p-6 border rounded-xl text-center transition-all ${
                  hasTarget === true
                    ? 'border-teal bg-teal/5 ring-2 ring-teal/20'
                    : 'border-border-default hover:border-text-muted hover:bg-bg-subtle/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary">Yes, I know exactly what I want</h3>
                <p className="text-text-muted text-xs mt-1 px-4">
                  Define your specific title and target (e.g. SDE at Google, Remote Designer, SaaS solopreneur)
                </p>
              </button>

              <button
                onClick={() => setHasTarget(false)}
                className={`flex flex-col items-center justify-center p-6 border rounded-xl text-center transition-all ${
                  hasTarget === false
                    ? 'border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-500/20'
                    : 'border-border-default hover:border-text-muted hover:bg-bg-subtle/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary">No, I want to explore suggestions</h3>
                <p className="text-text-muted text-xs mt-1 px-4">
                  Explore new roles beyond standard 9-5 jobs: gigs, creators, solopreneurs, and academics
                </p>
              </button>
            </div>

            <div className="flex justify-end pt-4 border-t border-border-subtle">
              <button
                onClick={handleNextFromMode}
                disabled={hasTarget === null}
                className="px-6 py-3 bg-teal text-white rounded-lg font-bold shadow-md hover:bg-teal-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: INPUT DETAILS */}
        {step === 'input_details' && (
          <motion.div
            key="input_details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-border-default rounded-2xl p-8 shadow-card space-y-6"
          >
            <button
              onClick={() => {
                setStep('choose_mode')
                setError(null)
              }}
              className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            {hasTarget ? (
              // KNOWN TARGET INPUTS
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-text-primary">Define Your Target Role</h2>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Target Title</label>
                  <input
                    type="text"
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                    placeholder="e.g. Frontend Engineer at a startup, or freelance Shopify expert"
                    className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Target Description & Details (Optional)</label>
                  <textarea
                    rows={4}
                    value={targetDescription}
                    onChange={(e) => setTargetDescription(e.target.value)}
                    placeholder="Add details about target domains, client profiles (gigs/solobusiness), or company size."
                    className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon
                      const isSelected = targetType === cat.id
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setTargetType(cat.id)}
                          className={`relative flex flex-col items-center justify-center p-4 border rounded-xl text-center transition-all ${
                            isSelected
                              ? 'border-teal bg-teal-50/70 ring-2 ring-teal/20 shadow-sm'
                              : 'border-border-default hover:bg-bg-subtle/50'
                          }`}
                        >
                          <Icon className="w-5 h-5 mb-2 text-text-secondary" />
                          <span className="text-xs font-bold text-text-primary">{cat.label.split(' ')[0]}</span>
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal text-white rounded-full flex items-center justify-center shadow-sm">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border-subtle">
                  <button
                    onClick={() => handleGenerateProfile(targetTitle, targetDescription)}
                    disabled={!targetTitle || !targetType}
                    className="px-6 py-3 bg-teal text-white rounded-lg font-bold shadow-md hover:bg-teal-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Target Profile <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              // UNKNOWN TARGET SUGGESTIONS INPUTS
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-text-primary">What area are you exploring?</h2>
                
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Choose a Career Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon
                      const isSelected = targetType === cat.id
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setTargetType(cat.id)}
                          className={`relative flex items-start p-4 border rounded-xl text-left transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20'
                              : 'border-border-default hover:bg-bg-subtle/50'
                          }`}
                        >
                          <div className={`p-2.5 rounded-lg mr-3 flex-shrink-0 ${cat.color} border`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 pr-6">
                            <h4 className="font-bold text-text-primary text-sm">{cat.label}</h4>
                            <p className="text-text-muted text-[10px] mt-0.5">{cat.desc}</p>
                          </div>
                          {isSelected && (
                            <span className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-sm">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Your Core Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. JavaScript, Python, UI Design, Microsoft Excel"
                    className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">What topics or fields interest you?</label>
                  <textarea
                    rows={3}
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. fintech, SaaS, content writing, consulting, web development"
                    className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-teal"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-border-subtle">
                  <button
                    onClick={handleFetchSuggestions}
                    disabled={!targetType || loadingSuggestions}
                    className="px-6 py-3 bg-teal text-white rounded-lg font-bold shadow-md hover:bg-teal-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingSuggestions ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Suggesting...
                      </>
                    ) : (
                      <>
                        Get AI Suggestions <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 3: VIEW SUGGESTIONS */}
        {step === 'view_suggestions' && (
          <motion.div
            key="view_suggestions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-border-default rounded-2xl p-8 shadow-card space-y-6"
          >
            <button
              onClick={() => {
                setStep('input_details')
                setError(null)
              }}
              className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <div>
              <h2 className="text-xl font-bold text-text-primary">Tailored Target Suggestions</h2>
              <p className="text-xs text-text-muted mt-1">Select one of the customized outcomes suggestions below based on your profile.</p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSuggestionIdx(idx)}
                  className={`w-full text-left p-5 border rounded-xl transition-all flex items-start justify-between ${
                    selectedSuggestionIdx === idx
                      ? 'border-teal bg-teal/5 ring-1 ring-teal/20'
                      : 'border-border-default hover:bg-bg-subtle/50'
                  }`}
                >
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                      {sug.title}
                      {selectedSuggestionIdx === idx && <Check className="w-4 h-4 text-teal" />}
                    </h3>
                    <p className="text-text-secondary text-xs mt-1.5">{sug.description}</p>
                    <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-semibold text-teal bg-teal/5 px-2 py-0.5 rounded-full border border-teal/10">
                      <Sparkles className="w-2.5 h-2.5" /> Why it fits: {sug.whyItFits}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-border-subtle">
              <button
                onClick={() => {
                  if (selectedSuggestionIdx !== null) {
                    const sug = suggestions[selectedSuggestionIdx]
                    setTargetTitle(sug.title)
                    handleGenerateProfile(sug.title, sug.description)
                  }
                }}
                disabled={selectedSuggestionIdx === null}
                className="px-6 py-3 bg-teal text-white rounded-lg font-bold shadow-md hover:bg-teal-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Ideal Profile <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: VIEW IDEAL PROFILE & TARGET RESUME */}
        {step === 'ideal_profile' && (
          <motion.div
            key="ideal_profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {loadingProfile ? (
              <div className="bg-white border border-border-default rounded-2xl p-12 shadow-card text-center flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-teal" />
                <div>
                  <h3 className="font-display font-bold text-lg text-text-primary">Drafting Ideal Profile & Target Resume</h3>
                  <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                    Analyzing target standards to model your Career Target benchmarks and building your aspirational Resume of Excellence...
                  </p>
                </div>
              </div>
            ) : idealProfile ? (
              <div className="bg-white border border-border-default rounded-2xl p-8 shadow-card space-y-6">
                
                {/* 3 Idiots Excellence Banner */}
                <div className="bg-gradient-to-r from-teal/10 to-indigo/5 border border-teal/20 rounded-xl p-5 flex items-start gap-4 shadow-sm">
                  <div className="p-3 bg-teal text-white rounded-lg">
                    <Sparkles className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0D9488] font-display">
                      3 Idiots Wisdom: Aim for Excellence (The Resume, Not The Job)
                    </h4>
                    <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                      "Make yourself capable, aim for excellence, and success will chase you." Your target is not to apply blindly to job boards, but to systematically earn the skills and construct this <strong>Resume of Excellence</strong>. Once you achieve this profile, opportunity will seek you out.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal text-[10px] font-bold uppercase tracking-wider mb-2">
                      Target Outcome Established
                    </div>
                    <h2 className="text-2xl font-extrabold text-text-primary">{targetTitle}</h2>
                    <p className="text-xs text-text-secondary mt-1">{targetDescription || `Benchmark blueprint for ${targetTitle}`}</p>
                  </div>

                  {/* Tab Selectors */}
                  <div className="flex bg-bg-subtle p-1 rounded-lg border border-border-default">
                    <button
                      onClick={() => setActiveTab('resume')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                        activeTab === 'resume'
                          ? 'bg-white text-text-primary shadow-sm'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Target Resume
                    </button>
                    <button
                      onClick={() => setActiveTab('benchmarks')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                        activeTab === 'benchmarks'
                          ? 'bg-white text-text-primary shadow-sm'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      Required Benchmarks
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* TAB 1: PERFECT RESUME VIEW */}
                  {activeTab === 'resume' && (
                    <motion.div
                      key="resume-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border border-[#E2E8F0] rounded-xl p-8 bg-[#F8FAFC] shadow-inner max-w-3xl mx-auto"
                    >
                      {perfectResume ? (
                        <div className="bg-white p-8 md:p-10 border border-gray-200 shadow-md rounded-md font-sans text-xs text-[#334155] space-y-6 max-h-[600px] overflow-y-auto">
                          {/* Resume Header */}
                          <div className="text-center pb-4 border-b border-gray-200 space-y-1.5">
                            <h3 className="text-lg font-bold text-gray-900 tracking-wide uppercase">Your Target Resume</h3>
                            <p className="text-gray-500 font-medium text-[10px] tracking-widest uppercase">
                              Blueprint for {targetTitle} Excellence
                            </p>
                          </div>

                          {/* Profile Summary */}
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-gray-900 uppercase border-b border-gray-150 pb-1 tracking-wider text-[10px]">
                              Career Objective / Summary
                            </h4>
                            <p className="leading-relaxed italic text-gray-600 pr-4">
                              {perfectResume.summary}
                            </p>
                          </div>

                          {/* Skills Grid */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-gray-900 uppercase border-b border-gray-150 pb-1 tracking-wider text-[10px]">
                              Technical Expertise
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pl-1">
                              {perfectResume.skills.map((skillGroup, i) => (
                                <div key={i} className="flex gap-2">
                                  <span className="font-bold text-gray-800 text-[10px] uppercase w-24 flex-shrink-0">
                                    {skillGroup.category}:
                                  </span>
                                  <span className="text-gray-600">
                                    {skillGroup.items.join(', ')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Professional Target Milestones / Experience */}
                          <div className="space-y-3">
                            <h4 className="font-bold text-gray-900 uppercase border-b border-gray-150 pb-1 tracking-wider text-[10px]">
                              Aspirational Milestones & Experience
                            </h4>
                            {perfectResume.experience.map((exp, i) => (
                              <div key={i} className="space-y-1.5">
                                <div className="flex justify-between font-bold text-gray-800 text-[11px]">
                                  <span>{exp.role} @ {exp.organization}</span>
                                  <span className="text-gray-500 font-medium text-[10px]">{exp.duration}</span>
                                </div>
                                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                  {exp.bullets.map((bullet, idx) => (
                                    <li key={idx} className="leading-relaxed">
                                      {bullet}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Target Portflio Projects */}
                          <div className="space-y-3">
                            <h4 className="font-bold text-gray-900 uppercase border-b border-gray-150 pb-1 tracking-wider text-[10px]">
                              Standout Portfolio Projects to Build
                            </h4>
                            {perfectResume.projects.map((proj, i) => (
                              <div key={i} className="space-y-1.5">
                                <div className="flex justify-between font-bold text-gray-800 text-[11px]">
                                  <span>{proj.title}</span>
                                  <span className="text-teal font-semibold text-[9px] uppercase">
                                    {proj.technologies.join(' | ')}
                                  </span>
                                </div>
                                <p className="text-gray-500 leading-snug">{proj.description}</p>
                                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                  {proj.bullets.map((bullet, idx) => (
                                    <li key={idx} className="leading-relaxed">
                                      {bullet}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                        </div>
                      ) : (
                        <div className="text-center py-10 text-text-muted text-xs">
                          No Perfect Resume generated for this path yet. Try deactivating and defining a new path.
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 2: BENCHMARKS LIST */}
                  {activeTab === 'benchmarks' && (
                    <motion.div
                      key="benchmarks-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"
                    >
                      {/* Skills Benchmarks */}
                      <div className="space-y-4">
                        <h3 className="font-display font-bold text-sm text-text-primary border-b border-border-subtle pb-2">Skills Benchmarks</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Core Technical Skills</span>
                            <div className="flex flex-wrap gap-1.5">
                              {idealProfile.skills.technical.map((skill, i) => (
                                <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-bg-subtle text-text-primary rounded-lg border border-border-default">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Essential Soft Skills</span>
                            <div className="flex flex-wrap gap-1.5">
                              {idealProfile.skills.soft.map((skill, i) => (
                                <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-bg-subtle/40 text-text-secondary rounded-lg border border-border-subtle">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Milestones / Checklist */}
                      <div className="space-y-4">
                        <h3 className="font-display font-bold text-sm text-text-primary border-b border-border-subtle pb-2">Target Milestones</h3>
                        <div className="space-y-2">
                          {idealProfile.experience.milestones.map((m, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-bg-base/30 text-xs">
                              <CheckCircle className="w-4 h-4 text-teal/80 mt-0.5 flex-shrink-0" />
                              <span className="text-text-primary font-medium">{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
                  <button
                    onClick={() => {
                      if (hasTarget) {
                        setStep('input_details')
                      } else {
                        setStep('view_suggestions')
                      }
                      setIdealProfile(null)
                    }}
                    className="flex items-center gap-1 text-text-muted hover:text-text-primary text-xs font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                  </button>

                  <button
                    onClick={handleConfirmPath}
                    className="px-6 py-3 bg-teal text-white rounded-lg font-bold shadow-md hover:bg-teal-700 transition-all flex items-center gap-2"
                  >
                    Set as Active Path <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
