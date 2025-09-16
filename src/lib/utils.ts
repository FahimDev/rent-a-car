import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Add country code if not present
  if (cleaned.length === 10 && !cleaned.startsWith('880')) {
    return `+880${cleaned}`
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('01')) {
    return `+880${cleaned}`
  }
  
  return phone.startsWith('+') ? phone : `+${cleaned}`
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Special validation for Bangladesh phone numbers
  if (cleaned.startsWith('880')) {
    // Bangladesh: +880 followed by 10 digits (total 13 digits)
    // After removing +880, should have exactly 10 digits
    const bdNumber = cleaned.substring(3) // Remove 880
    return bdNumber.length === 10 && bdNumber.startsWith('1')
  }
  
  // International phone number validation (7-15 digits)
  return cleaned.length >= 7 && cleaned.length <= 15
}

export function getPhoneValidationMessage(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  // Special validation for Bangladesh phone numbers
  if (cleaned.startsWith('880')) {
    const bdNumber = cleaned.substring(3) // Remove 880
    if (bdNumber.length < 10) {
      return 'Bangladesh phone number must have 10 digits after the country code'
    }
    if (bdNumber.length > 10) {
      return 'Bangladesh phone number should have exactly 10 digits after the country code'
    }
    if (!bdNumber.startsWith('1')) {
      return 'Bangladesh mobile numbers should start with 1'
    }
  }
  
  return ''
}

export function generateBookingReference(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `RC${timestamp}${random}`.toUpperCase()
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}
