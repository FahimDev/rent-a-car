import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

interface UpdatePassengerRequest {
  passengerId: string
  isVerified?: boolean
  name?: string
  email?: string
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const verified = searchParams.get('verified')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get passenger service
    const passengerService = ServiceFactory.getPassengerService()
    
    // Get passengers with their bookings for admin panel
    const result = await passengerService.getPassengersWithBookings({ 
      isVerified: verified ? verified === 'true' : undefined,
      page, 
      limit 
    })

    const response = NextResponse.json({
      passengers: result.passengers,
      total: result.total,
      page: page || 1,
      limit: limit || 10,
      pagination: {
        pages: Math.ceil((result.total || 0) / (limit || 10))
      }
    })
    return withCORS(response)
  } catch (error) {
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const body = await request.json() as UpdatePassengerRequest
    const { passengerId, isVerified, name, email } = body

    if (!passengerId) {
      const response = NextResponse.json({ error: 'Passenger ID is required' }, { status: 400 })
      return withCORS(response)
    }

    // Get passenger service
    const passengerService = ServiceFactory.getPassengerService()
    
    // Update passenger with verification status if provided
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (isVerified !== undefined) updateData.isVerified = isVerified
    
    const passenger = await passengerService.updatePassenger(passengerId, updateData)

    const response = NextResponse.json({ 
      passenger,
      message: 'Passenger updated successfully' 
    })
    return withCORS(response)
  } catch (error) {
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}