import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

/**
 * GET /api/admin/whatsapp-config - Get WhatsApp configuration status
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Check environment variables
    const config = {
      whatsappApiKey: process.env.WHATSAPP_API_KEY ? 'Configured' : 'Not configured',
      whatsappPhoneNumber: process.env.WHATSAPP_PHONE_NUMBER ? 'Configured' : 'Not configured',
      whatsappApiUrl: process.env.WHATSAPP_API_URL || 'Not configured (using default)',
      whatsappWebhookUrl: process.env.WHATSAPP_WEBHOOK_URL ? 'Configured' : 'Not configured',
      companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Not configured'
    }
    
    const response = NextResponse.json({
      success: true,
      configuration: config,
      status: config.whatsappApiKey === 'Configured' && config.whatsappPhoneNumber === 'Configured' ? 'Ready' : 'Not ready',
      instructions: {
        setup: [
          '1. WhatsApp Business API is already configured with your phone number ID: 818800901316270',
          '2. Set the following environment variables:',
          '   - WHATSAPP_API_KEY: Your Facebook access token (EAAVRDgVc94EB...)',
          '   - WHATSAPP_PHONE_NUMBER: Your WhatsApp Business phone number',
          '3. Update company WhatsApp number in database via /api/admin/company',
          '4. Test the integration using POST /api/admin/test-whatsapp'
        ],
        providers: [
          {
            name: 'WhatsApp Business API (Meta) - Configured',
            url: 'https://developers.facebook.com/docs/whatsapp',
            endpoint: 'https://graph.facebook.com/v22.0/818800901316270/messages',
            status: 'Active'
          },
          {
            name: 'Twilio WhatsApp API',
            url: 'https://www.twilio.com/docs/whatsapp',
            endpoint: 'https://api.twilio.com/2010-04-01/Accounts/{account-sid}/Messages.json'
          },
          {
            name: '360Dialog',
            url: 'https://www.360dialog.com/',
            endpoint: 'https://waba.360dialog.io/v1/messages'
          }
        ]
      }
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

/**
 * POST /api/admin/whatsapp-config - Test WhatsApp configuration
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const body = await request.json() as { testPhone?: string; testMessage?: string }
    const { testPhone, testMessage } = body
    
    if (!testPhone) {
      const response = NextResponse.json({ 
        error: 'Test phone number is required' 
      }, { status: 400 })
      return withCORS(response)
    }
    
    // Import the WhatsApp service
    const { ServiceFactory } = await import('@/lib/services/ServiceFactory')
    const whatsappService = ServiceFactory.getWhatsAppNotificationService()
    
    // Send test message
    const success = await whatsappService.sendTestMessage()
    
    const response = NextResponse.json({
      success: success,
      message: success ? 'Test message sent successfully' : 'Failed to send test message',
      testPhone: testPhone,
      testMessage: testMessage || 'Test message from Rent-A-Car system'
    })
    return withCORS(response)
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
