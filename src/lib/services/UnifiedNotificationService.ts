import { Booking } from '@/types'
import { TelegramNotificationService } from './TelegramNotificationService'
import { WhatsAppNotificationService } from './WhatsAppNotificationService'
import { NotificationConfigService, NotificationMethod } from './NotificationConfigService'

/**
 * Unified Notification Service
 * Handles notifications via multiple channels (Telegram, WhatsApp)
 * Follows the strategy pattern for clean architecture
 */
export class UnifiedNotificationService {
  private telegramService: TelegramNotificationService | null = null
  private whatsappService: WhatsAppNotificationService | null = null
  private configService: NotificationConfigService

  constructor() {
    this.configService = NotificationConfigService.getInstance()
    this.initializeServices()
  }

  /**
   * Initialize notification services based on configuration
   */
  private initializeServices(): void {
    const config = this.configService.getConfig()

    // Initialize Telegram service if enabled
    if (config.telegram.enabled && config.telegram.botToken && config.telegram.chatId) {
      this.telegramService = new TelegramNotificationService(
        config.telegram.botToken,
        config.telegram.chatId
      )
    }

    // Initialize WhatsApp service if enabled
    if (config.whatsapp.enabled && config.whatsapp.apiUrl && config.whatsapp.accessToken) {
      this.whatsappService = new WhatsAppNotificationService(
        config.whatsapp.apiUrl,
        config.whatsapp.accessToken,
        config.whatsapp.phoneNumberId
      )
    }
  }

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmation(booking: Booking): Promise<NotificationResult> {
    const results: NotificationResult = {
      success: false,
      methods: [],
      errors: []
    }

    const activeMethods = this.getActiveMethodsForBookings()
    
    if (activeMethods.length === 0) {
      results.errors.push('No notification methods configured for bookings')
      return results
    }

    // Send via each active method
    for (const method of activeMethods) {
      try {
        const success = await this.sendViaMethod(method, 'booking', booking)
        if (success) {
          results.methods.push(method)
        } else {
          results.errors.push(`Failed to send via ${method}`)
        }
      } catch (error) {
        results.errors.push(`${method}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    results.success = results.methods.length > 0
    return results
  }

  /**
   * Send booking update notification
   */
  async sendBookingUpdate(booking: Booking, updateType: string): Promise<NotificationResult> {
    const results: NotificationResult = {
      success: false,
      methods: [],
      errors: []
    }

    const activeMethods = this.getActiveMethodsForUpdates()
    
    if (activeMethods.length === 0) {
      results.errors.push('No notification methods configured for updates')
      return results
    }

    // Send via each active method
    for (const method of activeMethods) {
      try {
        const success = await this.sendViaMethod(method, 'update', booking, updateType)
        if (success) {
          results.methods.push(method)
        } else {
          results.errors.push(`Failed to send update via ${method}`)
        }
      } catch (error) {
        results.errors.push(`${method}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    results.success = results.methods.length > 0
    return results
  }

  /**
   * Send test notification to verify configuration
   */
  async sendTestNotification(): Promise<NotificationResult> {
    const results: NotificationResult = {
      success: false,
      methods: [],
      errors: []
    }

    const activeMethods = this.configService.getActiveMethods()
    
    if (activeMethods.length === 0) {
      results.errors.push('No notification methods configured')
      return results
    }

    // Send test via each active method
    for (const method of activeMethods) {
      try {
        const success = await this.sendTestViaMethod(method)
        if (success) {
          results.methods.push(method)
        } else {
          results.errors.push(`Failed to send test via ${method}`)
        }
      } catch (error) {
        results.errors.push(`${method}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    results.success = results.methods.length > 0
    return results
  }

  /**
   * Send notification via specific method
   */
  private async sendViaMethod(
    method: NotificationMethod,
    type: 'booking' | 'update',
    booking: Booking,
    updateType?: string
  ): Promise<boolean> {
    switch (method) {
      case 'telegram':
        if (!this.telegramService) return false
        if (type === 'booking') {
          return await this.telegramService.sendBookingConfirmation(booking)
        } else {
          return await this.telegramService.sendBookingUpdate(booking, updateType || 'update')
        }
      
      case 'whatsapp':
        if (!this.whatsappService) return false
        if (type === 'booking') {
          return await this.whatsappService.sendBookingConfirmation(booking)
        } else {
          return await this.whatsappService.sendBookingUpdate(booking, updateType || 'update')
        }
      
      default:
        return false
    }
  }

  /**
   * Send test notification via specific method
   */
  private async sendTestViaMethod(method: NotificationMethod): Promise<boolean> {
    switch (method) {
      case 'telegram':
        if (!this.telegramService) return false
        return await this.telegramService.sendTestMessage()
      
      case 'whatsapp':
        if (!this.whatsappService) return false
        return await this.whatsappService.sendTestMessage()
      
      default:
        return false
    }
  }

  /**
   * Get active methods for booking notifications
   */
  private getActiveMethodsForBookings(): NotificationMethod[] {
    const config = this.configService.getConfig()
    const methods: NotificationMethod[] = []

    if (config.telegram.enabled && config.telegram.enabledForBookings) {
      methods.push('telegram')
    }

    if (config.whatsapp.enabled && config.whatsapp.enabledForBookings) {
      methods.push('whatsapp')
    }

    return methods
  }

  /**
   * Get active methods for update notifications
   */
  private getActiveMethodsForUpdates(): NotificationMethod[] {
    const config = this.configService.getConfig()
    const methods: NotificationMethod[] = []

    if (config.telegram.enabled && config.telegram.enabledForUpdates) {
      methods.push('telegram')
    }

    if (config.whatsapp.enabled && config.whatsapp.enabledForUpdates) {
      methods.push('whatsapp')
    }

    return methods
  }

  /**
   * Update notification configuration
   */
  updateConfiguration(newConfig: Partial<NotificationConfig>): void {
    this.configService.updateConfig(newConfig)
    this.initializeServices() // Reinitialize services with new config
  }

  /**
   * Get current configuration
   */
  getConfiguration() {
    return this.configService.getConfig()
  }

  /**
   * Validate notification configuration
   */
  async validateConfiguration(): Promise<ValidationResult> {
    const config = this.configService.getConfig()
    const result: ValidationResult = {
      telegram: { valid: false, error: null },
      whatsapp: { valid: false, error: null }
    }

    // Validate Telegram
    if (config.telegram.enabled) {
      try {
        const isValid = await TelegramNotificationService.validateConfiguration(
          config.telegram.botToken,
          config.telegram.chatId
        )
        result.telegram.valid = isValid
        if (!isValid) {
          result.telegram.error = 'Invalid bot token or chat ID'
        }
      } catch (error) {
        result.telegram.error = error instanceof Error ? error.message : 'Validation failed'
      }
    }

    // Validate WhatsApp
    if (config.whatsapp.enabled) {
      try {
        const isValid = await this.whatsappService?.sendTestMessage() || false
        result.whatsapp.valid = isValid
        if (!isValid) {
          result.whatsapp.error = 'Invalid API configuration'
        }
      } catch (error) {
        result.whatsapp.error = error instanceof Error ? error.message : 'Validation failed'
      }
    }

    return result
  }
}

export interface NotificationResult {
  success: boolean
  methods: NotificationMethod[]
  errors: string[]
}

export interface ValidationResult {
  telegram: { valid: boolean; error: string | null }
  whatsapp: { valid: boolean; error: string | null }
}
