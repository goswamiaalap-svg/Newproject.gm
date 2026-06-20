// =============================================================================
// Mongoose Resume Model
// One document per uploaded resume. Stores file metadata, extracted text,
// and the parsed Claude AI review result (added after review is complete).
// =============================================================================

import mongoose, { Schema, Document, Model } from 'mongoose'

// Shape of a single weakness item returned by Claude
export interface IWeakness {
  issue: string
  severity: 'high' | 'medium' | 'low'
  suggestion: string
}

// The parsed Claude review result stored inside the Resume document
export interface IReviewResult {
  overallScore: number           // 0–100 overall quality score
  atsScore: number               // 0–100 ATS compatibility
  quantifiedAchievements: number // 0–100 how well impact is quantified
  strengths: string[]            // List of strong points
  weaknesses: IWeakness[]        // List of improvement areas with severity
}

export interface IResume extends Document {
  userId: string           // Clerk user ID (matches User.clerkId)
  fileUrl: string          // Public URL of the file in Supabase Storage
  fileName: string         // Original file name for display
  extractedText: string    // Plain text extracted from PDF/DOCX
  uploadedAt: Date
  status: 'processing' | 'complete' | 'error'
  reviewResult?: IReviewResult  // Populated after Claude review completes
  errorMessage?: string         // Set if status === 'error'
}

const WeaknessSchema = new Schema<IWeakness>(
  {
    issue: { type: String, required: true },
    severity: { type: String, enum: ['high', 'medium', 'low'], required: true },
    suggestion: { type: String, required: true },
  },
  { _id: false }
)

const ReviewResultSchema = new Schema<IReviewResult>(
  {
    overallScore: { type: Number, required: true },
    atsScore: { type: Number, required: true },
    quantifiedAchievements: { type: Number, required: true },
    strengths: [{ type: String }],
    weaknesses: [WeaknessSchema],
  },
  { _id: false }
)

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Indexed for fast lookup by user
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['processing', 'complete', 'error'],
      default: 'processing',
    },
    reviewResult: {
      type: ReviewResultSchema,
      required: false,
    },
    errorMessage: {
      type: String,
      required: false,
    },
  },
  { timestamps: false }
)

// Prevent model re-compilation in Next.js hot-reload
const Resume: Model<IResume> =
  (mongoose.models.Resume as Model<IResume>) ||
  mongoose.model<IResume>('Resume', ResumeSchema)

export default Resume
