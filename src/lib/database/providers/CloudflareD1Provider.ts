import { DatabaseProvider, DatabaseConfig, QueryResult } from '../types'

/**
 * Cloudflare D1 Database Provider
 * Handles communication with Cloudflare D1 via REST API
 */
export class CloudflareD1Provider implements DatabaseProvider {
  private config: DatabaseConfig

  constructor(config: DatabaseConfig) {
    this.config = config
  }

  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    try {
      const { accountId, apiToken, databaseId } = this.config

      if (!accountId || !apiToken || !databaseId) {
        return {
          success: false,
          error: 'Missing Cloudflare D1 credentials'
        }
      }

      // Convert $1, $2, $3 placeholders to ? placeholders for D1 API
      let processedSql = sql
      params.forEach((_, index) => {
        const placeholder = `$${index + 1}`
        processedSql = processedSql.replace(new RegExp(placeholder, 'g'), '?')
      })

      const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sql: processedSql,
          params: params
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: `D1 API Error: ${JSON.stringify(errorData)}`
        }
      }

      const data = await response.json() as any
      const rows = data.result?.[0]?.results || []

      return {
        success: true,
        data: rows,
        meta: {
          changes: data.result?.[0]?.changes || 0,
          last_row_id: data.result?.[0]?.last_row_id || 0,
          duration: data.result?.[0]?.duration || 0
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}
