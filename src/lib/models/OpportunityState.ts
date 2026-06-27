import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOpportunityState extends Document {
  userId: string
  opportunityId: string
  applied: boolean
  reminded: boolean
  updatedAt: Date
}

const OpportunityStateSchema = new Schema<IOpportunityState>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    opportunityId: {
      type: String,
      required: true,
    },
    applied: { type: Boolean, default: false },
    reminded: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
)

// Compound index for fast queries and uniqueness per user/opportunity
OpportunityStateSchema.index({ userId: 1, opportunityId: 1 }, { unique: true })

const OpportunityState: Model<IOpportunityState> =
  (mongoose.models.OpportunityState as Model<IOpportunityState>) ||
  mongoose.model<IOpportunityState>('OpportunityState', OpportunityStateSchema)

export default OpportunityState
