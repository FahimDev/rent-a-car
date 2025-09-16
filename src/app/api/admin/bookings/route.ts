import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get booking service
    const bookingService = ServiceFactory.getBookingService()
    
    // Get bookings with pagination
    const result = await bookingService.getBookings({ 
      status: status || undefined, 
      page, 
      limit 
    })

    const response = NextResponse.json({
      bookings: result.bookings,
      total: result.total,
      page: page || 1,
      limit: limit || 10,
      pagination: {
        pages: Math.ceil((result.total || 0) / (limit || 10))
      }
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching admin bookings:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}