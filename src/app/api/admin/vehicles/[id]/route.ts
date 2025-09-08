import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveUploadedFile, validateImageFile, deleteUploadedFile } from '@/lib/fileUpload'
import jwt from 'jsonwebtoken'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get vehicle by ID
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: {
        photos: true,
        bookings: {
          include: {
            passenger: true
          }
        }
      }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update vehicle
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        name,
        type,
        capacity,
        pricePerDay,
        description,
        features: featuresJson,
        isAvailable
      },
      include: {
        photos: true
      }
    })

    // Handle new photo uploads
    const newPhotos = []
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
          newPhotos.push(photo)
        } catch (error) {
          console.error('Error saving photo:', error)
          return NextResponse.json({ 
            error: `Failed to save image: ${photoFile.name}` 
          }, { status: 500 })
        }
      }
    }

    // Get updated vehicle with all photos
    const updatedVehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: {
        photos: true
      }
    })

    return NextResponse.json({ 
      vehicle: updatedVehicle,
      message: 'Vehicle updated successfully' 
    })
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { isAvailable } = body

    // Update vehicle availability
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        isAvailable: isAvailable
      },
      include: {
        photos: true
      }
    })

    return NextResponse.json({ 
      vehicle,
      message: 'Vehicle status updated successfully' 
    })
  } catch (error) {
    console.error('Error updating vehicle status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if vehicle has any bookings
    const bookingsCount = await prisma.booking.count({
      where: { vehicleId: params.id }
    })

    if (bookingsCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete vehicle with existing bookings' 
      }, { status: 400 })
    }

    // Get vehicle photos before deletion to clean up files
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: { photos: true }
    })

    if (vehicle) {
      // Delete uploaded files
      for (const photo of vehicle.photos) {
        await deleteUploadedFile(photo.url)
      }
    }

    // Delete vehicle (photos will be deleted automatically due to cascade)
    await prisma.vehicle.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: 'Vehicle deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}