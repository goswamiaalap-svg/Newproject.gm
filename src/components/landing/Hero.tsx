'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Hero() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      router.push(`/sign-up?email_address=${encodeURIComponent(email.trim())}`)
    }
  }

  return (
    <section id="hero" className="relative w-full px-4 md:px-8 pt-36 pb-16 flex justify-center bg-[#F5F5F3] min-h-screen">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Card: Content */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col justify-center shadow-sm border border-gray-100">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] text-white text-xs font-bold w-max mb-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
            Join +1000 scaling engineers
          </div>
          
          <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-[#111111] mb-6">
            Finally A Platform That Powers <i className="font-serif italic font-normal tracking-normal text-[#444444]">Your Career</i>
          </h1>
          
          <p className="text-[#444444] text-lg md:text-xl font-medium mb-10 max-w-md">
            LaunchPad powers your growth with <span className="text-[#3B82F6]">Intelligence</span>.
          </p>

          <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <input 
              type="email" 
              placeholder="What's your email?" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-[#111111] placeholder-gray-400"
            />
            <button type="submit" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold whitespace-nowrap transition-colors shadow-lg shadow-blue-500/30">
              Get Started &rarr;
            </button>
          </form>
        </div>

        {/* Right Card: Visuals */}
        <div className="bg-gradient-to-br from-[#3b82f6] via-[#818cf8] to-[#fdba74] rounded-[32px] p-6 md:p-8 flex items-center justify-center relative overflow-hidden min-h-[500px]">
          {/* Floating UI Elements representing the LaunchPad Prep Workspace */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[440px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50 z-10 flex flex-col gap-4 text-[#1E293B]"
          >
            {/* Mockup Header */}
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace • Aalap</span>
              <div className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-bold">Active</div>
            </div>

            {/* Grid of study components */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* ATS Resume Scan Widget */}
              <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex flex-col justify-between h-[115px]">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">ATS Resume</span>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">Good</span>
                </div>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className="text-3xl font-extrabold text-slate-800">78</span>
                  <span className="text-slate-400 text-[10px]">/100</span>
                </div>
                <div className="text-[8px] text-slate-500 mt-1 leading-tight">
                  ✓ Structure is standard <br/>
                  ⚠ Add quantified metrics
                </div>
              </div>

              {/* Mock Interview Evaluator */}
              <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex flex-col justify-between h-[115px]">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">AI Speech Eval</span>
                  <span className="text-[8px] px-1 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">Done</span>
                </div>
                <div className="flex items-center gap-1 my-1">
                  <div className="h-6 flex items-end gap-[1.5px] w-full">
                    <span className="h-2 w-[3px] bg-blue-400 rounded-full"></span>
                    <span className="h-4 w-[3px] bg-indigo-500 rounded-full"></span>
                    <span className="h-5 w-[3px] bg-indigo-650 rounded-full"></span>
                    <span className="h-3 w-[3px] bg-indigo-400 rounded-full"></span>
                    <span className="h-6 w-[3px] bg-blue-500 rounded-full"></span>
                    <span className="h-4 w-[3px] bg-indigo-500 rounded-full"></span>
                    <span className="h-2 w-[3px] bg-blue-400 rounded-full"></span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800">Clarity: 85%</div>
                  <div className="text-[8px] text-slate-500 truncate">Pace: 140 WPM (Optimal)</div>
                </div>
              </div>

              {/* DSA Progress & Roadmap Nodes */}
              <div className="col-span-2 bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">DSA Roadmap Nodes</span>
                  <span className="text-[8px] text-slate-500 font-bold">Progress: 6 / 12 Unlocked</span>
                </div>
                
                {/* Node visualization */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-white rounded-xl border border-slate-100 relative">
                  
                  {/* Dotted connecting line */}
                  <div className="absolute left-[30px] right-[30px] top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate-200 z-0"></div>
                  
                  {/* Node 1 */}
                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold shadow-md shadow-emerald-500/20">
                      ✓
                    </div>
                    <span className="text-[8px] font-extrabold text-slate-500">Arrays</span>
                  </div>

                  {/* Node 2 */}
                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold shadow-md shadow-emerald-500/20">
                      ✓
                    </div>
                    <span className="text-[8px] font-extrabold text-slate-500">Lists</span>
                  </div>

                  {/* Node 3 */}
                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className="w-6 h-6 rounded-full bg-[#FEF3C7] border-2 border-amber-500 flex items-center justify-center text-amber-600 text-[8px] font-bold shadow-md shadow-amber-500/10 relative">
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                      ▶
                    </div>
                    <span className="text-[8px] font-extrabold text-slate-800">Trees</span>
                  </div>

                  {/* Node 4 */}
                  <div className="flex flex-col items-center gap-1 z-10 opacity-40">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-[9px] font-bold">
                      🔒
                    </div>
                    <span className="text-[8px] font-extrabold text-slate-500">Graphs</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Section: Streak & Target */}
            <div className="flex justify-between items-center border-t border-slate-200/50 pt-3 text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <div>
                  <div className="text-[11px] font-extrabold text-slate-800">14 Days Streak</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Keep it up!</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <div>
                  <div className="text-[11px] font-extrabold text-slate-800">SDE Target</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Amazon / Flipkart</div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  )
}
