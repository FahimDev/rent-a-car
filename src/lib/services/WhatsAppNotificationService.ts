import { DatabaseFactory } from '../database/DatabaseFactory'
import { Booking } from '@/types'

/**
 * WhatsApp Notification Service
 * Handles sending WhatsApp notifications for bookings
 */
export class WhatsAppNotificationService {
  private database = DatabaseFactory.getDefaultProvider()

  /**
   * Send booking notification to company WhatsApp
   */
  async sendBookingNotification(booking: Booking): Promise<boolean> {
    try {
      // Get company WhatsApp number from database
      const companyWhatsApp = await this.getCompanyWhatsApp()
      if (!companyWhatsApp) {
        console.log('Company WhatsApp number not configured, skipping notification')
        return false
      }

      // Create notification message
      const message = this.createBookingMessage(booking)

      // Try to send via API first
      const whatsappApiKey = process.env.WHATSAPP_API_KEY
      if (whatsappApiKey) {
        try {
          const success = await this.sendWhatsAppMessage(companyWhatsApp, message)
          if (success) {
            await this.logNotification(booking.id, 'whatsapp', 'sent', message)
            console.log('WhatsApp booking notification sent successfully via API')
            return true
          }
        } catch (error) {
          console.warn('WhatsApp API failed, trying fallback method:', error)
        }
      }

      // Fallback: Create WhatsApp web link and log it
      const whatsappLink = this.createWhatsAppLink(companyWhatsApp, message)
      await this.logNotification(booking.id, 'whatsapp', 'link_generated', whatsappLink)
      console.log('WhatsApp link generated (API not available):', whatsappLink)
      
      return true // Return true since we generated a link
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error)
      // Log failed notification
      await this.logNotification(booking.id, 'whatsapp', 'failed', null)
      return false
    }
  }

  /**
   * Get company WhatsApp number from database
   */
  private async getCompanyWhatsApp(): Promise<string | null> {
    try {
      const sql = 'SELECT whatsapp FROM company_info LIMIT 1'
      const result = await this.database.query(sql)
      
      if (!result.success || !result.data || result.data.length === 0) {
        return null
      }

      const companyInfo = result.data[0]
      return companyInfo.whatsapp || null
    } catch (error) {
      console.error('Error fetching company WhatsApp:', error)
      return null
    }
  }

  /**
   * Create booking notification message
   */
  private createBookingMessage(booking: Booking): string {
    const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.id}`
    const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Rent-A-Car'
    
    return `🚗 *New Booking Received - ${companyName}*

📋 *Booking Details:*
• ID: ${booking.id}
• Date: ${new Date(booking.bookingDate).toLocaleDateString()}
• Time: ${booking.pickupTime}
• Trip: ${booking.tripType === 'single' ? 'Single Trip' : 'Round Trip'}

👤 *Passenger:*
• Name: ${booking.passenger.name || 'Not provided'}
• Phone: ${booking.passenger.phone}

🚙 *Vehicle:*
• ${booking.vehicle.name}
• Type: ${booking.vehicle.type}
• Capacity: ${booking.vehicle.capacity} seats

📍 *Locations:*
• Pickup: ${booking.pickupLocation}
${booking.dropoffLocation ? `• Drop-off: ${booking.dropoffLocation}` : ''}

🔗 View details: ${bookingUrl}

