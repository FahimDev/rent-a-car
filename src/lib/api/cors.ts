import { NextResponse } from 'next/server'

/**
 * CORS configuration for API routes
 * Centralized CORS handling for consistent security and maintainability
 */

export interface CORSConfig {
  allowedOrigins?: string[]
  allowedMethods?: string[]
  allowedHeaders?: string[]
  allowCredentials?: boolean
}

const DEFAULT_CORS_CONFIG: Required<CORSConfig> = {
  allowedOrigins: ['*'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  allowCredentials: false
}

/**
 * Apply CORS headers to a NextResponse
 * @param response - The NextResponse to add CORS headers to
 * @param config - CORS configuration options
 * @returns NextResponse with CORS headers applied
 */
export function withCORS(
  response: NextResponse, 
  config: CORSConfig = {}
): NextResponse {
  const corsConfig = { ...DEFAULT_CORS_CONFIG, ...config }
  
  // Get the origin from the request (if available)
  const origin = response.headers.get('origin') || '*'
  
  // Determine the allowed origin
  const allowedOrigin = corsConfig.allowedOrigins.includes('*') || 
                       corsConfig.allowedOrigins.includes(origin) 
                       ? origin 
                       : corsConfig.allowedOrigins[0]

  // Apply CORS headers to the existing response
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '))
  response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '))
  
  if (corsConfig.allowCredentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

/**
 * Create a CORS-enabled response for successful requests
 * @param data - Response data
 * @param status - HTTP status code
 * @param config - CORS configuration
 * @returns NextResponse with CORS headers
 */
export function createCORSResponse(
  data: any, 
  status: number = 200, 
  config: CORSConfig = {}
): NextResponse {
  const response = NextResponse.json(data, { status })
  return withCORS(response, config)
}

/**
 * Create a CORS-enabled error response
 * @param error - Error message or object
 * @param status - HTTP status code
 * @param config - CORS configuration
 * @returns NextResponse with CORS headers
 */
export function createCORSErrorResponse(
  error: string | object, 
  status: number = 500, 
  config: CORSConfig = {}
): NextResponse {
  const errorData = typeof error === 'string' ? { error } : error
  const response = NextResponse.json(errorData, { status })
  return withCORS(response, config)
}

/**
 * Handle CORS preflight requests (OPTIONS)
 * @param config - CORS configuration
 * @returns NextResponse for OPTIONS request
 */
export function handleCORSPreflight(config: CORSConfig = {}): NextResponse {
  const corsConfig = { ...DEFAULT_CORS_CONFIG, ...config }
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': corsConfig.allowedOrigins[0],
      'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(', '),
      'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', '),
      'Access-Control-Max-Age': '86400', // 24 hours
    }
  })
}
