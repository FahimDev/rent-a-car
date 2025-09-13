import { NextResponse } from 'next/server'
import { DatabaseFactory } from '@/lib/database/DatabaseFactory'

export const runtime = 'edge'

export async function GET() {
  try {
    const database = DatabaseFactory.getDefaultProvider()
    
    const sql = 'SELECT * FROM company_info LIMIT 1'
    const result = await database.query(sql)
    
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to fetch company info' }, { status: 500 })
    }
    
    const companyInfo = result.data?.[0] || null
    
    return NextResponse.json({ 
      success: true,
      data: companyInfo
    })
  } catch (error) {
    console.error('Error fetching company info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
