import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

interface UpdateBookingRequest {
  status?: string
  notes?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params
    
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get booking service
    const bookingService = ServiceFactory.getBookingService()
    
    // Get booking by ID
    const booking = await bookingService.getBookingById(id)

    if (!booking) {
      const response = NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      return withCORS(response)
    }

    const response = NextResponse.json({ booking })
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching booking:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params
    
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const body = await request.json() as UpdateBookingRequest
    const { status, notes } = body

    // Get booking service
    const bookingService = ServiceFactory.getBookingService()
    
    // Update booking
    const booking = await bookingService.updateBooking(id, {
      status,
      notes
    })

    const response = NextResponse.json({ 
      booking,
      message: 'Booking updated successfully' 
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error updating booking:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}