import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

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

    // Get dashboard statistics
    const [
      totalBookings,
      pendingBookings,
      totalVehicles,
      totalPassengers
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.vehicle.count(),
      prisma.passenger.count()
    ])

    return NextResponse.json({
      totalBookings,
      pendingBookings,
      totalVehicles,
      totalPassengers
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}