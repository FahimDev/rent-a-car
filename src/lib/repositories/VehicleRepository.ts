import { BaseRepository } from './BaseRepository'
import { Vehicle, VehiclePhoto } from '@/types'

/**
 * Vehicle Repository
 * Handles all vehicle-related database operations
 */
export class VehicleRepository extends BaseRepository {
  /**
   * Get all available vehicles with optional type filter
   */
  async getAvailableVehicles(type?: string): Promise<Vehicle[]> {
    let sql = `
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.isAvailable = 1
    `
    
    const params: any[] = []
    
    if (type) {
      sql += ' AND v.type = $1'
      params.push(type)
    }
    
    sql += `
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `

    const rows = await this.select(sql, params)
    return this.mapRowsToVehicles(rows)
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(id: string): Promise<Vehicle | null> {
    const sql = `
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.id = $1
      GROUP BY v.id
    `

    const rows = await this.select(sql, [id])
    return rows.length > 0 ? this.mapRowToVehicle(rows[0]) : null
  }

  /**
   * Get total vehicle count
   */
  async getVehicleCount(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM vehicles'
    const rows = await this.select(sql)
    return rows[0]?.count || 0
  }

  /**
   * Get vehicles by admin ID
   */
  async getVehiclesByAdmin(adminId: string): Promise<Vehicle[]> {
    const sql = `
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.adminId = $1
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `

    const rows = await this.select(sql, [adminId])
    return this.mapRowsToVehicles(rows)
  }

  /**
   * Create a new vehicle
   */
  async createVehicle(vehicleData: {
    name: string
    type: string
    capacity: number
    pricePerDay: number
    description?: string
    features?: string[]
    adminId?: string
  }): Promise<string> {
    const id = `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const sql = `
      INSERT INTO vehicles (id, name, type, capacity, pricePerDay, description, features, adminId, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, datetime('now'), datetime('now'))
    `
    
    const featuresJson = vehicleData.features ? JSON.stringify(vehicleData.features) : null
    
    await this.insert(sql, [
      id,
      vehicleData.name,
      vehicleData.type,
      vehicleData.capacity,
      vehicleData.pricePerDay,
      vehicleData.description || null,
      featuresJson,
      vehicleData.adminId || null
    ])

    return id
  }

  /**
   * Update vehicle availability
   */
  async updateVehicleAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    const sql = 'UPDATE vehicles SET isAvailable = $1, updatedAt = datetime("now") WHERE id = $2'
    const changes = await this.update(sql, [isAvailable ? 1 : 0, id])
    return changes > 0
  }

  /**
   * Map database rows to Vehicle objects
   */
  private mapRowsToVehicles(rows: any[]): Vehicle[] {
    return rows.map(row => this.mapRowToVehicle(row))
  }

  /**
   * Map single database row to Vehicle object
   */
  private mapRowToVehicle(row: any): Vehicle {
    const vehicle: Vehicle = {
      id: row.id,
      name: row.name,
      type: row.type as 'sedan' | 'noah' | 'hiace',
      capacity: row.capacity,
      pricePerDay: row.pricePerDay,
      description: row.description,
      features: row.features ? JSON.parse(row.features) : [],
      isAvailable: Boolean(row.isAvailable),
      adminId: row.adminId,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      photos: []
    }

    // Parse photos if they exist
    if (row.photos_json) {
      vehicle.photos = this.parsePhotos(row.photos_json)
    }

    return vehicle
  }

  /**
   * Parse vehicle photos from database JSON string
   */
  private parsePhotos(photosJson: string): VehiclePhoto[] {
    try {
      let photosData: any[] = []
      
      if (photosJson.includes('},{')) {
        // Multiple photos
        const photoStrings = photosJson.split('},{').map((str: string, index: number, array: string[]) => {
          if (index === 0) return str + '}'
          if (index === array.length - 1) return '{' + str
          return '{' + str + '}'
        })
        
        photosData = photoStrings.map((photoStr: string) => {
          try {
            return JSON.parse(photoStr)
          } catch (e) {
            return null
          }
        }).filter(Boolean)
      } else {
        // Single photo
        try {
          const photo = JSON.parse(photosJson)
          photosData = [photo]
        } catch (e) {
          // ignore
        }
      }
      
      // Convert to proper VehiclePhoto objects
      return photosData.map((photo: any) => ({
        id: photo.id,
        vehicleId: photo.vehicleId,
        url: photo.url,
        alt: photo.alt || '',
        isPrimary: Boolean(photo.isPrimary),
        order: photo.order || 0,
        createdAt: new Date(photo.createdAt || Date.now())
      }))
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((photo: any) => ({
          id: photo.id,
          vehicleId: photo.vehicleId || '',
          url: photo.url,
          alt: photo.alt,
          isPrimary: Boolean(photo.isPrimary),
          order: photo.order || 0,
          createdAt: new Date()
        }))
    } catch (error) {
      console.error('Error parsing photos:', error)
      return []
    }
  }

  /**
   * Get all vehicles (for admin)
   */
  async getAllVehicles(): Promise<Vehicle[]> {
    const sql = `
      SELECT v.*,
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order", 'createdAt', vp.createdAt)
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.id != 'pending-assignment'
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `
    const result = await this.select(sql, [])
    return this.mapRowsToVehicles(result)
  }

  /**
   * Add photo to vehicle
   */
  async addVehiclePhoto(vehicleId: string, photoData: {
    url: string
    alt: string
    order: number
    isPrimary: boolean
  }): Promise<any> {
    const sql = `
      INSERT INTO vehicle_photos (id, vehicleId, url, alt, isPrimary, "order", createdAt)
      VALUES ($1, $2, $3, $4, $5, $6, datetime("now"))
    `
    
    const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const result = await this.insert(sql, [
      photoId,
      vehicleId,
      photoData.url,
      photoData.alt,
      photoData.isPrimary ? 1 : 0,
      photoData.order
    ])
    
    return {
      id: photoId,
      vehicleId,
      url: photoData.url,
      alt: photoData.alt,
      isPrimary: photoData.isPrimary,
      order: photoData.order,
      createdAt: new Date()
    }
  }

  /**
   * Set primary photo for vehicle
   */
  async setPrimaryPhoto(vehicleId: string, photoId: string): Promise<boolean> {
    // First, unset all primary photos for this vehicle
    const unsetSql = 'UPDATE vehicle_photos SET isPrimary = 0 WHERE vehicleId = $1'
    await this.update(unsetSql, [vehicleId])
    
    // Then set the specified photo as primary
    const setSql = 'UPDATE vehicle_photos SET isPrimary = 1 WHERE id = $1 AND vehicleId = $2'
    const changes = await this.update(setSql, [photoId, vehicleId])
    return changes > 0
  }

  /**
   * Delete vehicle photo
   */
  async deleteVehiclePhoto(photoId: string): Promise<boolean> {
    const sql = 'DELETE FROM vehicle_photos WHERE id = $1'
    const changes = await this.delete(sql, [photoId])
    return changes > 0
  }

  /**
   * Update vehicle
   */
  async updateVehicle(id: string, updateData: {
    name: string
    type: string
    capacity: number
    pricePerDay: number
    description: string
    features: string[]
    isAvailable: boolean
  }): Promise<boolean> {
    const sql = `
      UPDATE vehicles 
      SET name = $1, type = $2, capacity = $3, pricePerDay = $4, 
          description = $5, features = $6, isAvailable = $7, 
          updatedAt = datetime("now")
      WHERE id = $8
    `
    
    const featuresJson = JSON.stringify(updateData.features)
    const changes = await this.update(sql, [
      updateData.name,
      updateData.type,
      updateData.capacity,
      updateData.pricePerDay,
      updateData.description,
      featuresJson,
      updateData.isAvailable ? 1 : 0,
      id
    ])
    
    return changes > 0
  }

  /**
   * Delete vehicle and all associated photos
   */
  async deleteVehicle(id: string): Promise<boolean> {
    // First delete all associated photos
    const deletePhotosSql = 'DELETE FROM vehicle_photos WHERE vehicleId = $1'
    await this.delete(deletePhotosSql, [id])
    
    // Then delete the vehicle
    const deleteVehicleSql = 'DELETE FROM vehicles WHERE id = $1'
    const changes = await this.delete(deleteVehicleSql, [id])
    return changes > 0
  }
}
