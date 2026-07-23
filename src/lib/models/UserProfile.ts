import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUserProfile extends Document {
  userId: string
  year: string
  goal: string
  hoursPerWeek: string
  onboardingCompleted: boolean
  onboardingDismissed: boolean
  createdAt: Date
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    year: {
      type: String,
      required: false,
    },
    goal: {
      type: String,
      required: false,
    },
    hoursPerWeek: {
      type: String,
      required: false,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingDismissed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'userProfiles',
    timestamps: false,
  }
)

const UserProfile: Model<IUserProfile> =
  (mongoose.models.UserProfile as Model<IUserProfile>) ||
  mongoose.model<IUserProfile>('UserProfile', UserProfileSchema)

export default UserProfile
