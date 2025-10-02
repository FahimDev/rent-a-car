import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'
import { DatabaseFactory } from '@/lib/database/DatabaseFactory'

export const runtime = 'edge'

/**
 * GET /api/admin/notifications - Get notification history
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const database = DatabaseFactory.getDefaultProvider()
    
    let whereClause = ''
    let params: any[] = []
    let paramIndex = 1
    
    if (bookingId) {
      whereClause += `WHERE bookingId = $${paramIndex}`
      params.push(bookingId)
      paramIndex++
    }
    
    if (type) {
      whereClause += whereClause ? ` AND type = $${paramIndex}` : `WHERE type = $${paramIndex}`
      params.push(type)
      paramIndex++
    }
    
    if (status) {
      whereClause += whereClause ? ` AND status = $${paramIndex}` : `WHERE status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }
    
    const offset = (page - 1) * limit
    
    const sql = `
      SELECT n.*, b.passengerId, p.name as passengerName, p.phone as passengerPhone
      FROM notifications n
      LEFT JOIN bookings b ON n.bookingId = b.id
      LEFT JOIN passengers p ON b.passengerId = p.id
      ${whereClause}
      ORDER BY n.createdAt DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM notifications n
      ${whereClause}
    `
    
    const [notificationsResult, countResult] = await Promise.all([
      database.query(sql, [...params, limit, offset]),
      database.query(countSql, params)
    ])
    
    if (!notificationsResult.success || !countResult.success) {
      const response = NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
      return withCORS(response)
    }
    
    const notifications = notificationsResult.data || []
    const total = countResult.data?.[0]?.total || 0
    
    const response = NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}

/**
 * POST /api/admin/notifications - Send manual notification
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const body = await request.json() as {
      bookingId?: string
      type?: string
      message?: string
    }
    const { bookingId, type, message } = body
    
    if (!bookingId || !type) {
      const response = NextResponse.json({ 
        error: 'Booking ID and notification type are required' 
      }, { status: 400 })
      return withCORS(response)
    }
    
    if (type === 'whatsapp') {
      // Get booking details
      const bookingService = ServiceFactory.getBookingService()
      const booking = await bookingService.getBookingById(bookingId)
      
      if (!booking) {
        const response = NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        return withCORS(response)
      }
      
      // Send WhatsApp notification
      const whatsappService = ServiceFactory.getWhatsAppNotificationService()
      const success = await whatsappService.sendBookingNotification(booking)
      
      const response = NextResponse.json({
        success: success,
        message: success ? 'Notification sent successfully' : 'Failed to send notification'
      })
      return withCORS(response)
    }
    
    const response = NextResponse.json({ 
      error: 'Unsupported notification type' 
    }, { status: 400 })
    return withCORS(response)
  } catch (error) {
    console.error('Error sending notification:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
