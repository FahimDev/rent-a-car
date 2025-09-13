import { VehicleService } from './VehicleService'
import { VehicleRepository } from '../repositories/VehicleRepository'
import { DatabaseFactory } from '../database/DatabaseFactory'

/**
 * Service Factory
 * Creates service instances with their dependencies
 */
export class ServiceFactory {
  private static vehicleService: VehicleService | null = null

  /**
   * Get vehicle service instance (singleton)
   */
  static getVehicleService(): VehicleService {
    if (!this.vehicleService) {
      const database = DatabaseFactory.getDefaultProvider()
      const vehicleRepository = new VehicleRepository(database)
      this.vehicleService = new VehicleService(vehicleRepository)
    }
    return this.vehicleService
  }

  /**
   * Reset services (useful for testing)
   */
  static reset(): void {
    this.vehicleService = null
  }
}
