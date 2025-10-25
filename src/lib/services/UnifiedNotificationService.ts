import { Booking } from '@/types'
import { TelegramNotificationService } from './TelegramNotificationService'
import { WhatsAppNotificationService } from './WhatsAppNotificationService'
import { NotificationConfigService, NotificationMethod, NotificationConfig } from './NotificationConfigService'

/**
 * Unified Notification Service
 * Handles notifications via multiple channels (Telegram, WhatsApp)
 * Follows the strategy pattern for clean architecture
 */
export class UnifiedNotificationService {
  private telegramService: TelegramNotificationService | null = null
  private whatsappService: WhatsAppNotificationService | null = null

  constructor() {
    this.initializeServices()
  }

  /**
   * Initialize notification services based on environment variables
   */
  private initializeServices(): void {
    // Initialize Telegram service from environment variables
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID
    
    if (telegramBotToken && telegramChatId && 
        telegramBotToken !== 'your_bot_token_here' && 
        telegramChatId !== 'your_chat_id_here') {
      this.telegramService = new TelegramNotificationService(telegramBotToken, telegramChatId)
    }

    // Initialize WhatsApp service from environment variables
    const whatsappApiKey = process.env.WHATSAPP_API_KEY
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    
    if (whatsappApiKey && whatsappPhoneNumberId) {
      this.whatsappService = new WhatsAppNotificationService()
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

    const activeMethods = this.getActiveMethodsForBookings()
    
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

    const activeMethods = this.getActiveMethodsForBookings()
    
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
          return await this.whatsappService.sendBookingNotification(booking)
        } else {
          return await this.whatsappService.sendBookingNotification(booking)
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
    const methods: NotificationMethod[] = []

    // Check if Telegram is configured via environment variables
    if (this.telegramService) {
      methods.push('telegram')
    }

    // Check if WhatsApp is configured via environment variables
    if (this.whatsappService) {
      methods.push('whatsapp')
    }

    return methods
  }

  /**
   * Get active methods for update notifications
   */



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
