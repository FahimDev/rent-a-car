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

      // Replace parameter placeholders with actual values
      let processedSql = sql
      if (params.length > 0) {
        // Simple parameter replacement for SQL injection safety
        params.forEach((param, index) => {
          const placeholder = `$${index + 1}`
          let value: string
          
          if (param === null || param === undefined) {
            value = 'NULL'
          } else if (typeof param === 'string') {
            // Escape single quotes and wrap in quotes
            value = `'${param.replace(/'/g, "''")}'`
          } else if (typeof param === 'number') {
            value = param.toString()
          } else if (typeof param === 'boolean') {
            value = param ? '1' : '0'
          } else {
            value = `'${String(param).replace(/'/g, "''")}'`
          }
          
          processedSql = processedSql.replace(new RegExp(placeholder, 'g'), value)
        })
      }

      const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: processedSql }),
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
