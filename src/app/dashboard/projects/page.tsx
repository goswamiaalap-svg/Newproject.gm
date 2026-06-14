'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Code2, Plus, X, ArrowRight, ShieldCheck, Star, ChevronDown } from 'lucide-react'
import { mockProjectIdeas } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function ProjectsPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Next.js', 'Python'])
  const [skillInput, setSkillInput] = useState('')
  const [year, setYear] = useState('3rd Year')
  const [domain, setDomain] = useState('AI/ML')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResults, setShowResults] = useState(true)
  const [savedProjects, setSavedProjects] = useState<string[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/projects/save')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // data is array of saved projects, map by title
          setSavedProjects(data.map(p => p.title))
        }
      })
      .catch(console.error)
  }, [])

  const presetSkills = ['React', 'Node.js', 'Python', 'TensorFlow', 'MongoDB', 'PostgreSQL', 'WebSocket', 'Flask', 'Docker']

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill))
  }

  const handleToggleSave = async (project: any) => {
    const isSaved = savedProjects.includes(project.name);
    
    // Optimistic UI update
    if (isSaved) {
      setSavedProjects(savedProjects.filter((name) => name !== project.name))
    } else {
      setSavedProjects([...savedProjects, project.name])
    }

    // Sync to DB
    try {
      await fetch('/api/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isSaved ? 'unsave' : 'save',
          title: project.name,
          description: project.description,
          tags: project.techStack.join(',')
        })
      })
    } catch (e) {
      console.error('Failed to sync save state to db', e)
    }
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowResults(true)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-text-primary">
          Project Idea Generator
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Generate unique capstones and resume projects tailored to your target domains and skills.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column: Filter Inputs (Col 3.5 = lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-5">
            <h3 className="font-display text-base font-bold text-text-primary border-b border-border-subtle pb-3">
              Configure Generator
            </h3>

            {/* Year of study select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                Target Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-bg-base border border-border-default rounded-btn text-xs focus:outline-none focus:border-teal text-text-primary transition-colors cursor-pointer"
              >
                <option value="1st Year">1st Year (Basic web/scripts)</option>
                <option value="2nd Year">2nd Year (Intermediate apps)</option>
                <option value="3rd Year">3rd Year (Advanced Fullstack/ML)</option>
                <option value="4th Year">4th Year (Capstones / Distributed)</option>
              </select>
            </div>

            {/* Target Domain */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                Target Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 bg-bg-base border border-border-default rounded-btn text-xs focus:outline-none focus:border-teal text-text-primary transition-colors cursor-pointer"
              >
                <option value="AI/ML">Artificial Intelligence / ML</option>
                <option value="EdTech">EdTech Platforms</option>
                <option value="DevTools">Developer Tooling (CLI, API)</option>
                <option value="Sustainability">GreenTech & Sustainability</option>
                <option value="FinTech">Blockchain & FinTech</option>
              </select>
            </div>

            {/* Skill tags */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Select Tech Stack/Skills
              </label>
              
              {/* Input for custom skill */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(skillInput)}
                  placeholder="e.g. Next.js, Docker..."
                  className="flex-1 px-3 py-2 bg-bg-base border border-border-default rounded-btn text-xs focus:outline-none focus:border-teal text-text-primary transition-colors"
                />
                <button
                  onClick={() => handleAddSkill(skillInput)}
                  className="p-2 bg-teal text-white rounded-btn hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Preset popular skill clicks */}
              <div className="flex flex-wrap gap-1 mt-2">
                {presetSkills.map((preset) => {
                  const isSelected = selectedSkills.includes(preset)
                  return (
                    <button
                      key={preset}
                      onClick={() => isSelected ? handleRemoveSkill(preset) : handleAddSkill(preset)}
                      className={cn(
                        'text-[9px] font-bold px-2 py-1 rounded transition-colors border',
                        isSelected
                          ? 'bg-teal/10 border-teal/20 text-teal'
                          : 'bg-bg-base border-border-subtle text-text-secondary hover:bg-bg-subtle'
                      )}
                    >
                      {preset}
                    </button>
                  )
                })}
              </div>

              {/* Selected Skill List */}
              <div className="flex flex-wrap gap-1.5 pt-3">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo/5 text-indigo text-[10px] font-bold border border-indigo/10"
                  >
                    <span>{skill}</span>
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 bg-teal hover:bg-teal-600 text-white font-bold rounded-btn flex items-center justify-center gap-1.5 shadow-teal-glow active:scale-95 transition-all text-xs"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Generate Project Ideas</span>
            </button>
          </div>
        </div>

        {/* Right Column: Project Cards (Col 6.5 = lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-border-default rounded-card p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-card"
              >
                <div className="w-12 h-12 border-4 border-teal/10 border-t-teal rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold text-text-primary">Structuring Standout Architectures...</p>
                <p className="text-text-muted text-[10px] mt-1.5">Checking company target parameters for {domain} projects</p>
              </motion.div>
            ) : showResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {mockProjectIdeas.map((project, idx) => {
                  const isSaved = savedProjects.includes(project.name)
                  const isExpanded = expandedCard === project.id
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-border-default rounded-card p-5 shadow-card hover:shadow-card-hover transition-all space-y-4"
                    >
                      {/* Card Title & Save Button */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal/5 text-teal border border-teal/10 uppercase tracking-wider">
                              {project.domain}
                            </span>
                            <span
                              className={cn(
                                'text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                                project.complexity === 'Advanced'
                                  ? 'bg-red-50 text-red-600 border-red-100'
                                  : 'bg-amber-50 text-amber-600 border-amber-100'
                              )}
                            >
                              {project.complexity}
                            </span>
                          </div>
                          <h4 className="font-display text-base font-bold text-text-primary mt-2">
                            {project.name}
                          </h4>
                        </div>
                        
                        <button
                          onClick={() => handleToggleSave(project)}
                          className={cn(
                            'p-2 rounded-btn border transition-all flex items-center justify-center',
                            isSaved
                              ? 'bg-gold-light border-gold text-gold shadow-sm'
                              : 'bg-white border-border-default text-text-muted hover:text-text-primary'
                          )}
                          title="Save project idea"
                        >
                          <Star className={cn('w-4 h-4', isSaved && 'fill-current')} />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-text-secondary text-xs leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech stack chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] font-semibold font-mono px-2 py-0.5 rounded bg-bg-subtle text-text-secondary border border-border-subtle"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Accordion trigger "Why it stands out" */}
                      <div className="border-t border-border-subtle pt-3">
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : project.id)}
                          className="w-full flex justify-between items-center text-left text-xs font-bold text-text-secondary hover:text-teal transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-teal" />
                            <span>Why this project stands out in SDE interviews</span>
                          </span>
                          <ChevronDown className={cn('w-4 h-4 transition-transform duration-300', isExpanded && 'rotate-180')} />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-bg-base/50 border border-border-subtle rounded-btn p-3 mt-2 text-xs text-text-secondary leading-relaxed">
                                {project.whyStandout}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <div className="bg-bg-subtle/30 border border-dashed border-border-default rounded-card p-12 text-center text-text-muted flex flex-col items-center justify-center min-h-[400px]">
                <Code2 className="w-10 h-10 text-text-muted mb-3" />
                <p className="text-xs font-medium">Select your tech stack, choosing domain goals on the left and click Generate Ideas.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
