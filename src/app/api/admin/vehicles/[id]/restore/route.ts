import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS } from '@/lib/api/cors'
import { verifyTokenFromRequest } from '@/lib/auth'

export const runtime = 'edge'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params
    
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get vehicle service
    const vehicleService = ServiceFactory.getVehicleService()
    
    // Restore soft-deleted vehicle
    const restored = await vehicleService.restoreVehicle(id)
    if (!restored) {
      const response = NextResponse.json({ error: 'Failed to restore vehicle' }, { status: 500 })
      return withCORS(response)
    }

    const response = NextResponse.json({ 
      message: 'Vehicle restored successfully' 
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error restoring vehicle:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
