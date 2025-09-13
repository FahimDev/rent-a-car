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
    adminId?: string
  }): Promise<string> {
    // Validate vehicle data
    this.validateVehicleData(vehicleData)

    return this.vehicleRepository.createVehicle(vehicleData)
  }

  /**
   * Update vehicle availability (admin only)
   */
  async updateVehicleAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    if (!id || id.trim() === '') {
      throw new Error('Vehicle ID is required')
    }

    return this.vehicleRepository.updateVehicleAvailability(id, isAvailable)
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
}
