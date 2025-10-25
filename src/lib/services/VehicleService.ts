import { VehicleRepository } from '../repositories/VehicleRepository'
import { Vehicle } from '@/types'

/**
 * Vehicle Service
 * Business logic layer for vehicle operations
 */
export class VehicleService {
  private vehicleRepository: VehicleRepository

  constructor(vehicleRepository: VehicleRepository) {
    this.vehicleRepository = vehicleRepository
  }

  /**
   * Get available vehicles for public display
   */
  async getAvailableVehicles(type?: string): Promise<Vehicle[]> {
    // Validate vehicle type if provided
    if (type && !this.isValidVehicleType(type)) {
      throw new Error(`Invalid vehicle type: ${type}`)
    }

    const vehicles = await this.vehicleRepository.getAvailableVehicles(type)
    
    // Apply business logic (sorting, filtering, etc.)
    return this.sortVehiclesByPriority(vehicles)
  }

  /**
   * Get vehicle by ID for public display
   */
  async getVehicleById(id: string): Promise<Vehicle | null> {
    if (!id || id.trim() === '') {
      throw new Error('Vehicle ID is required')
    }

    return this.vehicleRepository.getVehicleById(id)
  }

  /**
   * Get vehicle count for statistics
   */
  async getVehicleCount(): Promise<number> {
    return this.vehicleRepository.getVehicleCount()
  }

  /**
   * Get vehicles for admin management
   */
  async getVehiclesForAdmin(adminId: string): Promise<Vehicle[]> {
    return this.vehicleRepository.getVehiclesByAdmin(adminId)
  }

  /**
   * Create a new vehicle (admin only)
   */
  async createVehicle(vehicleData: {
    name: string
    type: string
    capacity: number
    pricePerDay: number
    description?: string
    features?: string[]
    isAvailable?: boolean
    adminId?: string
  }): Promise<Vehicle> {
    // Validate vehicle data
    this.validateVehicleData(vehicleData)

    // Create vehicle in repository
    const vehicleId = await this.vehicleRepository.createVehicle(vehicleData)
    
    // Return the complete vehicle object
    const vehicle = await this.vehicleRepository.getVehicleById(vehicleId)
    if (!vehicle) {
      throw new Error('Failed to create vehicle')
    }
    
    return vehicle
  }

  /**
   * Update vehicle availability (admin only)
   */
  async updateVehicleAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    if (!id || id.trim() === '') {
      throw new Error('Vehicle ID is required')
    }

    await this.vehicleRepository.updateVehicleAvailability(id, isAvailable)
    
    // Verify the update by fetching the vehicle
    const vehicle = await this.vehicleRepository.getVehicleById(id)
    return vehicle ? vehicle.isAvailable === isAvailable : false
  }

  /**
   * Validate vehicle type
   */
  private isValidVehicleType(type: string): boolean {
    const validTypes = ['sedan', 'noah', 'hiace']
    return validTypes.includes(type.toLowerCase())
  }

  /**
   * Validate vehicle data
   */
  private validateVehicleData(data: any): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Vehicle name is required')
    }
    
    if (!data.type || !this.isValidVehicleType(data.type)) {
      throw new Error('Valid vehicle type is required (sedan, noah, hiace)')
    }
    
    if (!data.capacity || data.capacity < 1) {
      throw new Error('Vehicle capacity must be at least 1')
    }
    
    if (!data.pricePerDay || data.pricePerDay < 0) {
      throw new Error('Price per day must be a positive number')
    }
  }

  /**
   * Sort vehicles by business priority
   */
  private sortVehiclesByPriority(vehicles: Vehicle[]): Vehicle[] {
    return vehicles.sort((a, b) => {
      // Vehicles with primary photos first
      const aHasPrimary = a.photos.some(photo => photo.isPrimary)
      const bHasPrimary = b.photos.some(photo => photo.isPrimary)
      
      if (aHasPrimary && !bHasPrimary) return -1
      if (!aHasPrimary && bHasPrimary) return 1
      
      // Then by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  /**
   * Get all vehicles (for admin)
   */
  async getAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepository.getAllVehicles()
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
    return this.vehicleRepository.addVehiclePhoto(vehicleId, photoData)
  }

  /**
   * Set primary photo for vehicle
   */
  async setPrimaryPhoto(vehicleId: string, photoId: string): Promise<boolean> {
    return this.vehicleRepository.setPrimaryPhoto(vehicleId, photoId)
  }

  /**
   * Delete vehicle photo
   */
  async deleteVehiclePhoto(photoId: string): Promise<boolean> {
    return this.vehicleRepository.deleteVehiclePhoto(photoId)
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
  }): Promise<Vehicle> {
    // Validate vehicle data
    this.validateVehicleData(updateData)

    // Update vehicle in repository
    await this.vehicleRepository.updateVehicle(id, updateData)

    // Return the updated vehicle to verify the update
    const vehicle = await this.vehicleRepository.getVehicleById(id)
    if (!vehicle) {
      throw new Error('Failed to fetch updated vehicle')
    }
    
    return vehicle
  }

  /**
   * Soft delete vehicle (recommended)
   */
  async softDeleteVehicle(id: string): Promise<boolean> {
    // Check if vehicle exists (including soft-deleted ones)
    const vehicle = await this.vehicleRepository.getVehicleById(id, true)
    if (!vehicle) {
      throw new Error('Vehicle not found')
    }

    // Check if already soft deleted
    if (vehicle.deletedAt) {
      throw new Error('Vehicle is already deleted')
    }

    // Soft delete vehicle from repository
    return await this.vehicleRepository.softDeleteVehicle(id)
  }

  /**
   * Hard delete vehicle (use with caution - only if no bookings exist)
   */
  async hardDeleteVehicle(id: string): Promise<boolean> {
    // Check if vehicle exists (including soft-deleted ones)
    const vehicle = await this.vehicleRepository.getVehicleById(id, true)
    if (!vehicle) {
      throw new Error('Vehicle not found')
    }

    // Hard delete vehicle from repository
    return await this.vehicleRepository.hardDeleteVehicle(id)
  }

  /**
   * Restore soft-deleted vehicle
   */
  async restoreVehicle(id: string): Promise<boolean> {
    return await this.vehicleRepository.restoreVehicle(id)
  }

  /**
   * Get vehicle by ID (including soft-deleted for booking records)
   */
  async getVehicleByIdForBooking(id: string): Promise<Vehicle | null> {
    if (!id || id.trim() === '') {
      throw new Error('Vehicle ID is required')
    }

    return this.vehicleRepository.getVehicleById(id, true) // includeDeleted = true
  }
}
