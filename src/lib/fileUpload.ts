import { NextRequest } from 'next/server'

// Edge-compatible file upload utilities
// For Edge runtime, we'll store images as base64 data URLs in the database
// In production, you would upload to Cloudflare R2 or similar service

export async function saveUploadedFile(file: File, vehicleId: string, index: number): Promise<string> {
  try {
    // Convert file to base64 data URL for Edge runtime compatibility
    const bytes = await file.arrayBuffer()
    const uint8Array = new Uint8Array(bytes)
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    const base64 = btoa(binary)
    const mimeType = file.type || 'image/jpeg'
    
    // Return data URL
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Error saving file:', error)
    throw new Error('Failed to save uploaded file')
  }
}

export async function deleteUploadedFile(filePath: string): Promise<void> {
  try {
    // For Edge runtime, file deletion is not supported
    // Data URLs are stored in the database and will be cleaned up when the record is deleted
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