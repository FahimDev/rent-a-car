import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

// Global instance for non-Edge runtime
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// For Edge runtime, we need to use D1 adapter
export function createPrismaClient(d1Database: D1Database) {
  const adapter = new PrismaD1(d1Database)
  return new PrismaClient({ adapter })
}