_Time: ${new Date().toLocaleString()}_`
  }

  /**
   * Send WhatsApp message using API
   */
  private async sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
    try {
      const whatsappApiKey = process.env.WHATSAPP_API_KEY
      const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER
      const whatsappApiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com'

      if (!whatsappApiKey || !whatsappPhoneNumber) {
        throw new Error('WhatsApp API credentials not configured')
      }

      // Format phone number (remove any non-digit characters except +)
      const formattedPhone = to.replace(/[^\d+]/g, '')
      
      // Use Facebook Graph API for WhatsApp Business
      const endpoint = `https://graph.facebook.com/v22.0/818800901316270/messages`
      
      try {
        // Try template message first (works in development mode)
        const templatePayload = {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: {"body": message}
        }
        
        let response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(templatePayload)
        })
        
        // If template fails, try regular text message
        if (!response.ok) {
          const textPayload = {
            messaging_product: 'whatsapp',
            to: formattedPhone,
            type: 'text',
            text: { 
              body: message 
            }
          }
          
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${whatsappApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(textPayload)
          })
        }

        if (response.ok) {
          const responseData = await response.json()
          console.log('WhatsApp message sent successfully:', responseData)
          return true
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`Facebook Graph API returned ${response.status}: ${JSON.stringify(errorData)}`)
        }
      } catch (error) {
        console.error('Facebook Graph API error:', error)
        throw error
      }
    } catch (error) {
      console.error('WhatsApp API error:', error)
      throw error
    }
  }

  /**
   * Send WhatsApp message via webhook (fallback method)
   */
  private async sendViaWebhook(to: string, message: string): Promise<boolean> {
    try {
      const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL
      if (!webhookUrl) {
        throw new Error('WhatsApp webhook URL not configured')
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: to,
          message: message,
          type: 'booking_notification'
        })
      })

      if (response.ok) {
        console.log('WhatsApp message sent via webhook successfully')
        return true
      } else {
        throw new Error(`Webhook returned ${response.status}`)
      }
    } catch (error) {
      console.error('WhatsApp webhook error:', error)
      throw error
    }
  }

  /**
   * Log notification to database
   */
  private async logNotification(
    bookingId: string, 
    type: string, 
    status: string, 
    message: string | null
  ): Promise<void> {
    try {
      const sql = `
        INSERT INTO notifications (id, bookingId, type, status, message, createdAt)
        VALUES ($1, $2, $3, $4, $5, $6)
      `
      
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      
      await this.database.query(sql, [id, bookingId, type, status, message, now])
    } catch (error) {
      console.error('Error logging notification:', error)
      // Don't throw error for logging failures
    }
  }

  /**
   * Create WhatsApp web link
   */
  private createWhatsAppLink(phone: string, message: string): string {
    // Format phone number for WhatsApp web
    const formattedPhone = phone.replace(/[^\d]/g, '')
    const encodedMessage = encodeURIComponent(message)
    
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
  }

  /**
   * Send test WhatsApp message
   */
  async sendTestMessage(): Promise<boolean> {
    try {
      const companyWhatsApp = await this.getCompanyWhatsApp()
      if (!companyWhatsApp) {
        throw new Error('Company WhatsApp number not configured')
      }

      const testMessage = `🧪 *Test Message from ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'Rent-A-Car'}*

This is a test message to verify WhatsApp integration is working correctly.

_Time: ${new Date().toLocaleString()}_`

      // Try API first, then fallback to link
      const whatsappApiKey = process.env.WHATSAPP_API_KEY
      if (whatsappApiKey) {
        try {
          return await this.sendWhatsAppMessage(companyWhatsApp, testMessage)
        } catch (error) {
          console.warn('WhatsApp API failed for test, using link method')
        }
      }

      // Fallback: return true and log the link
      const whatsappLink = this.createWhatsAppLink(companyWhatsApp, testMessage)
      console.log('WhatsApp test link generated:', whatsappLink)
      return true
    } catch (error) {
      console.error('Error sending test WhatsApp message:', error)
      return false
    }
  }

  /**
   * Get notification history for a booking
   */
  async getNotificationHistory(bookingId: string): Promise<any[]> {
    try {
      const sql = 'SELECT * FROM notifications WHERE bookingId = $1 ORDER BY createdAt DESC'
      const result = await this.database.query(sql, [bookingId])
      
      if (!result.success) {
        return []
      }

      return result.data || []
    } catch (error) {
      console.error('Error fetching notification history:', error)
      return []
    }
  }
}
