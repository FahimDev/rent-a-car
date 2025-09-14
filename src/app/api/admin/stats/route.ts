import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get admin stats service
    const adminStatsService = ServiceFactory.getAdminStatsService()
    
    // Get dashboard statistics
    const stats = await adminStatsService.getDashboardStats()

    const response = NextResponse.json(stats)
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}