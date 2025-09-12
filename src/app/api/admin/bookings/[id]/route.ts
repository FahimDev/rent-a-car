import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { verifyTokenFromRequest } from '@/lib/auth'

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

    // Get booking by ID
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        passenger: true,
        vehicle: {
          include: {
            photos: true
          }
        },
        notifications: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    const body = await request.json() as UpdateBookingRequest
    const { status, notes } = body

    // Update booking
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: status || undefined,
        notes: notes || undefined
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

    return NextResponse.json({ 
      booking,
      message: 'Booking updated successfully' 
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}