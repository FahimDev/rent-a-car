import { BaseRepository } from './BaseRepository'
import { Booking, Passenger } from '@/types'

/**
 * Booking Repository
 * Handles all booking-related database operations
 */
export class BookingRepository extends BaseRepository {
  /**
   * Create a new booking
   */
  async create(bookingData: {
    passengerId: string
    vehicleId: string
    bookingDate: Date
    pickupTime: string
    tripType: 'single' | 'round'
    pickupLocation: string
    dropoffLocation?: string
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    notes?: string
  }): Promise<Booking> {
    const sql = `
      INSERT INTO bookings (
        id, passengerId, vehicleId, bookingDate, pickupTime, tripType, 
        pickupLocation, dropoffLocation, status, notes, createdAt, updatedAt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `
    
    const id = crypto.randomUUID()
    const now = new Date()
    
    await this.insert(sql, [
      id,
      bookingData.passengerId,
      bookingData.vehicleId,
      bookingData.bookingDate.toISOString(),
      bookingData.pickupTime,
      bookingData.tripType,
      bookingData.pickupLocation,
      bookingData.dropoffLocation || null,
      bookingData.status,
      bookingData.notes || null,
      now.toISOString(),
      now.toISOString()
    ])

    return this.findById(id) as Promise<Booking>
  }

  /**
   * Find booking by ID
   */
  async findById(id: string): Promise<Booking | null> {
    const sql = `
      SELECT 
        b.*,
        p.id as passenger_id, p.phone as passenger_phone, p.name as passenger_name, 
        p.email as passenger_email, p.isVerified as passenger_isVerified,
        p.createdAt as passenger_createdAt, p.updatedAt as passenger_updatedAt,
        v.id as vehicle_id, v.name as vehicle_name, v.type as vehicle_type,
        v.capacity as vehicle_capacity, v.pricePerDay as vehicle_pricePerDay,
        v.description as vehicle_description, v.features as vehicle_features,
        v.isAvailable as vehicle_isAvailable, v.adminId as vehicle_adminId,
        v.createdAt as vehicle_createdAt, v.updatedAt as vehicle_updatedAt
      FROM bookings b
      LEFT JOIN passengers p ON b.passengerId = p.id
      LEFT JOIN vehicles v ON b.vehicleId = v.id
      WHERE b.id = $1
    `
    
    const results = await this.select(sql, [id])
    
    if (results.length === 0) {
      return null
    }

    return this.mapBookingResult(results[0])
  }

  /**
   * Find all bookings with pagination
   */
  async findAll(options: {
    status?: string
    page?: number
    limit?: number
  } = {}): Promise<{ bookings: Booking[], total: number }> {
    const { status, page = 1, limit = 10 } = options
    const offset = (page - 1) * limit

    let whereClause = ''
    let params: any[] = []

    if (status) {
      whereClause = 'WHERE b.status = $1'
      params.push(status)
    }

    const sql = `
      SELECT 
        b.*,
        p.id as passenger_id, p.phone as passenger_phone, p.name as passenger_name, 
        p.email as passenger_email, p.isVerified as passenger_isVerified,
        p.createdAt as passenger_createdAt, p.updatedAt as passenger_updatedAt,
        v.id as vehicle_id, v.name as vehicle_name, v.type as vehicle_type,
        v.capacity as vehicle_capacity, v.pricePerDay as vehicle_pricePerDay,
        v.description as vehicle_description, v.features as vehicle_features,
        v.isAvailable as vehicle_isAvailable, v.adminId as vehicle_adminId,
        v.createdAt as vehicle_createdAt, v.updatedAt as vehicle_updatedAt
      FROM bookings b
      LEFT JOIN passengers p ON b.passengerId = p.id
      LEFT JOIN vehicles v ON b.vehicleId = v.id
      ${whereClause}
      ORDER BY b.createdAt DESC
      LIMIT ? OFFSET ?
    `

    const countSql = `
      SELECT COUNT(*) as total
      FROM bookings b
      ${whereClause}
    `

    const [bookings, countResult] = await Promise.all([
      this.select(sql, [...params, limit, offset]),
      this.select(countSql, params)
    ])

    const total = countResult[0]?.total || 0

    return {
      bookings: bookings.map(booking => this.mapBookingResult(booking)),
      total
    }
  }

