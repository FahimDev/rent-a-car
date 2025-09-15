import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS, handleCORSPreflight } from '@/lib/api/cors'

export const runtime = 'edge'

/**
 * OPTIONS /api/bookings/[id] - Handle CORS preflight requests
 */
export async function OPTIONS() {
  return handleCORSPreflight()
}

/**
 * GET /api/bookings/[id] - Get booking by ID
 * 
 * Path parameters:
 * - id: Booking ID
 * 
 * Returns:
 * - 200: Booking details with passenger and vehicle info
 * - 404: Booking not found
 * - 500: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      const response = NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
      return withCORS(response)
    }

    // Get booking service
    const bookingService = ServiceFactory.getBookingService()

    // Fetch booking using service layer with masked passenger data (for public access)
    const booking = await bookingService.getBookingByIdMasked(id)

    if (!booking) {
      const response = NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
      return withCORS(response)
    }

    const response = NextResponse.json({
      success: true,
      data: booking
    })
    
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching booking:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const response = NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
    return withCORS(response)
  }
}
