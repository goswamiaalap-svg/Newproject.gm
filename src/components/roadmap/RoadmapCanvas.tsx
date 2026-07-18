'use client'

import React, { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
  ConnectionLineType,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { RoadmapConfig, RoadmapNodeData, NodeStatus } from './types'
import { SectionNode, TopicNode, SubtopicNode } from './nodes'
import { CheckCircle2, Circle, Loader2, RotateCcw, Download, Share2 } from 'lucide-react'

// ─── Node type registry ───────────────────────────────────────────────────────

const STATUS_CYCLE: Record<NodeStatus, NodeStatus> = {
  pending: 'in-progress',
  'in-progress': 'done',
  done: 'pending',
}

// ─── Convert RoadmapConfig → React Flow nodes + edges ────────────────────────

const SECTION_GAP = 400
const TOPIC_GAP_Y = 96
const START_Y = 0
const TOPIC_START_Y = 100

function buildFlowGraph(
  config: RoadmapConfig,
  onStatusCycle: (id: string) => void,
  onSelectNode: (id: string) => void,
) {
  const nodeMap = new Map(config.nodes.map(n => [n.id, n]))

  // Find section roots
  const sectionIds = config.nodes.filter(n => n.kind === 'section').map(n => n.id)

  // Build child lookup
  const childrenOf = new Map<string, string[]>()
  config.edges.forEach(e => {
    if (!childrenOf.has(e.source)) childrenOf.set(e.source, [])
    childrenOf.get(e.source)!.push(e.target)
  })

  const flowNodes: Node[] = []
  const flowEdges: Edge[] = []

  sectionIds.forEach((sectionId, secIdx) => {
    const secX = secIdx * SECTION_GAP
    const sectionData = nodeMap.get(sectionId)!

    flowNodes.push({
      id: sectionId,
      type: 'section',
      position: { x: secX, y: START_Y },
      data: { ...sectionData, onStatusCycle, onSelect: onSelectNode },
      draggable: true,
    })

    const children = childrenOf.get(sectionId) ?? []
    children.forEach((childId, childIdx) => {
      const childData = nodeMap.get(childId)!

      flowNodes.push({
        id: childId,
        type: childData.kind === 'subtopic' ? 'subtopic' : 'topic',
        position: { x: secX, y: TOPIC_START_Y + childIdx * TOPIC_GAP_Y },
        data: { ...childData, onStatusCycle, onSelect: onSelectNode },
        draggable: true,
      })

      flowEdges.push({
        id: `e-${sectionId}-${childId}`,
        source: sectionId,
        target: childId,
        type: 'smoothstep',
        animated: childData.status === 'in-progress',
        style: {
          stroke: childData.status === 'done' ? '#14B8A6' : childData.status === 'in-progress' ? '#6366F1' : '#CBD5E1',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: childData.status === 'done' ? '#14B8A6' : childData.status === 'in-progress' ? '#6366F1' : '#CBD5E1',
          width: 16,
          height: 16,
        },
      })
    })
  })

  return { flowNodes, flowEdges }
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressOverlay({ config, nodeStatuses }: { config: RoadmapConfig; nodeStatuses: Map<string, NodeStatus> }) {
  const topics = config.nodes.filter(n => n.kind === 'topic' || n.kind === 'subtopic')
  const done = topics.filter(n => (nodeStatuses.get(n.id) ?? n.status) === 'done').length
  const inProg = topics.filter(n => (nodeStatuses.get(n.id) ?? n.status) === 'in-progress').length
  const pct = topics.length > 0 ? Math.round((done / topics.length) * 100) : 0

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl shadow-lg px-5 py-3.5 min-w-[260px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-700">{config.title}</span>
        <span className="text-lg font-bold text-slate-800 tabular-nums">{pct}%</span>
      </div>
      <p className="text-[11px] text-slate-400 mb-3">{config.subtitle}</p>

      {/* Progress bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
          {done} Done
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Loader2 className="w-3.5 h-3.5 text-indigo-400" />
          {inProg} In Progress
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Circle className="w-3.5 h-3.5 text-slate-300" />
          {topics.length - done - inProg} Left
        </span>
      </div>
    </div>
  )
}

// ─── Main Canvas Component ────────────────────────────────────────────────────

const nodeTypes: NodeTypes = {
  section: SectionNode as any,
  topic: TopicNode as any,
  subtopic: SubtopicNode as any,
}

interface Props {
  config: RoadmapConfig
  onReset: () => void
}

export default function RoadmapCanvas({ config, onReset }: Props) {
  // Track status overrides separately (to avoid re-mounting entire graph)
  const [nodeStatuses, setNodeStatuses] = React.useState<Map<string, NodeStatus>>(new Map())

  const cycleStatus = useCallback((nodeId: string) => {
    setNodeStatuses(prev => {
      const next = new Map(prev)
      const current = next.get(nodeId) ?? (config.nodes.find(n => n.id === nodeId)?.status ?? 'pending')
      next.set(nodeId, STATUS_CYCLE[current])
      return next
    })
  }, [config.nodes])

  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null)

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(prev => prev === nodeId ? null : nodeId)
  }, [])

  // Merge statuses into node data before feeding to React Flow
  const mergedConfig = useMemo(() => ({
    ...config,
    nodes: config.nodes.map(n => ({
      ...n,
      status: nodeStatuses.get(n.id) ?? n.status,
    })),
  }), [config, nodeStatuses])

  const { flowNodes, flowEdges } = useMemo(
    () => buildFlowGraph(mergedConfig, cycleStatus, handleSelectNode),
    [mergedConfig, cycleStatus, handleSelectNode]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges)

  // Sync when config or statuses change
  React.useEffect(() => {
    const { flowNodes: fn, flowEdges: fe } = buildFlowGraph(mergedConfig, cycleStatus, handleSelectNode)
    setNodes(fn)
    setEdges(fe)
  }, [mergedConfig, cycleStatus, handleSelectNode])

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#CBD5E1', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-[#FAFBFC]"
      >
        {/* Subtle dot grid background */}
        <Background color="#E2E8F0" gap={20} size={1} />

        {/* Top-left: roadmap metadata + progress */}
        <Panel position="top-left">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ProgressOverlay config={config} nodeStatuses={nodeStatuses} />
          </motion.div>
        </Panel>

        {/* Top-right: actions */}
        <Panel position="top-right">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-semibold shadow-sm transition-all hover:shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Roadmap
            </button>
          </motion.div>
        </Panel>

        {/* Controls (zoom / fit) */}
        <Controls
          className="!bg-white !border-slate-200 !shadow-sm !rounded-xl"
          showInteractive={false}
        />

        {/* Minimap */}
        <MiniMap
          nodeColor={(node) => {
            const status = (node.data as any)?.status ?? 'pending'
            return status === 'done' ? '#14B8A6' : status === 'in-progress' ? '#6366F1' : '#E2E8F0'
          }}
          style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12 }}
          maskColor="rgba(241,245,249,0.6)"
        />
      </ReactFlow>

      {/* Keyboard hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-full shadow-sm text-[11px] text-slate-400 font-medium"
        >
          <span>Click node status ○ to cycle</span>
          <span className="w-px h-3 bg-slate-200" />
          <span>Click card to expand</span>
          <span className="w-px h-3 bg-slate-200" />
          <span>Scroll to zoom</span>
        </motion.div>
      </div>
    </div>
  )
}
