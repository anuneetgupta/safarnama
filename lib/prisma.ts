import { PrismaClient } from '@prisma/client'
import path from 'path'

// Force DATABASE_URL before Prisma initializes — works with Turbopack
const dbUrl = `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`
process.env.DATABASE_URL = process.env.DATABASE_URL || dbUrl

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ log: ['error'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
