import { NextRequest } from 'next/server'

// Edge-compatible file upload utilities
// For Cloudflare Pages, we'll use a simplified approach

export async function saveUploadedFile(file: File, vehicleId: string, index: number): Promise<string> {
  try {
    // For Edge runtime, we'll generate a placeholder URL
    // In production, you would upload to Cloudflare R2 or similar service
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${vehicleId}_${index}_${Date.now()}.${fileExtension}`
    
    // Return a placeholder URL - in production this would be the actual uploaded file URL
    return `/images/vehicles/${fileName}`
  } catch (error) {
    console.error('Error saving file:', error)
    throw new Error('Failed to save uploaded file')
  }
}

export async function deleteUploadedFile(filePath: string): Promise<void> {
  try {
    // For Edge runtime, file deletion is not supported
    // In production, you would delete from Cloudflare R2 or similar service
    console.log('File deletion not supported in Edge runtime:', filePath)
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