  /**
   * Find bookings by passenger ID
   */
  async findByPassengerId(passengerId: string): Promise<Booking[]> {
    const sql = `
      SELECT 
        b.*,
        p.id as passenger_id, p.phone as passenger_phone, p.name as passenger_name, 
        p.email as passenger_email, p.isVerified as passenger_isVerified,
        p.createdAt as passenger_createdAt, p.updatedAt as passenger_updatedAt,
        v.id as vehicle_id, v.name as vehicle_name, v.type as vehicle_type,
        v.capacity as vehicle_capacity, v.pricePerDay as vehicle_pricePerDay,
        v.description as vehicle_description, v.features as vehicle_features,
        v.isAvailable as vehicle_isAvailable, v.adminId as vehicle_adminId,
        v.createdAt as vehicle_createdAt, v.updatedAt as vehicle_updatedAt
      FROM bookings b
      LEFT JOIN passengers p ON b.passengerId = p.id
      LEFT JOIN vehicles v ON b.vehicleId = v.id
      WHERE b.passengerId = $1
      ORDER BY b.createdAt DESC
    `
    
    const results = await this.select(sql, [passengerId])
    return results.map(booking => this.mapBookingResult(booking))
  }

  /**
   * Update booking status
   */
  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): Promise<boolean> {
    const sql = `
      UPDATE bookings 
      SET status = $1, updatedAt = $2
      WHERE id = $3
    `
    
    const affectedRows = await this.update(sql, [status, new Date().toISOString(), id])
    return affectedRows > 0
  }

  /**
   * Update booking details
   */
  async updateBooking(id: string, updateData: {
    bookingDate?: Date
    pickupTime?: string
    tripType?: 'single' | 'round'
    pickupLocation?: string
    dropoffLocation?: string
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    notes?: string
  }): Promise<boolean> {
    const fields = []
    const values = []

    let paramIndex = 1

    if (updateData.bookingDate) {
      fields.push(`bookingDate = $${paramIndex}`)
      values.push(updateData.bookingDate.toISOString())
      paramIndex++
    }
    if (updateData.pickupTime) {
      fields.push(`pickupTime = $${paramIndex}`)
      values.push(updateData.pickupTime)
      paramIndex++
    }
    if (updateData.tripType) {
      fields.push(`tripType = $${paramIndex}`)
      values.push(updateData.tripType)
      paramIndex++
    }
    if (updateData.pickupLocation) {
      fields.push(`pickupLocation = $${paramIndex}`)
      values.push(updateData.pickupLocation)
      paramIndex++
    }
    if (updateData.dropoffLocation !== undefined) {
      fields.push(`dropoffLocation = $${paramIndex}`)
      values.push(updateData.dropoffLocation)
      paramIndex++
    }
    if (updateData.status) {
      fields.push(`status = $${paramIndex}`)
      values.push(updateData.status)
      paramIndex++
    }
    if (updateData.notes !== undefined) {
      fields.push(`notes = $${paramIndex}`)
      values.push(updateData.notes)
      paramIndex++
    }

    if (fields.length === 0) {
      return false
    }

    fields.push(`updatedAt = $${paramIndex}`)
    values.push(new Date().toISOString())
    paramIndex++
    values.push(id)

    const sql = `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${paramIndex}`
    const affectedRows = await this.update(sql, values)
    return affectedRows > 0
  }

  /**
   * Delete booking
   */
  async deleteBooking(id: string): Promise<boolean> {
    const sql = 'DELETE FROM bookings WHERE id = $1'
    const affectedRows = await this.delete(sql, [id])
    return affectedRows > 0
  }

  /**
   * Map database result to Booking object
   */
  private mapBookingResult(row: any): Booking {
    return {
      id: row.id,
      passengerId: row.passengerId,
      vehicleId: row.vehicleId,
      bookingDate: new Date(row.bookingDate),
      pickupTime: row.pickupTime,
      tripType: row.tripType,
      pickupLocation: row.pickupLocation,
      dropoffLocation: row.dropoffLocation,
      status: row.status,
      notes: row.notes,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      passenger: {
        id: row.passenger_id,
        phone: row.passenger_phone,
        name: row.passenger_name,
        email: row.passenger_email,
        isVerified: Boolean(row.passenger_isVerified),
        createdAt: new Date(row.passenger_createdAt),
        updatedAt: new Date(row.passenger_updatedAt)
      },
      vehicle: {
        id: row.vehicle_id,
        name: row.vehicle_name,
        type: row.vehicle_type,
        capacity: row.vehicle_capacity,
        pricePerDay: row.vehicle_pricePerDay,
        description: row.vehicle_description,
        features: row.vehicle_features ? JSON.parse(row.vehicle_features) : [],
        isAvailable: Boolean(row.vehicle_isAvailable),
        adminId: row.vehicle_adminId,
        createdAt: new Date(row.vehicle_createdAt),
        updatedAt: new Date(row.vehicle_updatedAt),
        photos: [] // Photos would need separate query
      }
    }
  }
}
