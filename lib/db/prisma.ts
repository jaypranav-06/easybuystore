/**
 * SUPABASE DATABASE CONNECTION WITH PRISMA ORM
 *
 * This file sets up the connection between our Next.js app and Supabase PostgreSQL database.
 * We use Prisma ORM (Object-Relational Mapping) to interact with the database easily.
 *
 * Key Concepts for VIVA:
 * - Supabase: Cloud-hosted PostgreSQL database (like Firebase but for SQL databases)
 * - Prisma: Tool that lets us write database queries using JavaScript instead of raw SQL
 * - Connection Pooling: Reuses database connections instead of creating new ones (saves resources)
 */

import { PrismaClient } from '@prisma/client'

/**
 * GLOBAL PRISMA CLIENT STORAGE
 *
 * Why we do this:
 * - In development, Next.js hot-reloads code frequently
 * - Without this, we'd create a new database connection on every reload
 * - This would exhaust our database connection limit
 *
 * Solution: Store the Prisma client globally so it persists across reloads
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * CREATE OR REUSE PRISMA CLIENT
 *
 * This creates a single Prisma client instance that connects to Supabase.
 *
 * Configuration explained:
 * - log: In development, log all database queries for debugging
 *        In production, only log errors to save resources
 * - datasources.db.url: Connection string to Supabase (stored in .env file)
 *                        Format: postgresql://user:password@host:port/database
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Supabase connection string from environment variables
    },
  },
})

/**
 * SAVE CLIENT GLOBALLY
 *
 * Store the Prisma client in global scope so Next.js can reuse it.
 * This prevents creating multiple connections during development hot-reloads.
 */
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

/**
 * GRACEFUL SHUTDOWN HANDLER
 *
 * Important for production deployment on Vercel/Netlify:
 * - When the serverless function ends, properly close database connections
 * - Prevents "connection pool exhausted" errors
 * - Only runs on server (not in browser, hence the window check)
 *
 * Process events explained:
 * - beforeExit: Node.js is about to exit normally
 * - SIGINT: User pressed Ctrl+C
 * - SIGTERM: System is shutting down the process
 */
if (typeof window === 'undefined') {
  const cleanup = async () => {
    await prisma.$disconnect() // Close all database connections properly
  }

  process.on('beforeExit', cleanup)
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

// Export the Prisma client so other files can import and use it
export default prisma
