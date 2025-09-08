import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest } from 'next/server'

export async function saveUploadedFile(file: File, vehicleId: string, index: number): Promise<string> {
  try {
    // Create the uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'images', 'vehicles')
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${vehicleId}_${index}_${Date.now()}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)
    
    // Save file to filesystem
    await writeFile(filePath, buffer)
    
    // Return the public URL path
    return `/images/vehicles/${fileName}`
  } catch (error) {
    console.error('Error saving file:', error)
    throw new Error('Failed to save uploaded file')
  }
}

export async function deleteUploadedFile(filePath: string): Promise<void> {
  try {
    const { unlink } = await import('fs/promises')
    const fullPath = join(process.cwd(), 'public', filePath)
    await unlink(fullPath)
  } catch (error) {
    console.error('Error deleting file:', error)
    // Don't throw error for file deletion failures
  }
}

export function validateImageFile(file: File): boolean {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return false
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return false
  }
  
  return true
}
