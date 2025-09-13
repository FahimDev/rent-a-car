import { apiGet, ApiResponse } from '@/lib/utils/api'
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
    const response = await apiGet<ApiResponse<{ vehicles: Vehicle[] }>>(endpoint)
    
    if (!response || !response.success) {
      return []
    }
    
    return response.data?.vehicles || []
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
    const response = await apiGet<ApiResponse<Vehicle>>(`/api/vehicles/${id}`)
    
    if (!response || !response.success) {
      return null
    }
    
    return response.data || null
  }
}
