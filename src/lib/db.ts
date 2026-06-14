// Prisma disconnected for Vercel deployment (serverless doesn't support SQLite writes)
// API routes have been updated to serve static mock data.
export const prisma = {} as any;
export const mongodb = { connect: async () => {} };
export const postgres = { connect: async () => {} };
