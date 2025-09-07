import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatPhoneNumber, generateBookingReference } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(passengerPhone)

    // Check if passenger exists, if not create one
    let passenger = await prisma.passenger.findUnique({
      where: { phone: formattedPhone }
    })

    if (!passenger) {
      passenger = await prisma.passenger.create({
        data: {
          phone: formattedPhone,
          name: passengerName,
          email: passengerEmail || null,
          isVerified: false
        }
      })
    } else {
      // Update passenger info if provided
      await prisma.passenger.update({
        where: { id: passenger.id },
        data: {
          name: passengerName,
          email: passengerEmail || passenger.email
        }
      })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        passengerId: passenger.id,
        vehicleId,
        bookingDate: new Date(bookingDate),
        pickupTime,
        tripType,
        pickupLocation,
        dropoffLocation: tripType === 'round' ? dropoffLocation : null,
        status: 'pending'
      },
      include: {
        passenger: true,
        vehicle: {
          include: {
            photos: true
          }
        }
      }
    })

    // Send WhatsApp notification (if configured)
    try {
      await sendWhatsAppNotification(booking)
    } catch (error) {
      console.error('WhatsApp notification failed:', error)
      // Don't fail the booking if notification fails
    }

    return NextResponse.json({
      id: booking.id,
      message: 'Booking created successfully',
      booking
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where = status ? { status } : {}
    
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        passenger: true,
        vehicle: {
          include: {
            photos: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.booking.count({ where })

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
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
• Seats: ${booking.vehicle.seats}

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
      // Create notification record
      await prisma.notification.create({
        data: {
          bookingId: booking.id,
          type: 'whatsapp',
          status: 'sent',
          message: message,
          sentAt: new Date()
        }
      })
    }
  } catch (error) {
    console.error('WhatsApp API error:', error)
    throw error
  }
}
