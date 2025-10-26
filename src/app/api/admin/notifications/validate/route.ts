import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'
import { TelegramNotificationService } from '@/lib/services/TelegramNotificationService'

export const runtime = 'edge'

/**
 * POST /api/admin/notifications/validate
 * Validate notification configuration
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Simple validation using existing methods
    const validation = {
      telegram: { valid: false, error: null as string | null },
      whatsapp: { valid: false, error: null as string | null }
    }

    // Validate Telegram
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID
    
    if (telegramBotToken && telegramChatId) {
      try {
        const isValid = await TelegramNotificationService.validateConfiguration(telegramBotToken, telegramChatId)
        validation.telegram.valid = isValid
        if (!isValid) {
          validation.telegram.error = 'Invalid Telegram configuration'
        }
      } catch (error) {
        validation.telegram.error = error instanceof Error ? error.message : 'Unknown error'
      }
    } else {
      validation.telegram.error = 'Telegram not configured'
    }

    // Validate WhatsApp (basic check)
    const whatsappApiKey = process.env.WHATSAPP_API_KEY
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    
    if (whatsappApiKey && whatsappPhoneNumberId) {
      validation.whatsapp.valid = true
    } else {
      validation.whatsapp.error = 'WhatsApp not configured'
    }

    const response = NextResponse.json({ 
      validation,
      message: 'Configuration validation completed'
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error validating notification config:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
