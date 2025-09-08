import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveUploadedFile, validateImageFile } from '@/lib/fileUpload'
import jwt from 'jsonwebtoken'

// GET /api/admin/vehicles - Get all vehicles
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { adminId: string }
    
    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Get all vehicles with photos
    const vehicles = await prisma.vehicle.findMany({
      include: {
        photos: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/vehicles - Create new vehicle
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { adminId: string }
    
    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Parse form data
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const capacity = parseInt(formData.get('capacity') as string)
    const pricePerDay = parseFloat(formData.get('pricePerDay') as string)
    const description = formData.get('description') as string
    const features = formData.get('features') as string
    const isAvailable = formData.get('isAvailable') === 'true'

    // Validate required fields
    if (!name || !type || !capacity || !pricePerDay || !description) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, type, capacity, pricePerDay, description' 
      }, { status: 400 })
    }

    // Parse features array and convert to JSON string
    const featuresArray = features ? features.split(',').map(f => f.trim()).filter(f => f) : []
    const featuresJson = JSON.stringify(featuresArray)

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        type,
        capacity,
        pricePerDay,
        description,
        features: featuresJson,
        isAvailable,
        adminId: admin.id
      }
    })

    // Handle photo uploads
    const photos = []
    for (let i = 0; i < 10; i++) { // Allow up to 10 photos
      const photoFile = formData.get(`photo_${i}`) as File
      if (photoFile && photoFile.size > 0) {
        // Validate the image file
        if (!validateImageFile(photoFile)) {
          return NextResponse.json({ 
            error: `Invalid image file: ${photoFile.name}. Please upload a valid image (JPEG, PNG, WebP) under 5MB.` 
          }, { status: 400 })
        }
        
        try {
          // Save the uploaded file to filesystem
          const fileUrl = await saveUploadedFile(photoFile, vehicle.id, i)
          
          // Create photo record in database
          const photo = await prisma.vehiclePhoto.create({
            data: {
              vehicleId: vehicle.id,
              url: fileUrl,
              alt: `${vehicle.name} - Photo ${i + 1}`,
              order: i
            }
          })
          photos.push(photo)
        } catch (error) {
          console.error('Error saving photo:', error)
          return NextResponse.json({ 
            error: `Failed to save image: ${photoFile.name}` 
          }, { status: 500 })
        }
      }
    }

    // Return vehicle with photos
    const vehicleWithPhotos = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
      include: {
        photos: true
      }
    })

    return NextResponse.json({ 
      vehicle: vehicleWithPhotos,
      message: 'Vehicle created successfully' 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
