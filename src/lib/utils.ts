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
  // Bangladesh phone number validation
  return cleaned.length >= 10 && cleaned.length <= 15
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
