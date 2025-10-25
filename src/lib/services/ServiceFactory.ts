import { VehicleService } from './VehicleService'
import { BookingService } from './BookingService'
import { PassengerService } from './PassengerService'
import { AdminService } from './AdminService'
import { AdminStatsService } from './AdminStatsService'
import { WhatsAppNotificationService } from './WhatsAppNotificationService'
import { TelegramNotificationService } from './TelegramNotificationService'
import { UnifiedNotificationService } from './UnifiedNotificationService'
import { NotificationConfigService } from './NotificationConfigService'
import { VehicleRepository } from '../repositories/VehicleRepository'
import { BookingRepository } from '../repositories/BookingRepository'
import { PassengerRepository } from '../repositories/PassengerRepository'
import { AdminRepository } from '../repositories/AdminRepository'
import { DatabaseFactory } from '../database/DatabaseFactory'

/**
 * Service Factory
 * Creates service instances with their dependencies
 */
export class ServiceFactory {
  private static vehicleService: VehicleService | null = null
  private static bookingService: BookingService | null = null
  private static passengerService: PassengerService | null = null
  private static adminService: AdminService | null = null
  private static adminStatsService: AdminStatsService | null = null
  private static whatsappNotificationService: WhatsAppNotificationService | null = null
  private static telegramNotificationService: TelegramNotificationService | null = null
  private static unifiedNotificationService: UnifiedNotificationService | null = null
  private static notificationConfigService: NotificationConfigService | null = null

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
      const bookingRepository = new BookingRepository(database)
      this.passengerService = new PassengerService(passengerRepository, bookingRepository)
    }
    return this.passengerService
  }

  /**
   * Get admin service instance (singleton)
   */
  static getAdminService(): AdminService {
    if (!this.adminService) {
      const database = DatabaseFactory.getDefaultProvider()
      const adminRepository = new AdminRepository(database)
      this.adminService = new AdminService(adminRepository)
    }
    return this.adminService
  }

  /**
   * Get admin stats service instance (singleton)
   */
  static getAdminStatsService(): AdminStatsService {
    if (!this.adminStatsService) {
      this.adminStatsService = new AdminStatsService()
    }
    return this.adminStatsService
  }

  /**
   * Get WhatsApp notification service instance (singleton)
   */
  static getWhatsAppNotificationService(): WhatsAppNotificationService {
    if (!this.whatsappNotificationService) {
      this.whatsappNotificationService = new WhatsAppNotificationService()
    }
    return this.whatsappNotificationService
  }

  /**
   * Get Telegram notification service instance (singleton)
   */
  static getTelegramNotificationService(): TelegramNotificationService {
    if (!this.telegramNotificationService) {
      const config = this.getNotificationConfigService().getTelegramConfig()
      this.telegramNotificationService = new TelegramNotificationService(
        config.botToken,
        config.chatId
      )
    }
    return this.telegramNotificationService
  }

  /**
   * Get unified notification service instance (singleton)
   */
  static getUnifiedNotificationService(): UnifiedNotificationService {
    if (!this.unifiedNotificationService) {
      this.unifiedNotificationService = new UnifiedNotificationService()
    }
    return this.unifiedNotificationService
  }

  /**
   * Get notification configuration service instance (singleton)
   */
  static getNotificationConfigService(): NotificationConfigService {
    if (!this.notificationConfigService) {
      this.notificationConfigService = NotificationConfigService.getInstance()
    }
    return this.notificationConfigService
  }

  /**
   * Reset services (useful for testing)
   */
  static reset(): void {
    this.vehicleService = null
    this.bookingService = null
    this.passengerService = null
    this.adminService = null
    this.adminStatsService = null
    this.whatsappNotificationService = null
    this.telegramNotificationService = null
    this.unifiedNotificationService = null
    this.notificationConfigService = null
  }
}
