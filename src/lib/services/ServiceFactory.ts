import { VehicleService } from './VehicleService'
import { BookingService } from './BookingService'
import { PassengerService } from './PassengerService'
import { VehicleRepository } from '../repositories/VehicleRepository'
import { BookingRepository } from '../repositories/BookingRepository'
import { PassengerRepository } from '../repositories/PassengerRepository'
import { DatabaseFactory } from '../database/DatabaseFactory'

/**
 * Service Factory
 * Creates service instances with their dependencies
 */
export class ServiceFactory {
  private static vehicleService: VehicleService | null = null
  private static bookingService: BookingService | null = null
  private static passengerService: PassengerService | null = null

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
   * Get booking service instance (singleton)
   */
  static getBookingService(): BookingService {
    if (!this.bookingService) {
      const database = DatabaseFactory.getDefaultProvider()
      const bookingRepository = new BookingRepository(database)
      const passengerRepository = new PassengerRepository(database)
      const vehicleRepository = new VehicleRepository(database)
      this.bookingService = new BookingService(bookingRepository, passengerRepository, vehicleRepository)
    }
    return this.bookingService
  }

  /**
   * Get passenger service instance (singleton)
   */
  static getPassengerService(): PassengerService {
    if (!this.passengerService) {
      const database = DatabaseFactory.getDefaultProvider()
      const passengerRepository = new PassengerRepository(database)
      this.passengerService = new PassengerService(passengerRepository)
    }
    return this.passengerService
  }

  /**
   * Reset services (useful for testing)
   */
  static reset(): void {
    this.vehicleService = null
    this.bookingService = null
    this.passengerService = null
  }
}
