import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { signJWT, comparePassword } from '@/lib/auth'

export const runtime = 'edge'

interface LoginRequest {
  username: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json() as LoginRequest

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get D1 database from Cloudflare environment
    const d1Database = (globalThis as any).DB
    const prisma = createPrismaClient(d1Database)

    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = await signJWT(
      { 
        adminId: admin.id, 
        username: admin.username,
        role: admin.role 
      },
      process.env.JWT_SECRET || 'fallback-secret'
    )

    // Return admin info (without password) and token
    const { password: _, ...adminWithoutPassword } = admin

    return NextResponse.json({
      message: 'Login successful',
      token,
      admin: adminWithoutPassword
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
