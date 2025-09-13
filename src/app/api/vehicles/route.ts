import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// GET /api/vehicles - Get all available vehicles for public
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Cloudflare D1 API credentials
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!
    const apiToken = process.env.CLOUDFLARE_API_TOKEN!
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID!

    if (!accountId || !apiToken || !databaseId) {
      return NextResponse.json({ error: 'Missing Cloudflare credentials' }, { status: 500 })
    }

    // Build SQL query
    let sql = `
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.isAvailable = 1
    `
    
    if (type) {
      sql += ` AND v.type = '${type}'`
    }
    
    sql += `
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `

    // Call Cloudflare D1 API
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error('D1 API Error:', errorData)
      return NextResponse.json({ error: 'Database query failed' }, { status: res.status })
    }

    const data = await res.json()
    const rows = data.result?.[0]?.results || []

    // Process the results
    const vehicles = rows.map((row: any) => {
      const vehicle = {
        id: row.id,
        name: row.name,
        type: row.type,
        capacity: row.capacity,
        pricePerDay: row.pricePerDay,
        description: row.description,
        features: row.features ? JSON.parse(row.features) : [],
        isAvailable: Boolean(row.isAvailable),
        adminId: row.adminId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        photos: []
      }

      // Parse photos if they exist
      if (row.photos_json) {
        try {
          let photosData: any[] = []
          
          if (row.photos_json.includes('},{')) {
            // Multiple photos
            const photoStrings = row.photos_json.split('},{').map((str: string, index: number) => {
              if (index === 0) return str + '}'
              if (index === photoStrings.length - 1) return '{' + str
              return '{' + str + '}'
            })
            
            photosData = photoStrings.map((photoStr: string) => {
              try {
                return JSON.parse(photoStr)
              } catch (e) {
                return null
              }
            }).filter(Boolean)
          } else {
            // Single photo
            try {
              const photo = JSON.parse(row.photos_json)
              photosData = [photo]
            } catch (e) {
              // ignore
            }
          }
          
          vehicle.photos = photosData
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            .map((photo: any) => ({
              id: photo.id,
              vehicleId: photo.vehicleId || '',
              url: photo.url,
              alt: photo.alt,
              isPrimary: Boolean(photo.isPrimary),
              order: photo.order || 0,
              createdAt: new Date()
            }))
        } catch (error) {
          console.error('Error parsing photos:', error)
          vehicle.photos = []
        }
      }

      return vehicle
    })

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
