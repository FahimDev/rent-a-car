import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS, handleCORSPreflight } from '@/lib/api/cors'

// Use Edge runtime for Cloudflare Pages deployment
export const runtime = 'edge'

interface LoginRequest {
  username: string
  password: string
}

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json() as LoginRequest

    if (!username || !password) {
      const response = NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
      return withCORS(response)
    }

    // Get admin service
    const adminService = ServiceFactory.getAdminService()

    // Authenticate admin
    const authResult = await adminService.authenticate(username, password)

    if (!authResult) {
      const response = NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
      return withCORS(response)
    }

    const response = NextResponse.json({
      message: 'Login successful',
      token: authResult.token,
      admin: authResult.admin
    })
    
    return withCORS(response)

  } catch (error) {
    console.error('Admin login error:', error)
    const response = NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
    return withCORS(response)
  }
}