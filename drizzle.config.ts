import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

// Carrega variáveis de ambiente do .env.local
dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
})
