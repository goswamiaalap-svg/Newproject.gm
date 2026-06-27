import mongoose, { Schema, Document, Model } from 'mongoose'

interface IQuestionResult {
  questionId: number
  score: number
  feedback: string
  idealAnswer: string
}

export interface IInterviewResult extends Document {
  userId: string
  targetRole: string
  overallScore: number
  breakdown: {
    correctness: number
    clarity: number
    depth: number
    communication: number
    speed: number
  }
  questionResults: IQuestionResult[]
  createdAt: Date
}

const QuestionResultSchema = new Schema<IQuestionResult>(
  {
    questionId: { type: Number, required: true },
    score: { type: Number, required: true },
    feedback: { type: String, required: true },
    idealAnswer: { type: String, required: true },
  },
  { _id: false }
)

const InterviewResultSchema = new Schema<IInterviewResult>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    targetRole: { type: String, required: true },
    overallScore: { type: Number, required: true },
    breakdown: {
      correctness: { type: Number, required: true },
      clarity: { type: Number, required: true },
      depth: { type: Number, required: true },
      communication: { type: Number, required: true },
      speed: { type: Number, required: true },
    },
    questionResults: [QuestionResultSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
)

const InterviewResult: Model<IInterviewResult> =
  (mongoose.models.InterviewResult as Model<IInterviewResult>) ||
  mongoose.model<IInterviewResult>('InterviewResult', InterviewResultSchema)

export default InterviewResult
