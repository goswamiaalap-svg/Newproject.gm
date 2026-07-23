import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUserEvent extends Document {
  userId: string
  eventType: string
  eventData: Record<string, any>
  timestamp: Date
}

const UserEventSchema = new Schema<IUserEvent>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    eventData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'userEvents',
    timestamps: false,
  }
)

const UserEvent: Model<IUserEvent> =
  (mongoose.models.UserEvent as Model<IUserEvent>) ||
  mongoose.model<IUserEvent>('UserEvent', UserEventSchema)

export default UserEvent
