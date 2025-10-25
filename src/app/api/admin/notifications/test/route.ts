import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

/**
 * POST /api/admin/notifications/test
 * Send test notification to verify configuration
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const unifiedNotificationService = ServiceFactory.getUnifiedNotificationService()
    const result = await unifiedNotificationService.sendTestNotification()

    if (result.success) {
      const response = NextResponse.json({ 
        success: true,
        message: `Test notification sent successfully via: ${result.methods.join(', ')}`,
        methods: result.methods
      })
      return withCORS(response)
    } else {
      const response = NextResponse.json({ 
        success: false,
        message: 'Test notification failed',
        errors: result.errors
      }, { status: 400 })
      return withCORS(response)
    }
  } catch (error) {
    console.error('Error sending test notification:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
