import { sign, verify } from '@tsndr/cloudflare-worker-jwt'

// JWT utilities for Edge runtime
export async function signJWT(payload: any, secret: string): Promise<string> {
  return await sign(payload, secret)
}

export async function verifyJWT(token: string, secret: string): Promise<any> {
  try {
    return await verify(token, secret)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Password hashing for Edge runtime using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password)
  return hashedInput === hashedPassword
}

// Helper function to verify JWT token from request headers
export async function verifyTokenFromRequest(request: Request): Promise<{ adminId: string; username: string; role: string }> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided')
  }
  
  const token = authHeader.replace('Bearer ', '')
  const decoded = await verifyJWT(token, process.env.JWT_SECRET || 'fallback-secret')
  
  if (!decoded.adminId || !decoded.username || !decoded.role) {
    throw new Error('Invalid token payload')
  }
  
  return decoded as { adminId: string; username: string; role: string }
}
