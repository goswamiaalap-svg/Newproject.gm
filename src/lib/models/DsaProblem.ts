import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDsaProblem extends Document {
  id: string // Problem identifier (e.g. 't1p1')
  topicId: string // Reference to DsaTopic.id (e.g. '1')
  name: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  url: string
}

const DsaProblemSchema = new Schema<IDsaProblem>(
  {
    id: { type: String, required: true, unique: true },
    topicId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    difficulty: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: false }
)

const DsaProblem: Model<IDsaProblem> =
  (mongoose.models.DsaProblem as Model<IDsaProblem>) ||
  mongoose.model<IDsaProblem>('DsaProblem', DsaProblemSchema)

export default DsaProblem
