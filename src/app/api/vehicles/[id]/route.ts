import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

// GET /api/vehicles/[id] - Get a specific vehicle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params
    
    // Get vehicle service
    const vehicleService = ServiceFactory.getVehicleService()
    
    const vehicle = await vehicleService.getVehicleById(id)

    if (!vehicle) {
      const response = NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
      return withCORS(response)
    }

    const response = NextResponse.json(vehicle)
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const response = NextResponse.json({ error: errorMessage }, { status: 500 })
    return withCORS(response)
  }
}
