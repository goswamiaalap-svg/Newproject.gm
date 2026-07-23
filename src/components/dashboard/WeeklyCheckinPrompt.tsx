import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CalendarCheck, Send, Check } from 'lucide-react'
import { trackEvent } from '@/lib/events'

interface WeeklyCheckinPromptProps {
  onComplete: () => void
}

export default function WeeklyCheckinPrompt({ onComplete }: WeeklyCheckinPromptProps) {
  const [hitGoal, setHitGoal] = useState<'Yes' | 'Partially' | 'No' | null>(null)
  const [obstacle, setObstacle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showObstacleInput, setShowObstacleInput] = useState(false)

  const handleDismiss = async () => {
    trackEvent('Weekly checkin dismissed', {})
    onComplete()
    try {
      await fetch('/api/weekly-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dismissed: true }),
      })
    } catch (e) {
      console.error('Failed to dismiss weekly checkin:', e)
    }
  }

  const handleSubmit = async () => {
    if (!hitGoal) return
    setIsSubmitting(true)

    const checkinData = { hitGoal, obstacle: obstacle.trim(), dismissed: false }
    trackEvent('Weekly checkin submitted', checkinData)

    try {
      await fetch('/api/weekly-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkinData),
      })
    } catch (e) {
      console.error('Failed to submit weekly checkin:', e)
    } finally {
      setIsSubmitting(false)
      onComplete()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-[#E2E8F0] rounded-hero p-6 text-text-primary shadow-sm relative overflow-hidden mb-6"
    >
      {/* Background soft gradient blob */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo/5 rounded-full blur-2xl pointer-events-none" />

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-50 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        title="Dismiss check-in"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="max-w-2xl relative z-10 space-y-4">
        {/* Header Indicator */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo flex-shrink-0">
          <CalendarCheck className="w-4 h-4 text-indigo" />
          <span>Weekly Accountability Check-In</span>
        </div>

        {/* Prompt Question */}
        <div>
          <h2 className="font-display text-lg font-extrabold tracking-tight text-[#0F172A]">
            Did you hit your career targets and milestones this week?
          </h2>
          <p className="text-text-secondary text-xs mt-1">
            Voluntary weekly progress log. Keep yourself accountable.
          </p>
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap gap-2.5 pt-1.5">
          {(['Yes', 'Partially', 'No'] as const).map((opt) => {
            const isSelected = hitGoal === opt
            let btnClass = 'border-border-default hover:border-text-muted hover:bg-bg-subtle/50 text-text-secondary'
            if (isSelected) {
              if (opt === 'Yes') btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
              if (opt === 'Partially') btnClass = 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
              if (opt === 'No') btnClass = 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
            }

            return (
              <button
                key={opt}
                onClick={() => {
                  setHitGoal(opt)
                  setShowObstacleInput(true)
                }}
                className={`px-5 py-2.5 border rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${btnClass}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* Optional Obstacle Input */}
        <AnimatePresence>
          {showObstacleInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2.5 overflow-hidden"
            >
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mt-2">
                {hitGoal === 'Yes' 
                  ? 'Any reflections or accomplishments to log? (Optional)' 
                  : 'What got in the way? (Optional)'}
              </label>
              <textarea
                value={obstacle}
                onChange={(e) => setObstacle(e.target.value)}
                placeholder={hitGoal === 'Yes' 
                  ? 'Key wins, new skills learned, finished chapters...' 
                  : 'Lack of time, difficult bugs, exam prep, missing resources...'}
                rows={3}
                className="w-full px-3 py-2 border border-border-default rounded-lg text-xs focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo/25 text-text-primary leading-relaxed bg-white"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-border-subtle">
          <div className="text-[10px] text-text-muted font-semibold">
            Responses are saved in your weekly tracker history.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDismiss}
              className="text-xs text-text-muted hover:text-text-primary font-bold px-2 py-1 cursor-pointer"
            >
              Skip
            </button>

            {hitGoal && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4.5 py-2 bg-indigo hover:bg-indigo-600 text-white rounded-btn text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-wait cursor-pointer"
              >
                <span>Submit response</span>
                <Send className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
