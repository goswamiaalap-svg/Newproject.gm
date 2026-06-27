import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITeamInvitation extends Document {
  userId: string        // Inviter's Clerk ID
  teammateId: string    // Invited Teammate ID
  createdAt: Date
}

const TeamInvitationSchema = new Schema<ITeamInvitation>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    teammateId: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
)

// Ensure compound uniqueness index
TeamInvitationSchema.index({ userId: 1, teammateId: 1 }, { unique: true })

const TeamInvitation: Model<ITeamInvitation> =
  (mongoose.models.TeamInvitation as Model<ITeamInvitation>) ||
  mongoose.model<ITeamInvitation>('TeamInvitation', TeamInvitationSchema)

export default TeamInvitation
