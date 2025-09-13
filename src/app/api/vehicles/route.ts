import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS, handleCORSPreflight } from '@/lib/api/cors'

export const runtime = 'edge'

/**
 * OPTIONS /api/vehicles - Handle CORS preflight requests
 */
export async function OPTIONS() {
  return handleCORSPreflight()
}

/**
 * GET /api/vehicles - Get all available vehicles for public
 * 
 * Query parameters:
 * - type: Optional vehicle type filter ('sedan', 'noah', 'hiace')
 * 
 * Returns:
 * - 200: Array of available vehicles with photos
 * - 400: Invalid vehicle type
 * - 500: Internal server error
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Get service instance
    const vehicleService = ServiceFactory.getVehicleService()

    // Fetch vehicles using service layer
    const vehicles = await vehicleService.getAvailableVehicles(type || undefined)

    const response = NextResponse.json({ 
      success: true,
      data: { vehicles },
      count: vehicles.length 
    })
    
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Invalid vehicle type')) {
        const response = NextResponse.json(
          { error: error.message }, 
          { status: 400 }
        )
        return withCORS(response)
      }
      
      if (error.message.includes('Missing Cloudflare')) {
        const response = NextResponse.json(
          { error: 'Database configuration error' }, 
          { status: 500 }
        )
        return withCORS(response)
      }
    }
    
    const response = NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
    return withCORS(response)
  }
}
