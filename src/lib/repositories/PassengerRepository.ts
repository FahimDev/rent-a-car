import { BaseRepository } from './BaseRepository'
import { Passenger } from '@/types'

/**
 * Passenger Repository
 * Handles all passenger-related database operations
 */
export class PassengerRepository extends BaseRepository {
  /**
   * Create a new passenger
   */
  async create(passengerData: {
    phone: string
    name?: string
    email?: string
    isVerified?: boolean
  }): Promise<Passenger> {
    const sql = `
      INSERT INTO passengers (id, phone, name, email, isVerified, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `
    
    const id = crypto.randomUUID()
    const now = new Date()
    
    await this.insert(sql, [
      id,
      passengerData.phone,
      passengerData.name || null,
      passengerData.email || null,
      passengerData.isVerified || false,
      now.toISOString(),
      now.toISOString()
    ])

    return this.findById(id) as Promise<Passenger>
  }

  /**
   * Find passenger by ID
   */
  async findById(id: string): Promise<Passenger | null> {
    const sql = 'SELECT * FROM passengers WHERE id = $1'
    const results = await this.select(sql, [id])
    
    if (results.length === 0) {
      return null
    }

    return this.mapPassengerResult(results[0])
  }

  /**
   * Find passenger by phone number
   */
  async findByPhone(phone: string): Promise<Passenger | null> {
    const sql = 'SELECT * FROM passengers WHERE phone = $1'
    const results = await this.select(sql, [phone])
    
    if (results.length === 0) {
      return null
    }

    return this.mapPassengerResult(results[0])
  }

  /**
   * Find all passengers with pagination
   */
  async findAll(options: {
    page?: number
    limit?: number
    isVerified?: boolean
  } = {}): Promise<{ passengers: Passenger[], total: number }> {
    const { page = 1, limit = 10, isVerified } = options
    const offset = (page - 1) * limit

    let whereClause = ''
    let params: any[] = []

    if (isVerified !== undefined) {
      whereClause = 'WHERE isVerified = $1'
      params.push(isVerified)
    }

    const sql = `
      SELECT * FROM passengers
      ${whereClause}
      ORDER BY createdAt DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

    const countSql = `
      SELECT COUNT(*) as total
      FROM passengers
      ${whereClause}
    `

    const [passengers, countResult] = await Promise.all([
      this.select(sql, [...params, limit, offset]),
      this.select(countSql, params)
    ])

    const total = countResult[0]?.total || 0

    return {
      passengers: passengers.map(passenger => this.mapPassengerResult(passenger)),
      total
    }
  }

  /**
   * Update passenger information
   */
  async updatePassenger(id: string, updateData: {
    name?: string
    email?: string
    isVerified?: boolean
  }): Promise<boolean> {
    const fields = []
    const values = []
    let paramIndex = 1

    if (updateData.name !== undefined) {
      fields.push(`name = $${paramIndex}`)
      values.push(updateData.name)
      paramIndex++
    }
    if (updateData.email !== undefined) {
      fields.push(`email = $${paramIndex}`)
      values.push(updateData.email)
      paramIndex++
    }
    if (updateData.isVerified !== undefined) {
      fields.push(`isVerified = $${paramIndex}`)
      values.push(updateData.isVerified)
      paramIndex++
    }

    if (fields.length === 0) {
      return false
    }

    fields.push(`updatedAt = $${paramIndex}`)
    values.push(new Date().toISOString())
    paramIndex++
    
    values.push(id)

    const sql = `UPDATE passengers SET ${fields.join(', ')} WHERE id = $${paramIndex}`
    const affectedRows = await this.update(sql, values)
    return affectedRows > 0
  }

  /**
   * Update passenger verification status
   */
  async updateVerificationStatus(phone: string, isVerified: boolean): Promise<boolean> {
    const sql = `
      UPDATE passengers 
      SET isVerified = $1, updatedAt = $2
      WHERE phone = $3
    `
    
    const affectedRows = await this.update(sql, [isVerified, new Date().toISOString(), phone])
    return affectedRows > 0
  }

  /**
   * Delete passenger
   */
  async deletePassenger(id: string): Promise<boolean> {
    const sql = 'DELETE FROM passengers WHERE id = $1'
    const affectedRows = await this.delete(sql, [id])
    return affectedRows > 0
  }

  /**
   * Check if passenger exists by phone
   */
  async existsByPhone(phone: string): Promise<boolean> {
    const sql = 'SELECT 1 FROM passengers WHERE phone = $1 LIMIT 1'
    const results = await this.select(sql, [phone])
    return results.length > 0
  }

  /**
   * Get passenger statistics
   */
  async getStats(): Promise<{
    total: number
    verified: number
    unverified: number
  }> {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN isVerified = 1 THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN isVerified = 0 THEN 1 ELSE 0 END) as unverified
      FROM passengers
    `
    
    const results = await this.select(sql)
    const stats = results[0]

    return {
      total: stats.total || 0,
      verified: stats.verified || 0,
      unverified: stats.unverified || 0
    }
  }

  /**
   * Map database result to Passenger object
   */
  private mapPassengerResult(row: any): Passenger {
    return {
      id: row.id,
      phone: row.phone,
      name: row.name,
      email: row.email,
      isVerified: Boolean(row.isVerified),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }
  }
}
