import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { saveUploadedFile, validateImageFile } from '@/lib/fileUpload'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

// GET /api/admin/vehicles - Get all vehicles
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get vehicle service
    const vehicleService = ServiceFactory.getVehicleService()
    
    // Get all vehicles
    const vehicles = await vehicleService.getAllVehicles()

    const response = NextResponse.json({ vehicles })
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}

// POST /api/admin/vehicles - Create new vehicle
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Parse form data
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const capacity = parseInt(formData.get('capacity') as string)
    const pricePerDay = parseFloat(formData.get('pricePerDay') as string)
    const description = formData.get('description') as string
    const features = formData.get('features') as string
    const isAvailable = formData.get('isAvailable') === 'true'
    const primaryImageIndex = parseInt(formData.get('primaryImageIndex') as string) || 0

    // Validate required fields
    if (!name || !type || !capacity || !pricePerDay || !description) {
      const response = NextResponse.json({ 
        error: 'Missing required fields: name, type, capacity, pricePerDay, description' 
      }, { status: 400 })
      return withCORS(response)
    }

    // Parse features array and convert to JSON string
    const featuresArray = features ? features.split(',').map(f => f.trim()).filter(f => f) : []
    const featuresJson = JSON.stringify(featuresArray)

    // Get vehicle service
    const vehicleService = ServiceFactory.getVehicleService()
    
    // Create vehicle
    const vehicle = await vehicleService.createVehicle({
      name,
      type,
      capacity,
      pricePerDay,
      description,
      features: featuresArray,
      isAvailable,
      adminId
    })

    // Handle photo uploads
    const photos = []
    const uploadedFiles = []
    
    // Collect all photo files first
    for (let i = 0; i < 10; i++) { // Allow up to 10 photos
      const photoFile = formData.get(`photo_${i}`) as File
      if (photoFile && photoFile.size > 0) {
        // Validate the image file
        if (!validateImageFile(photoFile)) {
          const response = NextResponse.json({ 
            error: `Invalid image file: ${photoFile.name}. Please upload a valid image (JPEG, PNG, WebP) under 5MB.` 
          }, { status: 400 })
          return withCORS(response)
        }
        uploadedFiles.push({ file: photoFile, index: i })
      }
    }

    // Upload photos and create database records
    for (const { file, index } of uploadedFiles) {
      try {
        // Save the uploaded file to filesystem
        const fileUrl = await saveUploadedFile(file, vehicle.id, index)
        
        // Create photo record in database
        const photo = await vehicleService.addVehiclePhoto(vehicle.id, {
          url: fileUrl,
          alt: `${vehicle.name} - Photo ${index + 1}`,
          order: index,
          isPrimary: index === primaryImageIndex
        })
        photos.push(photo)
      } catch (error) {
        console.error('Error saving photo:', error)
        const response = NextResponse.json({ 
          error: `Failed to save image: ${file.name}` 
        }, { status: 500 })
        return withCORS(response)
      }
    }

    // Get the complete vehicle with photos
    const vehicleWithPhotos = await vehicleService.getVehicleById(vehicle.id)

    const response = NextResponse.json({ 
      vehicle: vehicleWithPhotos,
      message: 'Vehicle created successfully' 
    }, { status: 201 })
    return withCORS(response)
  } catch (error) {
    console.error('Error creating vehicle:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}
