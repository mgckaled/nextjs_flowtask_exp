import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Create Neon client
const sql = neon(process.env.POSTGRES_URL!)

// Create Drizzle instance (singleton pattern for Next.js)
export const db = drizzle(sql, { schema })

// Export types for convenience
export type DB = typeof db
