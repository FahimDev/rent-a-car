import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

/**
 * POST /api/admin/test-whatsapp - Test WhatsApp notification
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get WhatsApp notification service
    const whatsappService = ServiceFactory.getWhatsAppNotificationService()
    
    // Send test message
    const success = await whatsappService.sendTestMessage()
    
    if (success) {
      const response = NextResponse.json({
        success: true,
        message: 'WhatsApp test message sent successfully'
      })
      return withCORS(response)
    } else {
      const response = NextResponse.json({
        success: false,
        error: 'Failed to send WhatsApp test message'
      }, { status: 500 })
      return withCORS(response)
    }
  } catch (error) {
    console.error('WhatsApp test error:', error)
    
    const response = NextResponse.json({
      success: false,
      error: 'WhatsApp test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
    return withCORS(response)
  }
}

/**
 * GET /api/admin/test-whatsapp - Get WhatsApp configuration status
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Check configuration
    const whatsappApiKey = process.env.WHATSAPP_API_KEY
    const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER
    const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME
    
    // Get company WhatsApp from database
    const whatsappService = ServiceFactory.getWhatsAppNotificationService()
    const companyWhatsApp = await (whatsappService as any).getCompanyWhatsApp()
    
    const response = NextResponse.json({
      configuration: {
        whatsappApiKey: whatsappApiKey ? 'Configured' : 'Not configured',
        whatsappPhoneNumber: whatsappPhoneNumber ? 'Configured' : 'Not configured',
        companyName: companyName || 'Not configured',
        companyWhatsApp: companyWhatsApp || 'Not configured in database'
      },
      status: whatsappApiKey && whatsappPhoneNumber && companyWhatsApp ? 'Ready' : 'Not ready'
    })
    return withCORS(response)
  } catch (error) {
    console.error('WhatsApp config check error:', error)
    
    const response = NextResponse.json({
      error: 'Failed to check WhatsApp configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
    return withCORS(response)
  }
}
