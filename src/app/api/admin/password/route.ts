import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS, handleCORSPreflight } from '@/lib/api/cors'
import { verifyTokenFromRequest } from '@/lib/auth'

// Use Edge runtime for Cloudflare Pages deployment
export const runtime = 'edge'

interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const { currentPassword, newPassword } = await request.json() as UpdatePasswordRequest

    if (!currentPassword || !newPassword) {
      const response = NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      )
      return withCORS(response)
    }

    if (newPassword.length < 6) {
      const response = NextResponse.json(
        { message: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
      return withCORS(response)
    }

    // Get admin service
    const adminService = ServiceFactory.getAdminService()

    // Update password
    const success = await adminService.updatePassword(adminId, currentPassword, newPassword)

    if (!success) {
      const response = NextResponse.json(
        { message: 'Failed to update password' },
        { status: 500 }
      )
      return withCORS(response)
    }

    const response = NextResponse.json({
      message: 'Password updated successfully'
    })
    
    return withCORS(response)

  } catch (error: any) {
    console.error('Admin password update error:', error)
    const response = NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
    return withCORS(response)
  }
}
