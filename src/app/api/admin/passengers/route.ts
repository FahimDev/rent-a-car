import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

interface UpdatePassengerRequest {
  passengerId: string
  isVerified?: boolean
  name?: string
  email?: string
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { adminId: string }
    
    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const verified = searchParams.get('verified')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (verified !== null && verified !== undefined) {
      where.isVerified = verified === 'true'
    }

    // Get passengers with pagination
    const [passengers, total] = await Promise.all([
      prisma.passenger.findMany({
        where,
        include: {
          bookings: {
            include: {
              vehicle: true
            },
            orderBy: { createdAt: 'desc' },
            take: 5 // Show only recent bookings
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.passenger.count({ where })
    ])

    return NextResponse.json({
      passengers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching passengers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { adminId: string }
    
    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    const body = await request.json() as UpdatePassengerRequest
    const { passengerId, isVerified, name, email } = body

    if (!passengerId) {
      return NextResponse.json({ error: 'Passenger ID is required' }, { status: 400 })
    }

    // Update passenger
    const passenger = await prisma.passenger.update({
      where: { id: passengerId },
      data: {
        isVerified: isVerified !== undefined ? isVerified : undefined,
        name: name || undefined,
        email: email || undefined
      },
      include: {
        bookings: {
          include: {
            vehicle: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    return NextResponse.json({ 
      passenger,
      message: 'Passenger updated successfully' 
    })
  } catch (error) {
    console.error('Error updating passenger:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}