import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IIdealProfile {
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

export interface ITargetResume {
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

export interface IRoadmapItem {
  id: string
  title: string
  type: 'dsa' | 'subject' | 'project' | 'general'
  completed: boolean
}

export interface IRoadmapWeek {
  id: string
  weekNum: number
  title: string
  items: IRoadmapItem[]
}

export interface ICareerTarget extends Document {
  userId: string           // Clerk user ID (matches User.clerkId)
  targetType: 'job' | 'gig' | 'solo' | 'research' | 'open_source' | 'higher_ed'
  targetTitle: string
  targetDescription: string
  idealProfile?: IIdealProfile
  perfectResume?: ITargetResume
  readinessScore?: number  // 0-100 overall readiness
  gapAnalysis?: {
    missingSkills: string[]
    matchingSkills: string[]
    recommendedProjects: {
      title: string
      description: string
      skillsAddressed: string[]
    }[]
    actionSteps: string[]
  }
  roadmap?: IRoadmapWeek[]
  isActive: boolean
  createdAt: Date
}

const RoadmapItemSchema = new Schema<IRoadmapItem>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['dsa', 'subject', 'project', 'general'], default: 'general' },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
)

const RoadmapWeekSchema = new Schema<IRoadmapWeek>(
  {
    id: { type: String, required: true },
    weekNum: { type: Number, required: true },
    title: { type: String, required: true },
    items: [RoadmapItemSchema],
  },
  { _id: false }
)

const IdealProfileSchema = new Schema<IIdealProfile>(
  {
    skills: {
      technical: [{ type: String }],
      soft: [{ type: String }],
    },
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
      },
    ],
    experience: {
      milestones: [{ type: String }],
    },
  },
  { _id: false }
)

const TargetResumeSchema = new Schema<ITargetResume>(
  {
    summary: { type: String, required: true },
    skills: [
      {
        category: { type: String, required: true },
        items: [{ type: String }],
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [{ type: String }],
        bullets: [{ type: String }],
      },
    ],
    experience: [
      {
        role: { type: String, required: true },
        organization: { type: String, required: true },
        duration: { type: String, required: true },
        bullets: [{ type: String }],
      },
    ],
  },
  { _id: false }
)

const GapAnalysisSchema = new Schema(
  {
    missingSkills: [{ type: String }],
    matchingSkills: [{ type: String }],
    recommendedProjects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        skillsAddressed: [{ type: String }],
      },
    ],
    actionSteps: [{ type: String }],
  },
  { _id: false }
)

const CareerTargetSchema = new Schema<ICareerTarget>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['job', 'gig', 'solo', 'research', 'open_source', 'higher_ed'],
      required: true,
    },
    targetTitle: {
      type: String,
      required: true,
    },
    targetDescription: {
      type: String,
      required: true,
    },
    idealProfile: {
      type: IdealProfileSchema,
      required: false,
    },
    perfectResume: {
      type: TargetResumeSchema,
      required: false,
    },
    readinessScore: {
      type: Number,
      default: 0,
    },
    gapAnalysis: {
      type: GapAnalysisSchema,
      required: false,
    },
    roadmap: {
      type: [RoadmapWeekSchema],
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
)

// Prevent model re-compilation in Next.js hot-reload
const CareerTarget: Model<ICareerTarget> =
  (mongoose.models.CareerTarget as Model<ICareerTarget>) ||
  mongoose.model<ICareerTarget>('CareerTarget', CareerTargetSchema)

export default CareerTarget
