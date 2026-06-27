import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOpportunity extends Document {
  id: string
  title: string
  type: 'internship' | 'hackathon' | 'open-source' | 'fellowship'
  company: string
  deadline: Date
  logo: string
  applyUrl: string
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    company: { type: String, required: true },
    deadline: { type: Date, required: true },
    logo: { type: String, required: true },
    applyUrl: { type: String, required: true },
  },
  { timestamps: false }
)

const Opportunity: Model<IOpportunity> =
  (mongoose.models.Opportunity as Model<IOpportunity>) ||
  mongoose.model<IOpportunity>('Opportunity', OpportunitySchema)

export default Opportunity
