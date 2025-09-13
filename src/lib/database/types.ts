/**
 * Database provider types and interfaces
 */

import type { D1Database } from '@cloudflare/workers-types'

// export interface DatabaseConfig {
//   // For REST API (Development)
//   accountId?: string
//   apiToken?: string
//   databaseId?: string

//   // For Production binding
//   binding?: D1Database

//   // Optional for other DB types
//   connectionString?: string
//   region?: string
// }

export interface DatabaseConfig {
  accountId?: string
  apiToken?: string
  databaseId?: string
  connectionString?: string
  region?: string
  binding?: D1Database
}

export interface QueryResult {
  success: boolean
  data?: any[]
  error?: string
  meta?: {
    changes?: number
    last_row_id?: number
    duration?: number
  }
}

export interface DatabaseProvider {
  query(sql: string, params?: any[]): Promise<QueryResult>
  close?(): Promise<void>
}
