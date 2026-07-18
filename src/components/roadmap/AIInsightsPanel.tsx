'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { GeminiInsights } from './types'
import { Sparkles, Target, Clock } from 'lucide-react'

interface Props {
  insights: GeminiInsights
}

export default function AIInsightsPanel({ insights }: Props) {
  // Simple markdown-to-html conversion for bold text and paragraphs
  const formatChat = (text: string) => {
    return text.split('\n').map((paragraph, i) => {
      if (!paragraph.trim()) return <div key={i} className="h-2" />
      
      const boldRegex = /\*\*(.*?)\*\*/g
      let parts = []
      let lastIndex = 0
      let match

      while ((match = boldRegex.exec(paragraph)) !== null) {
        if (match.index > lastIndex) {
          parts.push(paragraph.substring(lastIndex, match.index))
        }
        parts.push(<strong key={lastIndex} className="font-bold text-slate-900">{match[1]}</strong>)
        lastIndex = boldRegex.lastIndex
      }
      if (lastIndex < paragraph.length) {
        parts.push(paragraph.substring(lastIndex))
      }

      return (
        <p key={i} className="mb-2 last:mb-0 text-slate-700 leading-relaxed text-[15px]">
          {parts.length > 0 ? parts : paragraph}
        </p>
      )
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* ─── Chat Window ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden"
      >
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shadow-inner">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">LaunchPad AI Mentor</h2>
              <p className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">Online • Analyzing your profile</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-slate-50/50 space-y-6">
          
          {/* User message simulate */}
          <div className="flex justify-end">
            <div className="max-w-[85%] md:max-w-[75%] bg-slate-800 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm">
              <p className="text-sm font-medium leading-relaxed">Here is my profile and my goal. Can you review it and tell me exactly how I should approach this roadmap?</p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start gap-3 md:gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shrink-0 shadow mt-1">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[90%] md:max-w-[85%] bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm px-6 py-5 shadow-sm">
              {formatChat(insights.mentorChat || "I've built a roadmap tailored just for you. Follow the curriculum closely and you'll reach your goal.")}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Roadmap Meta Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-teal-500" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Core Strategy</h3>
          </div>
          <div className="space-y-3">
            {insights.focusAreas?.map((area, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 text-teal-600 font-bold text-xs border border-teal-100">
                  {i + 1}
                </div>
                <span className="text-sm font-semibold text-slate-700">{area}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-center text-white relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-teal-500/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-extrabold text-teal-400 uppercase tracking-widest">Time Commitment</h3>
            </div>
            <p className="text-2xl font-black mb-1">{insights.readinessTimeline?.split('at')[0] || insights.readinessTimeline}</p>
            {insights.readinessTimeline?.includes('at') && (
              <p className="text-sm text-slate-400 font-medium">
                at {insights.readinessTimeline.split('at')[1]}
              </p>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  )
}
