import { DatabaseProvider, QueryResult } from '../database/types'

/**
 * Base Repository
 * Provides common database operations for all repositories
 */
export abstract class BaseRepository {
  protected db: DatabaseProvider

  constructor(database: DatabaseProvider) {
    this.db = database
  }

  /**
   * Execute a raw SQL query
   */
  protected async executeQuery(sql: string, params: any[] = []): Promise<QueryResult> {
    return this.db.query(sql, params)
  }

  /**
   * Execute a SELECT query and return results
   */
  protected async select(sql: string, params: any[] = []): Promise<any[]> {
    const result = await this.executeQuery(sql, params)
    
    if (!result.success) {
      throw new Error(result.error || 'Query failed')
    }
    
    return result.data || []
  }

  /**
   * Execute an INSERT query and return the last inserted ID
   */
  protected async insert(sql: string, params: any[] = []): Promise<number> {
    const result = await this.executeQuery(sql, params)
    
    if (!result.success) {
      throw new Error(result.error || 'Insert failed')
    }
    
    return result.meta?.last_row_id || 0
  }

  /**
   * Execute an UPDATE query and return the number of affected rows
   */
  protected async update(sql: string, params: any[] = []): Promise<number> {
    const result = await this.executeQuery(sql, params)
    
    if (!result.success) {
      throw new Error(result.error || 'Update failed')
    }
    
    return result.meta?.changes || 0
  }

  /**
   * Execute a DELETE query and return the number of affected rows
   */
  protected async delete(sql: string, params: any[] = []): Promise<number> {
    const result = await this.executeQuery(sql, params)
    
    if (!result.success) {
      throw new Error(result.error || 'Delete failed')
    }
    
    return result.meta?.changes || 0
  }
}
