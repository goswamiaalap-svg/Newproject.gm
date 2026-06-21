// =============================================================================
// MongoDB Connection Utility (Mongoose)
// Uses connection caching to avoid creating a new connection on every
// API route invocation in serverless/Next.js environments.
//
// MONGODB_URI check is deferred to call time (not module import) so that
// Next.js can build/compile this module without env vars set.
// =============================================================================

import mongoose from 'mongoose'

// Use a cached connection to prevent re-connecting on every hot-reload in dev
// or every invocation in serverless environments.
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Extend the global object to hold the mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }
global.mongooseCache = cached

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Validate env var at call time (not module import time)
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env')
  }

  // If we already have a connection, reuse it
  if (cached.conn) {
    return cached.conn
  }

  // If no pending connection, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    // Reset the promise so the next call retries
    cached.promise = null
    throw e
  }

  return cached.conn
}

