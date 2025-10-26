import { Booking } from '@/types'

/**
 * Telegram Notification Service
 * Handles sending booking notifications via Telegram Bot API
 */
export class TelegramNotificationService {
  private botToken: string
  private chatId: string

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken
    this.chatId = chatId
  }

  /**
   * Send booking confirmation notification via Telegram
   */
  async sendBookingConfirmation(booking: Booking): Promise<boolean> {
    try {
      const message = this.formatBookingMessage(booking)
      return await this.sendMessage(message)
    } catch (error) {
      console.error('Error sending Telegram notification:', error)
      return false
    }
  }

  /**
   * Send booking update notification via Telegram
   */
  async sendBookingUpdate(booking: Booking, updateType: string): Promise<boolean> {
    try {
      const message = this.formatBookingUpdateMessage(booking, updateType)
      return await this.sendMessage(message)
    } catch (error) {
      console.error('Error sending Telegram update notification:', error)
      return false
    }
  }

  /**
   * Send test message to verify Telegram configuration
   */
  async sendTestMessage(): Promise<boolean> {
    try {
      const message = '🚗 *Test Message from Rent-A-Car System*\n\nThis is a test notification to verify Telegram integration is working correctly.'
      return await this.sendMessage(message)
    } catch (error) {
      console.error('Error sending Telegram test message:', error)
      return false
    }
  }

  /**
   * Format booking information into Telegram message
   */
  private formatBookingMessage(booking: Booking): string {
    const { passenger, vehicle, bookingDate, pickupTime, tripType, pickupLocation, dropoffLocation } = booking

    return `🚗 *New Booking Confirmed*

📋 *Booking Details:*
• ID: \`${booking.id}\`
• Date: ${new Date(booking.createdAt).toLocaleDateString('en-BD')}

👤 *Passenger:*
• Name: ${passenger.name}
• Phone: ${passenger.phone}
• Email: ${passenger.email || 'Not provided'}

🚙 *Vehicle:*
• ${vehicle.name} (${vehicle.type.toUpperCase()})
• Capacity: ${vehicle.capacity} seats
• Price: ৳${vehicle.pricePerDay}/day

📅 *Trip Details:*
• Pickup: ${new Date(bookingDate).toLocaleDateString('en-BD')} at ${pickupTime}
• Location: ${pickupLocation}${dropoffLocation ? ` → ${dropoffLocation}` : ''}
• Trip Type: ${tripType === 'single' ? 'One-way' : 'Round trip'}

📞 *Contact:* ${passenger.phone}
⏰ *Booked at:* ${new Date(booking.createdAt).toLocaleString('en-BD')}`
  }

  /**
   * Format booking update message
   */
  private formatBookingUpdateMessage(booking: Booking, updateType: string): string {
    const baseMessage = this.formatBookingMessage(booking)
    const updateHeader = `🔄 *Booking ${updateType}*\n\n`
    return updateHeader + baseMessage
  }

  /**
   * Send message via Telegram Bot API
   */
  private async sendMessage(message: string): Promise<boolean> {
    try {
      // Check if bot token and chat ID are configured
      if (!this.botToken || this.botToken === 'your_bot_token_here') {
        console.error('Telegram bot token is not configured')
        return false
      }
      
      if (!this.chatId || this.chatId === 'your_chat_id_here') {
        console.error('Telegram chat ID is not configured')
        return false
      }

      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Telegram API error:', errorData)
        return false
      }

      const result = await response.json() as { ok?: boolean }
      return result.ok === true
    } catch (error) {
      console.error('Error sending Telegram message:', error)
      return false
    }
  }

  /**
   * Calculate trip duration in days
   */
  private calculateDuration(pickupDate: string, returnDate: string): number {
    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)
    const diffTime = returnD.getTime() - pickup.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  /**
   * Validate Telegram configuration
   */
  static async validateConfiguration(botToken: string, chatId: string): Promise<boolean> {
    try {
      // Check if configuration is provided
      if (!botToken || botToken === 'your_bot_token_here') {
        console.error('Telegram bot token is not configured')
        return false
      }
      
      if (!chatId || chatId === 'your_chat_id_here') {
        console.error('Telegram chat ID is not configured')
        return false
      }

      const url = `https://api.telegram.org/bot${botToken}/getMe`
      const response = await fetch(url)
      
      if (!response.ok) {
        console.error('Telegram API validation failed:', response.status, response.statusText)
        return false
      }

      const result = await response.json() as { ok?: boolean; description?: string }
      if (!result.ok) {
        console.error('Telegram bot validation failed:', result.description)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error validating Telegram configuration:', error)
      return false
    }
  }
}
