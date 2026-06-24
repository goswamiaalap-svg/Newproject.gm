'use client'

import { motion } from 'framer-motion'

export default function Hero() {
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

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <input 
              type="email" 
              placeholder="What's your email?" 
              className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-[#111111] placeholder-gray-400"
            />
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold whitespace-nowrap transition-colors shadow-lg shadow-blue-500/30">
              Get Started &rarr;
            </button>
          </div>
        </div>

        {/* Right Card: Visuals */}
        <div className="bg-gradient-to-br from-[#3b82f6] via-[#818cf8] to-[#fdba74] rounded-[32px] p-8 md:p-12 flex items-center justify-center relative overflow-hidden min-h-[500px]">
          {/* Abstract dark card mimicking the Parker card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[440px] aspect-[1.58/1] bg-[#1F2023] rounded-3xl shadow-2xl relative p-6 md:p-8 flex flex-col justify-between border border-white/5 z-10"
          >
            {/* Background elements in the card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />
            
            {/* Decorative colored stacked cards behind main card */}
            <div className="absolute -right-12 top-2 w-[80%] h-full bg-gradient-to-tr from-orange-300 to-pink-300 rounded-3xl transform rotate-[15deg] -z-20 shadow-lg opacity-90" />
            <div className="absolute -right-6 top-6 w-[80%] h-full bg-gradient-to-tr from-blue-300 to-cyan-200 rounded-3xl transform rotate-[30deg] -z-10 shadow-lg opacity-90" />
            
            {/* Card Header */}
            <div className="flex justify-between items-start z-10">
              <span className="font-heading font-800 text-3xl text-white tracking-tight">Launch<span className="text-white">Pad</span></span>
            </div>

            {/* Card Chip */}
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-gray-300 to-gray-400 shadow-inner z-10 flex flex-col justify-evenly px-1.5 opacity-90">
              <div className="h-[1px] w-full bg-gray-500/50"></div>
              <div className="h-[1px] w-full bg-gray-500/50"></div>
              <div className="h-[1px] w-full bg-gray-500/50"></div>
            </div>

            {/* Card Details */}
            <div className="z-10 mt-6 flex items-end justify-between">
              <div>
                <div className="font-mono text-white/90 text-lg md:text-xl tracking-[0.2em] mb-2">3701 9286 6099 3643</div>
                <div className="flex items-center gap-4 text-white/70 font-mono uppercase">
                  <div className="flex items-center gap-1.5">
                    <span className="block text-[6px] leading-[1.2] text-right tracking-widest font-sans">VALID<br/>THRU</span>
                    <span className="text-sm tracking-widest">08/28</span>
                  </div>
                </div>
              </div>
              {/* Mastercard-like overlapping circles */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#EB001B] mix-blend-screen opacity-90"></div>
                <div className="w-10 h-10 rounded-full bg-[#F79E1B] mix-blend-screen -ml-4 opacity-90"></div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
