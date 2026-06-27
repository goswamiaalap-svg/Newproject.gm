'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Lock, BookOpen, ChevronRight, Play, CheckCircle2, Trophy, Flame, BarChart } from 'lucide-react'
import { mockDSATopics } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

interface Problem {
  id: string
  name: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  solved: boolean
  url: string
}

// Map topic IDs to mock problems list
const topicProblems: Record<string, Problem[]> = {
  '1': [
    { id: 't1p1', name: 'Two Sum', difficulty: 'Easy', solved: true, url: 'https://leetcode.com/problems/two-sum/' },
    { id: 't1p2', name: 'Valid Anagram', difficulty: 'Easy', solved: true, url: 'https://leetcode.com/problems/valid-anagram/' },
    { id: 't1p3', name: 'Group Anagrams', difficulty: 'Medium', solved: true, url: 'https://leetcode.com/problems/group-anagrams/' },
  ],
  '2': [
    { id: 't2p1', name: 'Reverse Linked List', difficulty: 'Easy', solved: true, url: 'https://leetcode.com/problems/reverse-linked-list/' },
    { id: 't2p2', name: 'Merge Two Sorted Lists', difficulty: 'Easy', solved: true, url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { id: 't2p3', name: 'Linked List Cycle', difficulty: 'Easy', solved: true, url: 'https://leetcode.com/problems/linked-list-cycle/' },
  ],
  '3': [
    { id: 't3p1', name: 'Valid Parentheses', difficulty: 'Easy', solved: true, url: 'https://leetcode.com/problems/valid-parentheses/' },
    { id: 't3p2', name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', solved: true, url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
  ],
  '4': [
    { id: 't4p1', name: 'Two Sum II', difficulty: 'Medium', solved: true, url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
    { id: 't4p2', name: 'Top K Frequent Elements', difficulty: 'Medium', solved: true, url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  ],
  '5': [
    { id: 't5p1', name: 'Invert Binary Tree', difficulty: 'Easy', solved: true, url: 'https://leetcode.com/problems/invert-binary-tree/' },
    { id: 't5p2', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', solved: true, url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    { id: 't5p3', name: 'Diameter of Binary Tree', difficulty: 'Easy', solved: false, url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
    { id: 't5p4', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', solved: false, url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  ],
  '6': [
    { id: 't6p1', name: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', solved: true, url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
    { id: 't6p2', name: 'Validate Binary Search Tree', difficulty: 'Medium', solved: false, url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  ],
}

export default function DSATrackerPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'locked'>('all')
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [solvedProblems, setSolvedProblems] = useState<string[]>([])
  const [solvedCount, setSolvedCount] = useState(0)
  const [streakCount, setStreakCount] = useState(0)

  // Database-loaded topics and problem sets mapping
  const [dbTopics, setDbTopics] = useState<any[]>(mockDSATopics)
  const [dbTopicProblems, setDbTopicProblems] = useState<Record<string, Problem[]>>(topicProblems)

  useEffect(() => {
    // 1. Fetch from MongoDB API
    fetch('/api/dsa')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.solvedProblems)) {
          setSolvedProblems(data.solvedProblems)
          setSolvedCount(data.solvedProblems.length)
          setStreakCount(data.streak || 0)
          
          if (Array.isArray(data.topics) && data.topics.length > 0) {
            setDbTopics(data.topics)
          }

          if (Array.isArray(data.problems) && data.problems.length > 0) {
            const problemsMap: Record<string, Problem[]> = {}
            data.problems.forEach((p: any) => {
              if (!problemsMap[p.topicId]) {
                problemsMap[p.topicId] = []
              }
              problemsMap[p.topicId].push({
                id: p.id,
                name: p.name,
                difficulty: p.difficulty,
                solved: data.solvedProblems.includes(p.id),
                url: p.url
              })
            })
            setDbTopicProblems(problemsMap)
          }
          
          // Sync local storage as cache
          localStorage.setItem('launchpad_dsa_solved', JSON.stringify(data.solvedProblems))
          localStorage.setItem('launchpad_dsa_streak', (data.streak || 0).toString())
        } else {
          loadFromLocalStorage()
        }
      })
      .catch((err) => {
        console.error('Failed to fetch DSA progress, falling back to local storage:', err)
        loadFromLocalStorage()
      })

    function loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('launchpad_dsa_solved')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            setSolvedProblems(parsed)
            setSolvedCount(parsed.length)
            if (parsed.length > 0) {
              const streak = localStorage.getItem('launchpad_dsa_streak')
              setStreakCount(streak ? parseInt(streak) : 1)
            } else {
              setStreakCount(0)
            }
          } catch (e) {
            console.error(e)
          }
        } else {
          setSolvedCount(0)
          setStreakCount(0)
        }
      }
    }
  }, [])

  // Sync problems list with solvedProblems when selectedTopic changes
  useEffect(() => {
    if (selectedTopic) {
      const list = dbTopicProblems[selectedTopic.id] || [
        { id: `${selectedTopic.id}p1`, name: `Sample Problem for ${selectedTopic.name} I`, difficulty: 'Medium', solved: false, url: '#' },
        { id: `${selectedTopic.id}p2`, name: `Sample Problem for ${selectedTopic.name} II`, difficulty: 'Hard', solved: false, url: '#' },
      ]
      const mapped = list.map(prob => ({
        ...prob,
        solved: solvedProblems.includes(prob.id)
      }))
      setProblems(mapped)
    }
  }, [solvedProblems, selectedTopic?.id, dbTopicProblems])

  // Load problems when topic is clicked
  const handleTopicClick = (topic: any) => {
    if (topic.status === 'locked') return
    setSelectedTopic(topic)
    const list = dbTopicProblems[topic.id] || [
      { id: `${topic.id}p1`, name: `Sample Problem for ${topic.name} I`, difficulty: 'Medium', solved: false, url: '#' },
      { id: `${topic.id}p2`, name: `Sample Problem for ${topic.name} II`, difficulty: 'Hard', solved: false, url: '#' },
    ]
    const mapped = list.map(prob => ({
      ...prob,
      solved: solvedProblems.includes(prob.id)
    }))
    setProblems(mapped)
  }

  const handleToggleProblem = (id: string) => {
    let nextSolvedProblems = [...solvedProblems]
    const isAdding = !solvedProblems.includes(id)
    
    if (isAdding) {
      nextSolvedProblems.push(id)
      // Trigger confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0D9488', '#6366F1', '#F59E0B'],
      })
    } else {
      nextSolvedProblems = nextSolvedProblems.filter(pid => pid !== id)
    }
    
    setSolvedProblems(nextSolvedProblems)
    setSolvedCount(nextSolvedProblems.length)
    localStorage.setItem('launchpad_dsa_solved', JSON.stringify(nextSolvedProblems))
    
    let nextStreak = streakCount
    if (nextSolvedProblems.length > 0) {
      const currentStreak = localStorage.getItem('launchpad_dsa_streak')
      if (!currentStreak || currentStreak === '0') {
        nextStreak = 1
      } else {
        nextStreak = parseInt(currentStreak)
      }
    } else {
      nextStreak = 0
    }
    setStreakCount(nextStreak)
    localStorage.setItem('launchpad_dsa_streak', nextStreak.toString())

    // Sync to MongoDB database
    fetch('/api/dsa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solvedProblems: nextSolvedProblems, streak: nextStreak }),
    }).catch(err => console.error('Failed to save DSA progress to DB:', err))
  }

  // Calculate dynamic status and solved count for each topic
  const dynamicTopics = dbTopics.map((topic) => {
    const problemsList = dbTopicProblems[topic.id] || [
      { id: `${topic.id}p1`, name: `Sample Problem for ${topic.name} I`, difficulty: 'Medium', solved: false, url: '#' },
      { id: `${topic.id}p2`, name: `Sample Problem for ${topic.name} II`, difficulty: 'Hard', solved: false, url: '#' },
    ]
    const totalCount = problemsList.length
    const solvedInTopic = problemsList.filter(p => solvedProblems.includes(p.id)).length
    
    return {
      ...topic,
      problems: totalCount,
      solved: solvedInTopic,
    }
  })

  // Set status dynamically: a node is unlocked (in-progress or completed) only if all previous nodes are completed.
  const topicsWithStatus: any[] = []
  for (let i = 0; i < dynamicTopics.length; i++) {
    const topic = dynamicTopics[i]
    const isAllSolved = topic.solved === topic.problems && topic.problems > 0
    let status: 'completed' | 'in-progress' | 'locked' = 'locked'
    
    if (i === 0) {
      status = isAllSolved ? 'completed' : 'in-progress'
    } else {
      const prev = topicsWithStatus[i - 1]
      if (prev.status === 'completed') {
        status = isAllSolved ? 'completed' : 'in-progress'
      } else {
        status = 'locked'
      }
    }
    topicsWithStatus.push({ ...topic, status })
  }

  // Define graph node coordinates for vertical zigzag roadmap
  const nodesWithCoords = topicsWithStatus.map((topic, index) => {
    // Left-to-right alternating snake pattern coordinates
    const row = Math.floor(index / 2)
    const isLeft = index % 2 === 0
    const x = isLeft ? 150 : 350
    const y = 80 + row * 150
    return { ...topic, x, y }
  })

  // Filter topics
  const filteredTopics = nodesWithCoords.filter((t) => {
    if (filter === 'all') return true
    return t.status === filter
  })

  return (
    <div className="space-y-6">
      {/* Header Area Wrapper */}
      <div className="!bg-[#FAFAFA] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold !text-[#0F172A]">
            DSA Tracker
          </h1>
          <p className="!text-[#475569] text-sm mt-1">
            Track your node-based learning path and tackle 200+ curated problems.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 !bg-white border !border-[#E2E8F0] p-1.5 rounded-lg shadow-sm">
          {(['all', 'completed', 'in-progress', 'locked'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={cn(
                'text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md transition-all',
                filter === opt
                  ? '!bg-[#0D9488] !text-white shadow-sm'
                  : '!text-[#64748B] hover:!text-[#0F172A] hover:!bg-[#F1F5F9]'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border-default rounded-card p-4 flex items-center gap-4 shadow-card">
          <div className="p-3 bg-teal/5 text-teal rounded-btn">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-text-muted text-[10px] font-semibold uppercase tracking-wider">Solved Problems</p>
            <p className="font-display text-xl font-bold text-text-primary mt-0.5">{solvedCount} / 200</p>
          </div>
        </div>

        <div className="bg-white border border-border-default rounded-card p-4 flex items-center gap-4 shadow-card">
          <div className="p-3 bg-indigo/5 text-indigo rounded-btn">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-text-muted text-[10px] font-semibold uppercase tracking-wider">Active Streak</p>
            <p className="font-display text-xl font-bold text-text-primary mt-0.5">{streakCount} Days</p>
          </div>
        </div>

        <div className="bg-white border border-border-default rounded-card p-4 flex items-center gap-4 shadow-card">
          <div className="p-3 bg-gold/5 text-gold rounded-btn">
            <BarChart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-text-muted text-[10px] font-semibold uppercase tracking-wider">Completion Rate</p>
            <p className="font-display text-xl font-bold text-text-primary mt-0.5">
              {Math.min(100, Math.round((solvedCount / 200) * 100))}%
            </p>
          </div>
        </div>
      </div>

      {/* Layout: Graph & Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left/Middle: SVG Node Graph (Col span 7) */}
        <div className="lg:col-span-7 bg-white border border-border-default rounded-card p-6 shadow-card min-h-[500px] flex items-center justify-center overflow-x-auto relative">
          <svg className="w-[500px] h-[950px]" viewBox="0 0 500 950">
            {/* Draw winding path lines */}
            {nodesWithCoords.map((node, index) => {
              if (index === 0) return null
              const prev = nodesWithCoords[index - 1]
              
              // Define color based on status
              const isPrevCompleted = prev.status === 'completed'
              const isCurrCompleted = node.status === 'completed'
              const strokeColor = isCurrCompleted
                ? '#0D9488' // Teal line
                : isPrevCompleted && node.status === 'in-progress'
                ? '#6366F1' // Indigo transition
                : '#E2E8F0' // Gray locked

              // Curved bezier pathway connection
              return (
                <path
                  key={`path-${index}`}
                  d={`M ${prev.x} ${prev.y} C ${prev.x} ${(prev.y + node.y) / 2}, ${node.x} ${(prev.y + node.y) / 2}, ${node.x} ${node.y}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="4"
                  strokeDasharray={node.status === 'locked' ? '6,6' : 'none'}
                  className="transition-colors duration-500"
                />
              )
            })}

            {/* Draw nodes */}
            {filteredTopics.map((node, index) => {
              const isCompleted = node.status === 'completed'
              const isInProgress = node.status === 'in-progress'
              
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleTopicClick(node)}
                  className={cn(
                    'cursor-pointer select-none group',
                    node.status === 'locked' && 'cursor-not-allowed opacity-60'
                  )}
                >
                  {/* Outer Glow Pulse for Active Node */}
                  {isInProgress && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.3"
                    />
                  )}

                  {/* Outer circle border */}
                  <circle
                    r="20"
                    fill={isCompleted ? '#0D9488' : isInProgress ? '#FEF3C7' : '#FFFFFF'}
                    stroke={isCompleted ? '#0F766E' : isInProgress ? '#F59E0B' : '#94A3B8'}
                    strokeWidth="3.5"
                    className="transition-all duration-300 group-hover:r-22"
                  />

                  {/* Node icon placeholder */}
                  {isCompleted ? (
                    <path
                      d="M -5 0 L -1 4 L 6 -3"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  ) : node.status === 'locked' ? (
                    <g transform="translate(-5, -6) scale(0.65)">
                      <path
                        d="M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10"
                        stroke="#94A3B8"
                        strokeWidth="2.5"
                        fill="none"
                      />
                      <path
                        d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10"
                        stroke="#94A3B8"
                        strokeWidth="2.5"
                        fill="none"
                      />
                    </g>
                  ) : (
                    <circle r="4" fill="#F59E0B" />
                  )}

                  {/* Node label box */}
                  <g transform={`translate(${node.x > 250 ? 30 : -150}, -15)`}>
                    <rect
                      width="120"
                      height="30"
                      rx="6"
                      fill="#0F172A"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <text
                      x="15"
                      y="18"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {node.problems} Problems
                    </text>
                  </g>

                  {/* Text underneath the node */}
                  <text
                    y="36"
                    textAnchor="middle"
                    className="fill-text-primary font-sans font-bold text-[10px] group-hover:fill-teal transition-colors"
                  >
                    {node.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Right: Topic Side Drawer Panel (Col span 3) */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedTopic ? (
              <motion.div
                key={selectedTopic.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-border-default rounded-card p-5 shadow-card space-y-5"
              >
                {/* Drawer Header */}
                <div className="flex justify-between items-start border-b border-border-subtle pb-3">
                  <div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-bg-subtle text-text-secondary border border-border-default font-semibold uppercase tracking-wider">
                      {selectedTopic.category}
                    </span>
                    <h3 className="font-display text-base font-bold text-text-primary mt-1.5">
                      {selectedTopic.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="text-text-muted hover:text-text-primary text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Subinfo */}
                <div className="grid grid-cols-2 gap-3 text-xs border-b border-border-subtle pb-3 text-text-secondary">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase">Difficulty</span>
                    <p className="font-bold text-teal mt-0.5">{selectedTopic.difficulty}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase">Time Target</span>
                    <p className="font-bold text-text-primary mt-0.5">{selectedTopic.estimatedTime}</p>
                  </div>
                </div>

                {/* Problems checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Required Problems ({problems.filter((p) => p.solved).length}/{problems.length})
                  </h4>

                  <div className="space-y-2.5">
                    {problems.map((prob) => (
                      <div
                        key={prob.id}
                        className="flex items-center justify-between p-3 bg-bg-base/50 rounded-btn border border-border-subtle hover:border-teal/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => handleToggleProblem(prob.id)}
                            className="focus:outline-none"
                          >
                            {prob.solved ? (
                              <CheckCircle2 className="w-5 h-5 text-teal fill-teal/10" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-border-default hover:border-teal bg-white" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-text-primary truncate hover:underline hover:text-teal block cursor-pointer"
                            >
                              {prob.name}
                            </a>
                            <span
                              className={cn(
                                'text-[9px] font-bold mt-0.5 inline-block',
                                prob.difficulty === 'Easy' && 'text-teal',
                                prob.difficulty === 'Medium' && 'text-indigo',
                                prob.difficulty === 'Hard' && 'text-gold'
                              )}
                            >
                              {prob.difficulty}
                            </span>
                          </div>
                        </div>

                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-text-muted hover:text-teal"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-bg-subtle/30 border border-dashed border-border-default rounded-card p-8 text-center text-text-muted flex flex-col items-center justify-center min-h-[300px]">
                <BookOpen className="w-8 h-8 mb-3 text-text-muted" />
                <p className="text-xs font-medium">Select an active topic node on the map to view problem lists and practice resources.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
