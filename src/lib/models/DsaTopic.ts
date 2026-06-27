import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDsaTopic extends Document {
  id: string // String identifier (e.g. '1', '2')
  name: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  problems: number
  solved: number
  estimatedTime: string
}

const DsaTopicSchema = new Schema<IDsaTopic>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    problems: { type: Number, required: true },
    solved: { type: Number, default: 0 },
    estimatedTime: { type: String, required: true },
  },
  { timestamps: false }
)

const DsaTopic: Model<IDsaTopic> =
  (mongoose.models.DsaTopic as Model<IDsaTopic>) ||
  mongoose.model<IDsaTopic>('DsaTopic', DsaTopicSchema)

export default DsaTopic
