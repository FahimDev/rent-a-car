import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

/**
 * GET /api/admin/notifications/config
 * Get current notification configuration
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const notificationConfigService = ServiceFactory.getNotificationConfigService()
    const config = notificationConfigService.getConfig()

    const response = NextResponse.json({ config })
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching notification config:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}

/**
 * PUT /api/admin/notifications/config
 * Update notification configuration
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const body = await request.json() as { config?: any }
    const { config } = body

    if (!config) {
      const response = NextResponse.json({ error: 'Configuration data is required' }, { status: 400 })
      return withCORS(response)
    }

    const notificationConfigService = ServiceFactory.getNotificationConfigService()

    // Update configuration
    notificationConfigService.updateConfig(config)

    const response = NextResponse.json({ 
      message: 'Notification configuration updated successfully',
      config: notificationConfigService.getConfig()
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error updating notification config:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
