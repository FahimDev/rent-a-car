import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { saveUploadedFile, validateImageFile, deleteUploadedFile } from '@/lib/fileUpload'
import { verifyTokenFromRequest } from '@/lib/auth'
import { withCORS } from '@/lib/api/cors'

export const runtime = 'edge'

interface UpdateVehicleAvailabilityRequest {
  isAvailable: boolean
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params
    
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get vehicle service
    const vehicleService = ServiceFactory.getVehicleService()
    
    // Get vehicle by ID
    const vehicle = await vehicleService.getVehicleById(id)

    if (!vehicle) {
      const response = NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
      return withCORS(response)
    }

    const response = NextResponse.json({ vehicle })
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params
    
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get vehicle service
    const vehicleService = ServiceFactory.getVehicleService()
    
    // Check if vehicle exists
    const existingVehicle = await vehicleService.getVehicleById(id)
    if (!existingVehicle) {
      const response = NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
      return withCORS(response)
    }

    // Parse request data (JSON or FormData)
    const contentType = request.headers.get('content-type') || ''
    let name: string, type: string, capacity: number, pricePerDay: number, description: string, features: string | string[], isAvailable: boolean
    
    if (contentType.includes('application/json')) {
      // Handle JSON request
      const body = await request.json() as {
        name: string
        type: string
        capacity: number
        pricePerDay: number
        description: string
        features: string[] | string
        isAvailable: boolean
      }
      name = body.name
      type = body.type
      capacity = body.capacity
      pricePerDay = body.pricePerDay
      description = body.description
      features = body.features
      isAvailable = body.isAvailable
    } else {
      // Handle FormData request
      const formData = await request.formData()
      name = formData.get('name') as string
      type = formData.get('type') as string
      capacity = parseInt(formData.get('capacity') as string)
      pricePerDay = parseFloat(formData.get('pricePerDay') as string)
      description = formData.get('description') as string
      features = formData.get('features') as string
      isAvailable = formData.get('isAvailable') === 'true'
    }

    // Validate required fields
    if (!name || !type || !capacity || !pricePerDay || !description) {
      const response = NextResponse.json({ 
        error: 'Missing required fields: name, type, capacity, pricePerDay, description' 
      }, { status: 400 })
      return withCORS(response)
    }

    // Parse features array
    const featuresArray = Array.isArray(features) ? features : 
                         (features ? features.split(',').map(f => f.trim()).filter(f => f) : [])

    // Update vehicle using service
    const updatedVehicle = await vehicleService.updateVehicle(id, {
      name,
      type,
      capacity,
      pricePerDay,
      description,
      features: featuresArray,
      isAvailable
    })

    // Handle new photo uploads (only for FormData requests)
    const newPhotos = []
    if (!contentType.includes('application/json')) {
      const formData = await request.formData()
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
          
          try {
            // Save the uploaded file to filesystem
            const fileUrl = await saveUploadedFile(photoFile, id, i)
            
            // Create photo record in database
            const photo = await vehicleService.addVehiclePhoto(id, {
              url: fileUrl,
              alt: `${updatedVehicle.name} - Photo ${i + 1}`,
              order: i,
              isPrimary: false
            })
            newPhotos.push(photo)
          } catch (error) {
            console.error('Error saving photo:', error)
            const response = NextResponse.json({ 
              error: `Failed to save image: ${photoFile.name}` 
            }, { status: 500 })
            return withCORS(response)
          }
        }
      }
    }

    // Get updated vehicle with all photos
    const finalVehicle = await vehicleService.getVehicleById(id)

    const response = NextResponse.json({ 
      vehicle: finalVehicle,
      message: 'Vehicle updated successfully' 
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params
    
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get vehicle service
    const vehicleService = ServiceFactory.getVehicleService()
    
    const body = await request.json() as UpdateVehicleAvailabilityRequest
    const { isAvailable } = body

    // Update vehicle availability
    const updated = await vehicleService.updateVehicleAvailability(id, isAvailable)
    
    if (!updated) {
      const response = NextResponse.json({ error: 'Failed to update vehicle availability' }, { status: 400 })
      return withCORS(response)
    }

    // Get updated vehicle
    const vehicle = await vehicleService.getVehicleById(id)

    const response = NextResponse.json({ 
      vehicle,
      message: 'Vehicle status updated successfully' 
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error updating vehicle status:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { id } = await params
    
    // Verify admin authentication
    const { adminId } = await verifyTokenFromRequest(request)
    
    // Get vehicle service
    const vehicleService = ServiceFactory.getVehicleService()
    const bookingService = ServiceFactory.getBookingService()
    
    // Check if vehicle exists
    const vehicle = await vehicleService.getVehicleById(id)
    if (!vehicle) {
      const response = NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
      return withCORS(response)
    }

    // Check if vehicle has any bookings
    const bookings = await bookingService.getBookingsByVehicleId(id)
    if (bookings.length > 0) {
      const response = NextResponse.json({ 
        error: 'Cannot delete vehicle with existing bookings' 
      }, { status: 400 })
      return withCORS(response)
    }

    // Delete vehicle photos and files
    if (vehicle.photos && vehicle.photos.length > 0) {
      for (const photo of vehicle.photos) {
        await deleteUploadedFile(photo.url)
        await vehicleService.deleteVehiclePhoto(photo.id)
      }
    }

    // Delete vehicle
    const deleted = await vehicleService.deleteVehicle(id)
    if (!deleted) {
      const response = NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 })
      return withCORS(response)
    }

    const response = NextResponse.json({ 
      message: 'Vehicle deleted successfully' 
    })
    return withCORS(response)
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    return withCORS(response)
  }
}