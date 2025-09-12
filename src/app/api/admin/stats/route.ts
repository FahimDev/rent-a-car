import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { verifyTokenFromRequest } from '@/lib/auth'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get D1 database from Cloudflare environment
    const d1Database = (globalThis as any).DB
    const prisma = createPrismaClient(d1Database)
    
    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
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