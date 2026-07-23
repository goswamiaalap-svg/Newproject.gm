import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IWeeklyCheckin extends Document {
  userId: string
  hitGoal: string // 'Yes' | 'Partially' | 'No' | 'Dismissed'
  obstacle?: string
  dismissed: boolean
  timestamp: Date
}

const WeeklyCheckinSchema = new Schema<IWeeklyCheckin>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    hitGoal: {
      type: String,
      required: false,
    },
    obstacle: {
      type: String,
      required: false,
    },
    dismissed: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'weeklyCheckins',
    timestamps: false,
  }
)

const WeeklyCheckin: Model<IWeeklyCheckin> =
  (mongoose.models.WeeklyCheckin as Model<IWeeklyCheckin>) ||
  mongoose.model<IWeeklyCheckin>('WeeklyCheckin', WeeklyCheckinSchema)

export default WeeklyCheckin
