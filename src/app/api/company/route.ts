import { NextResponse } from 'next/server'
import { DatabaseFactory } from '@/lib/database/DatabaseFactory'
import { withCORS, handleCORSPreflight } from '@/lib/api/cors'

export const runtime = 'edge'

/**
 * OPTIONS /api/company - Handle CORS preflight requests
 */
export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET() {
  try {
    const database = DatabaseFactory.getDefaultProvider()
    
    const sql = 'SELECT * FROM company_info LIMIT 1'
    const result = await database.query(sql)
    
    if (!result.success) {
      const response = NextResponse.json({ error: 'Failed to fetch company info' }, { status: 500 })
      return withCORS(response)
    }
    
    const companyInfo = result.data?.[0] || null
    
    const response = NextResponse.json({ 
      success: true,
      data: companyInfo
    })
    
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching company info:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
