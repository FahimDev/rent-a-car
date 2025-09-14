import { apiCall } from '@/lib/api/utils'
import { Vehicle } from '@/types'

/**
 * Vehicle API Service
 * Centralized service for all vehicle-related API calls
 */
export class VehicleApiService {
  /**
   * Get all available vehicles
   * @param type - Optional vehicle type filter
   * @returns Promise<Vehicle[]> Array of vehicles
   */
  static async getAvailableVehicles(type?: string): Promise<Vehicle[]> {
    const endpoint = type ? `/api/vehicles?type=${encodeURIComponent(type)}` : '/api/vehicles'
    const response = await apiCall<{ vehicles: Vehicle[] }>(endpoint)
    
    if (!response) {
      return []
    }
    
    return response.vehicles || []
  }

  /**
   * Get vehicles for landing page (limited to 3)
   * @returns Promise<Vehicle[]> Array of up to 3 vehicles
   */
  static async getVehiclesForLanding(): Promise<Vehicle[]> {
    const vehicles = await this.getAvailableVehicles()
    return vehicles.slice(0, 3)
  }

  /**
   * Get vehicle by ID
   * @param id - Vehicle ID
   * @returns Promise<Vehicle | null> Vehicle or null if not found
   */
  static async getVehicleById(id: string): Promise<Vehicle | null> {
    const response = await apiCall<Vehicle>(`/api/vehicles/${id}`)
    
    if (!response) {
      return null
    }
    
    return response || null
  }
}
