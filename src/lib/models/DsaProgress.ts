import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDsaProgress extends Document {
  userId: string
  solvedProblems: string[]
  streak: number
  updatedAt: Date
}

const DsaProgressSchema = new Schema<IDsaProgress>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    solvedProblems: [{ type: String }],
    streak: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
)

const DsaProgress: Model<IDsaProgress> =
  (mongoose.models.DsaProgress as Model<IDsaProgress>) ||
  mongoose.model<IDsaProgress>('DsaProgress', DsaProgressSchema)

export default DsaProgress
