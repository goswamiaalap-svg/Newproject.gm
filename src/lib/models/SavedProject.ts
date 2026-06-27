import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISavedProject extends Document {
  userId: string
  title: string
  description: string
  tags: string
  savedAt: Date
}

const SavedProjectSchema = new Schema<ISavedProject>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    tags: { type: String, default: '' },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'savedAt', updatedAt: false } }
)

// Ensure compound unique index so a user cannot save the same project title multiple times
SavedProjectSchema.index({ userId: 1, title: 1 }, { unique: true })

const SavedProject: Model<ISavedProject> =
  (mongoose.models.SavedProject as Model<ISavedProject>) ||
  mongoose.model<ISavedProject>('SavedProject', SavedProjectSchema)

export default SavedProject
