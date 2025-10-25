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
   * Update admin password
   */
  async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    const sql = `
      UPDATE admins 
      SET password = $1, updatedAt = $2
      WHERE id = $3
    `
    
    const affectedRows = await this.update(sql, [hashedPassword, new Date().toISOString(), id])
    return affectedRows > 0
  }

  /**
   * Create new admin
   */
  async create(adminData: {
    username: string
    password: string
    email?: string
    phone?: string
    role?: string
  }): Promise<Admin> {
    const sql = `
      INSERT INTO admins (id, username, password, email, phone, role, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `
    
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    await this.insert(sql, [
      id,
      adminData.username,
      adminData.password,
      adminData.email || null,
      adminData.phone || null,
      adminData.role || 'admin',
      now,
      now
    ])

    return this.mapAdminResult({
      id,
      username: adminData.username,
      email: adminData.email,
      phone: adminData.phone,
      role: adminData.role || 'admin',
      createdAt: now,
      updatedAt: now
    })
  }

  /**
   * Check if username exists
   */
  async usernameExists(username: string): Promise<boolean> {
    const sql = `
      SELECT COUNT(*) as count
      FROM admins 
      WHERE username = $1
    `
    
    const results = await this.select(sql, [username])
    return results[0]?.count > 0
  }

  /**
   * Get all admins
   */
  async getAll(): Promise<Admin[]> {
    const sql = `
      SELECT id, username, email, phone, role, createdAt, updatedAt
      FROM admins 
      ORDER BY createdAt DESC
    `
    
    const results = await this.select(sql, [])
    return results.map(row => this.mapAdminResult(row))
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
