import { BaseRepository } from './BaseRepository'
import { Admin } from '@/types'

export class AdminRepository extends BaseRepository {
  /**
   * Find admin by username
   */
  async findByUsername(username: string): Promise<Admin | null> {
    const sql = `
      SELECT id, username, email, password, phone, role, createdAt, updatedAt
      FROM admins 
      WHERE username = $1
    `
    
    const results = await this.select(sql, [username])
    
    if (results.length === 0) {
      return null
    }

    return this.mapAdminResult(results[0])
  }

  /**
   * Find admin by ID
   */
  async findById(id: string): Promise<Admin | null> {
    const sql = `
      SELECT id, username, email, password, phone, role, createdAt, updatedAt
      FROM admins 
      WHERE id = $1
    `
    
    const results = await this.select(sql, [id])
    
    if (results.length === 0) {
      return null
    }

    return this.mapAdminResult(results[0])
  }

  /**
   * Find admin with password for authentication
   */
  async findByUsernameWithPassword(username: string): Promise<{ id: string; username: string; password: string; role: string } | null> {
    const sql = `
      SELECT id, username, password, role
      FROM admins 
      WHERE username = $1
    `
    
    const results = await this.select(sql, [username])
    
    if (results.length === 0) {
      return null
    }

    return results[0]
  }

  /**
   * Update admin last login time
   */
  async updateLastLogin(id: string): Promise<boolean> {
    const sql = `
      UPDATE admins 
      SET updatedAt = $1
      WHERE id = $2
    `
    
    const affectedRows = await this.update(sql, [new Date().toISOString(), id])
    return affectedRows > 0
  }

  /**
   * Map database result to Admin object
   */
  private mapAdminResult(row: any): Admin {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      phone: row.phone,
      role: row.role,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }
  }
}
