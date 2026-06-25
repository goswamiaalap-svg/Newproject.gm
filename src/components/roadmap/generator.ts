// ─── Gemini JSON → React Flow Graph Transformer ──────────────────────────────
// Takes the structured JSON returned by Gemini and converts it to
// React Flow nodes + edges that the RoadmapCanvas can render.

import type {
  RoadmapConfig,
  RoadmapNodeData,
  RoadmapEdgeDef,
  WizardInput,
  GeminiRoadmapOutput,
  GeminiInsights,
  Resource,
  Difficulty,
} from './types'

// ─── Node builders ────────────────────────────────────────────────────────────

function sectionNode(id: string, label: string, theme: string): RoadmapNodeData {
  return {
    id,
    label,
    kind: 'section',
    status: 'pending',
    description: theme,
  }
}

function topicNode(
  id: string,
  label: string,
  description: string,
  hours: number,
  resources: Resource[],
  difficulty: Difficulty,
  topics: string[],
): RoadmapNodeData {
  const subtopicDesc = topics.length
    ? `Topics: ${topics.join(', ')}. ${description}`
    : description

  return {
    id,
    label,
    kind: 'topic',
    description: subtopicDesc,
    estimatedHours: hours,
    status: 'pending',
    resources,
    difficulty,
  }
}

function edge(source: string, target: string): RoadmapEdgeDef {
  return { id: `e-${source}-${target}`, source, target }
}

function mapDifficulty(d: string): Difficulty {
  if (d === 'Advanced') return 'advanced'
  if (d === 'Intermediate') return 'intermediate'
  return 'beginner'
}

// ─── Main Transformer ─────────────────────────────────────────────────────────

export function transformGeminiToRoadmap(
  gemini: GeminiRoadmapOutput,
  input: WizardInput,
): RoadmapConfig {
  const allNodes: RoadmapNodeData[] = []
  const allEdges: RoadmapEdgeDef[] = []

  gemini.weeks.forEach((week, weekIdx) => {
    const sectionId = `week-${week.week}`
    allNodes.push(sectionNode(sectionId, `Week ${week.week}: ${week.title}`, week.theme))

    week.tasks.forEach((task, taskIdx) => {
      const taskId = `task-${week.week}-${taskIdx}`

      const resources: Resource[] = (task.resources || []).map(r => ({
        type: r.type,
        title: r.title,
        url: r.url,
        platform: r.platform,
        free: r.free,
      }))

      allNodes.push(
        topicNode(
          taskId,
          task.title,
          task.description,
          task.estimatedHours,
          resources,
          mapDifficulty(task.difficulty),
          task.topics || [],
        ),
      )

      allEdges.push(edge(sectionId, taskId))
    })
  })

  // Heuristic readiness %
  const baseMap: Record<string, number> = {
    '200+': 60, '50–200': 35, '1–50': 15, '0': 5,
  }
  const projectMap: Record<string, number> = {
    '5+': 25, '3–5': 18, '1–2': 10, '0': 0,
  }
  let readiness = (baseMap[input.leetcodeCount] ?? 10) + (projectMap[input.projectsBuilt] ?? 0)
  if (input.hasInternship === 'Yes') readiness += 10
  if (input.hasResume === 'Yes') readiness += 5
  readiness = Math.min(95, readiness)

  return {
    id: `roadmap-${Date.now()}`,
    title: gemini.title,
    subtitle: gemini.subtitle,
    goal: input.goal,
    currentLevel: input.currentYear,
    totalWeeks: gemini.weeks.length,
    dailyHours: input.dailyHours,
    generatedAt: new Date().toISOString(),
    nodes: allNodes,
    edges: allEdges,
    readinessPct: readiness,
    focusAreas: gemini.insights.focusAreas,
    insights: gemini.insights,
  }
}
