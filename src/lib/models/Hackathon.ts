import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IHackathon extends Document {
  id: string
  name: string
  deadline: string // Date string format like YYYY-MM-DD
  prize: string
  participants: number
  status: 'Registration Open' | 'Coming Soon'
}

const HackathonSchema = new Schema<IHackathon>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    deadline: { type: String, required: true },
    prize: { type: String, required: true },
    participants: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: false }
)

const Hackathon: Model<IHackathon> =
  (mongoose.models.Hackathon as Model<IHackathon>) ||
  mongoose.model<IHackathon>('Hackathon', HackathonSchema)

export default Hackathon
