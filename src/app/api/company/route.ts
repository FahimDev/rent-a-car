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
  console.log('🚀 [COMPANY API] GET request received')
  
  try {
    const database = DatabaseFactory.getDefaultProvider()
    console.log('🚀 [COMPANY API] Database provider obtained')
    
    const sql = 'SELECT * FROM company_info LIMIT 1'
    console.log('🚀 [COMPANY API] Executing query:', sql)
    const result = await database.query(sql)
    console.log('🚀 [COMPANY API] Query result:', {
      success: result.success,
      hasData: !!result.data,
      dataLength: result.data?.length || 0
    })
    
    if (!result.success) {
      console.error('🚀 [COMPANY API] Query failed:', result.error)
      const response = NextResponse.json({ error: 'Failed to fetch company info' }, { status: 500 })
      return withCORS(response)
    }
    
    const companyInfo = result.data?.[0] || null
    console.log('🚀 [COMPANY API] Company info:', {
      hasInfo: !!companyInfo,
      infoKeys: companyInfo ? Object.keys(companyInfo) : []
    })
    
    const response = NextResponse.json({ 
      success: true,
      data: companyInfo
    })
    console.log('🚀 [COMPANY API] Response created successfully')
    
    return withCORS(response)
  } catch (error) {
    console.error('🚀 [COMPANY API] Error:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
