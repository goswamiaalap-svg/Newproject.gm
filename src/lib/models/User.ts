// =============================================================================
// Mongoose User Model
// Stores user data synced from Clerk via webhook on user.created event.
// Fields: clerkId (primary key link), name, email, createdAt
// =============================================================================

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  clerkId: string    // Clerk's unique user ID — used to link all queries
  name: string
  email: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,        // One MongoDB document per Clerk user
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // auto-manages createdAt
  }
)

// Prevent model re-compilation in Next.js hot-reload (common serverless pattern)
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema)

export default User
