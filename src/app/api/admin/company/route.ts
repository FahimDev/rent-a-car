import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'
import { DatabaseFactory } from '@/lib/database/DatabaseFactory'

export const runtime = 'edge'

/**
 * GET /api/admin/company - Get company information
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
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

/**
 * PUT /api/admin/company - Update company information
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    const body = await request.json() as {
      name?: string
      tagline?: string
      description?: string
      address?: string
      phone?: string
      email?: string
      whatsapp?: string
      latitude?: number
      longitude?: number
      services?: string[]
    }
    const { name, tagline, description, address, phone, email, whatsapp, latitude, longitude, services } = body
    
    const database = DatabaseFactory.getDefaultProvider()
    
    // Check if company info exists
    const checkSql = 'SELECT id FROM company_info LIMIT 1'
    const checkResult = await database.query(checkSql)
    
    let sql: string
    let params: any[]
    
    if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
      // Update existing record
      const fields = []
      const values = []
      let paramIndex = 1
      
      if (name !== undefined) {
        fields.push(`name = $${paramIndex}`)
        values.push(name)
        paramIndex++
      }
      if (tagline !== undefined) {
        fields.push(`tagline = $${paramIndex}`)
        values.push(tagline)
        paramIndex++
      }
      if (description !== undefined) {
        fields.push(`description = $${paramIndex}`)
        values.push(description)
        paramIndex++
      }
      if (address !== undefined) {
        fields.push(`address = $${paramIndex}`)
        values.push(address)
        paramIndex++
      }
      if (phone !== undefined) {
        fields.push(`phone = $${paramIndex}`)
        values.push(phone)
        paramIndex++
      }
      if (email !== undefined) {
        fields.push(`email = $${paramIndex}`)
        values.push(email)
        paramIndex++
      }
      if (whatsapp !== undefined) {
        fields.push(`whatsapp = $${paramIndex}`)
        values.push(whatsapp)
        paramIndex++
      }
      if (latitude !== undefined) {
        fields.push(`latitude = $${paramIndex}`)
        values.push(latitude)
        paramIndex++
      }
      if (longitude !== undefined) {
        fields.push(`longitude = $${paramIndex}`)
        values.push(longitude)
        paramIndex++
      }
      if (services !== undefined) {
        fields.push(`services = $${paramIndex}`)
        values.push(JSON.stringify(services))
        paramIndex++
      }
      
      fields.push(`updatedAt = $${paramIndex}`)
      values.push(new Date().toISOString())
      paramIndex++
      
      values.push(checkResult.data[0].id)
      
      sql = `UPDATE company_info SET ${fields.join(', ')} WHERE id = $${paramIndex}`
      params = values
    } else {
      // Create new record
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      
      sql = `
        INSERT INTO company_info (id, name, tagline, description, address, phone, email, whatsapp, latitude, longitude, services, createdAt, updatedAt)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `
      params = [
        id,
        name || 'Rent-A-Car',
        tagline || null,
        description || null,
        address || null,
        phone || null,
        email || null,
        whatsapp || null,
        latitude || null,
        longitude || null,
        services ? JSON.stringify(services) : null,
        now,
        now
      ]
    }
    
    const result = await database.query(sql, params)
    
    if (!result.success) {
      const response = NextResponse.json({ error: 'Failed to update company info' }, { status: 500 })
      return withCORS(response)
    }
    
    // Get updated company info
    const getSql = 'SELECT * FROM company_info LIMIT 1'
    const getResult = await database.query(getSql)
    
    const response = NextResponse.json({
      success: true,
      data: getResult.data?.[0] || null,
      message: 'Company information updated successfully'
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error updating company info:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
