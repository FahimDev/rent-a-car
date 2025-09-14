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
    
    // Get passengers with pagination
    const result = await passengerService.getPassengers({ 
      search: search || undefined,
      verified: verified ? verified === 'true' : undefined,
      page, 
      limit 
    })

    const response = NextResponse.json({
      passengers: result.passengers,
      pagination: result.pagination
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching passengers:', error)
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
    
    // Update passenger
    const passenger = await passengerService.updatePassenger(passengerId, {
      isVerified,
      name,
      email
    })

    const response = NextResponse.json({ 
      passenger,
      message: 'Passenger updated successfully' 
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error updating passenger:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}