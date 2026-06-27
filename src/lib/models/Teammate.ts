import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITeammate extends Document {
  id: string
  name: string
  college: string
  skills: string[]
  domains: string[]
  availability: 'available' | 'busy'
  experience: string
  avatar: string
}

const TeammateSchema = new Schema<ITeammate>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    college: { type: String, required: true },
    skills: [{ type: String }],
    domains: [{ type: String }],
    availability: { type: String, required: true },
    experience: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  { timestamps: false }
)

const Teammate: Model<ITeammate> =
  (mongoose.models.Teammate as Model<ITeammate>) ||
  mongoose.model<ITeammate>('Teammate', TeammateSchema)

export default Teammate
