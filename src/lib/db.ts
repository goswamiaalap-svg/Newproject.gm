import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Deprecated mock exports to keep compatibility for now
export const mongodb = {
  connect: async () => console.log('MongoDB placeholder replaced by Prisma SQLite'),
}
export const postgres = {
  connect: async () => console.log('Postgres placeholder replaced by Prisma SQLite'),
}
