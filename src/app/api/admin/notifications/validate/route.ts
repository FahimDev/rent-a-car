import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

/**
 * POST /api/admin/notifications/validate
 * Validate notification configuration
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const unifiedNotificationService = ServiceFactory.getUnifiedNotificationService()
    const result = await unifiedNotificationService.validateConfiguration()

    const response = NextResponse.json({ 
      validation: result,
      message: 'Configuration validation completed'
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error validating notification config:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
