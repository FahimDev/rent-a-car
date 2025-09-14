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
      dropoffLocation: tripType === 'round' ? dropoffLocation : undefined,
      passengerName,
      passengerPhone,
      passengerEmail,
      vehicleId
    }

    // Create booking using service layer
    const booking = await bookingService.createBooking(bookingData)

    // Send WhatsApp notification (if configured)
    try {
      await sendWhatsAppNotification(booking)
    } catch (error) {
      console.error('WhatsApp notification failed:', error)
      // Don't fail the booking if notification fails
    }

    const response = NextResponse.json({
      id: booking.id,
      message: 'Booking created successfully',
      booking
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
      bookings: result.bookings,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
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

async function sendWhatsAppNotification(booking: any) {
  const whatsappApiKey = process.env.WHATSAPP_API_KEY
  const whatsappPhone = process.env.WHATSAPP_PHONE_NUMBER
  const adminPhone = process.env.NEXT_PUBLIC_COMPANY_WHATSAPP

  if (!whatsappApiKey || !whatsappPhone || !adminPhone) {
    console.log('WhatsApp configuration missing, skipping notification')
    return
  }

  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.id}`
  
  const message = `🚗 *New Booking Received!*

📋 *Booking Details:*
• ID: ${booking.id}
• Date: ${booking.bookingDate.toLocaleDateString()}
• Time: ${booking.pickupTime}
• Trip: ${booking.tripType === 'single' ? 'Single Trip' : 'Round Trip'}

👤 *Passenger:*
• Name: ${booking.passenger.name}
• Phone: ${booking.passenger.phone}

🚙 *Vehicle:*
• ${booking.vehicle.name}
• Type: ${booking.vehicle.type}
• Capacity: ${booking.vehicle.capacity}

📍 *Locations:*
• Pickup: ${booking.pickupLocation}
${booking.dropoffLocation ? `• Drop-off: ${booking.dropoffLocation}` : ''}

🔗 View details: ${bookingUrl}`

  try {
    const response = await fetch(`https://api.whatsapp.com/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: adminPhone,
        message: message
      })
    })

    if (response.ok) {
      console.log('WhatsApp notification sent successfully')
      // Note: In a production system, you might want to log this to a database
      // For now, we'll just log it to the console
    }
  } catch (error) {
    console.error('WhatsApp API error:', error)
    throw error
  }
}
