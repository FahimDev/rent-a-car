import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS } from '@/lib/api/cors'
import { BookingFormData } from '@/types'

export const runtime = 'edge'

interface CreateBookingRequest {
  bookingDate: string
  pickupTime: string
  tripType: string
  pickupLocation: string
  dropoffLocation: string
  passengerName: string
  passengerPhone: string
  passengerEmail?: string
  vehicleId: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateBookingRequest
    const {
      bookingDate,
      pickupTime,
      tripType,
      pickupLocation,
      dropoffLocation,
      passengerName,
      passengerPhone,
      passengerEmail,
      vehicleId
    } = body

    // Validate required fields
    if (!bookingDate || !pickupTime || !tripType || !pickupLocation || !passengerName || !passengerPhone || !vehicleId) {
      const response = NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
      return withCORS(response)
    }

    // Get booking service
    const bookingService = ServiceFactory.getBookingService()

    // Prepare booking data
    const bookingData: BookingFormData = {
      bookingDate: new Date(bookingDate),
      pickupTime,
      tripType: tripType as 'single' | 'round',
      pickupLocation,
      dropoffLocation: dropoffLocation || undefined, // Both single and round trips can have drop-off location
      passengerName,
      passengerPhone,
      passengerEmail,
      vehicleId: vehicleId || 'pending-assignment'
    }

    // Create booking using service layer
    const booking = await bookingService.createBooking(bookingData)

    // Send notification via configured method (Telegram by default, WhatsApp if configured)
    try {
      const unifiedNotificationService = ServiceFactory.getUnifiedNotificationService()
      const result = await unifiedNotificationService.sendBookingConfirmation(booking)
      
      if (result.success) {
        console.log(`Booking notification sent via: ${result.methods.join(', ')}`)
      } else {
        console.warn('Notification failed:', result.errors.join(', '))
      }
    } catch (error) {
      console.error('Notification service failed:', error)
      // Don't fail the booking if notification fails
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        message: 'Booking created successfully',
        booking
      }
    })
    return withCORS(response)

  } catch (error) {
    console.error('Booking creation error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create booking'
    const response = NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
    return withCORS(response)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get booking service
    const bookingService = ServiceFactory.getBookingService()

    // Get bookings using service layer
    const result = await bookingService.getBookings({
      status: status || undefined,
      page,
      limit
    })

    const response = NextResponse.json({
      success: true,
      data: {
        bookings: result.bookings,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      }
    })
    return withCORS(response)

  } catch (error) {
    console.error('Error fetching bookings:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings'
    const response = NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
    return withCORS(response)
  }
}

