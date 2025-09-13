/**
 * Database provider types and interfaces
 */

export interface DatabaseConfig {
  accountId?: string
  apiToken?: string
  databaseId?: string
  connectionString?: string
  region?: string
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
