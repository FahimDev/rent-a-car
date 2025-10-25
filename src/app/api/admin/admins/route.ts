import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS, handleCORSPreflight } from '@/lib/api/cors'
import { verifyTokenFromRequest } from '@/lib/auth'

// Use Edge runtime for Cloudflare Pages deployment
export const runtime = 'edge'

interface CreateAdminRequest {
  username: string
  password: string
  email?: string
  phone?: string
  role?: string
}

export async function OPTIONS() {
  return handleCORSPreflight()
}

// GET /api/admin/admins - Get all admins
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get admin service
    const adminService = ServiceFactory.getAdminService()
    
    // Get all admins
    const admins = await adminService.getAllAdmins()

    const response = NextResponse.json({ admins })
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching admins:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}

// POST /api/admin/admins - Create new admin
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const { username, password, email, phone, role } = await request.json() as CreateAdminRequest

    if (!username || !password) {
      const response = NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
      return withCORS(response)
    }

    if (password.length < 6) {
      const response = NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
      return withCORS(response)
    }

    // Get admin service
    const adminService = ServiceFactory.getAdminService()

    // Create new admin
    const newAdmin = await adminService.createAdmin({
      username,
      password,
      email,
      phone,
      role: role || 'admin'
    })

    const response = NextResponse.json({
      message: 'Admin created successfully',
      admin: newAdmin
    })
    
    return withCORS(response)

  } catch (error: any) {
    console.error('Admin creation error:', error)
    const response = NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
    return withCORS(response)
  }
}
