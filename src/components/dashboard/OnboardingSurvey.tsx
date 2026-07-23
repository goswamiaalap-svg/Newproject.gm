import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ChevronRight, Check } from 'lucide-react'
import { trackEvent } from '@/lib/events'

interface OnboardingSurveyProps {
  onComplete: () => void
}

export default function OnboardingSurvey({ onComplete }: OnboardingSurveyProps) {
  const [step, setStep] = useState(0)
  const [year, setYear] = useState('')
  const [goal, setGoal] = useState('')
  const [hours, setHours] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDismiss = async () => {
    trackEvent('Onboarding survey dismissed', { stepReached: step })
    onComplete()
    try {
      await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dismissed: true }),
      })
    } catch (e) {
      console.error('Failed to dismiss onboarding survey:', e)
    }
  }

  const handleSubmit = async () => {
    if (!year || !goal || !hours) return
    setIsSubmitting(true)
    
    const surveyData = { year, goal, hoursPerWeek: hours }
    trackEvent('Onboarding survey submitted', surveyData)

    try {
      const res = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      })
      if (res.ok) {
        // Dispatch event to update dashboard greeting/year
        window.dispatchEvent(new Event('profile-updated'))
      }
    } catch (e) {
      console.error('Failed to submit onboarding survey:', e)
    } finally {
      setIsSubmitting(false)
      onComplete()
    }
  }

  const steps = [
    {
      title: "What's your current academic year?",
      subtitle: "Helps tailor project ideas and roadmap difficulty to your schedule.",
      field: 'year',
      value: year,
      setter: setYear,
      options: [
        { label: 'First Year', value: '1st' },
        { label: 'Second Year', value: '2nd' },
        { label: 'Third Year', value: '3rd' },
        { label: 'Final Year', value: '4th' },
      ]
    },
    {
      title: "What's your primary prep goal?",
      subtitle: "Focuses your target benchmarks on specific outcomes.",
      field: 'goal',
      value: goal,
      setter: setGoal,
      options: [
        { label: 'Placement Prep', value: 'placement' },
        { label: 'Internship Search', value: 'internship' },
        { label: 'Hackathons & Projects', value: 'hackathon' },
        { label: 'Higher Studies / Research', value: 'higher studies' },
        { label: 'Freelancing & Gig Work', value: 'freelance' },
      ]
    },
    {
      title: "How many hours per week can you dedicate?",
      subtitle: "Sets realistic weekly milestone reminders.",
      field: 'hours',
      value: hours,
      setter: setHours,
      options: [
        { label: '1 - 2 Hours', value: '1-2' },
        { label: '3 - 5 Hours', value: '3-5' },
        { label: '6 - 10 Hours', value: '6-10' },
        { label: '10+ Hours', value: '10+' },
      ]
    }
  ]

  const currentStepInfo = steps[step]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-slate-800 rounded-hero p-6 text-white shadow-xl relative overflow-hidden mb-6"
    >
      {/* Background aesthetic blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        title="Dismiss survey"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="max-w-2xl relative z-10">
        {/* Header Indicator */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-teal mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LaunchPad Setup wizard • Step {step + 1} of 3</span>
        </div>

        {/* Wizard Question & Subtitle */}
        <div className="min-h-[80px]">
          <h2 className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-white">
            {currentStepInfo.title}
          </h2>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            {currentStepInfo.subtitle}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-5">
          {currentStepInfo.options.map((opt) => {
            const isSelected = currentStepInfo.value === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => {
                  currentStepInfo.setter(opt.value)
                  // Auto-advance step if not last step
                  if (step < 2) {
                    setTimeout(() => setStep(step + 1), 250)
                  }
                }}
                className={`flex items-center justify-between p-3.5 border rounded-xl text-left text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-teal bg-teal/10 text-teal shadow-md shadow-teal/5'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="w-4 h-4 bg-teal text-white rounded-full flex items-center justify-center scale-90">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Footer controls & progress bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-5 border-t border-slate-800/60">
          {/* Progress dots / bar */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === step ? 'w-6 bg-teal' : idx < step ? 'w-2 bg-teal/40' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 justify-end">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-slate-800 rounded-btn text-xs font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              >
                Back
              </button>
            )}

            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!currentStepInfo.value}
                className="px-4.5 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-btn text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!hours || isSubmitting}
                className="px-5 py-2.5 bg-teal hover:bg-teal-600 text-white rounded-btn text-xs font-extrabold shadow-teal-glow transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-wait cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : 'Complete Setup'}
                <Check className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="text-xs text-slate-500 hover:text-slate-400 font-semibold px-2 py-1 ml-1 cursor-pointer"
            >
              Skip Setup
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
