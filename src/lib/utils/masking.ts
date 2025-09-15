/**
 * Masking utility for sensitive passenger information
 * Used on public pages like booking success to protect privacy
 */

/**
 * Mask a phone number
 * Format: +88 + first 4 digits + asterisks + last 2 digits
 * Example: +8801712345677 -> +880171*****77
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return ''
  
  // Remove any non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  
  // Handle Bangladesh phone numbers (+880)
  if (cleanPhone.startsWith('+880') && cleanPhone.length >= 13) {
    const countryCode = '+880'
    const firstFour = cleanPhone.substring(4, 8) // 0171
    const lastTwo = cleanPhone.substring(cleanPhone.length - 2) // 77
    const middleLength = cleanPhone.length - 6 // Calculate how many digits to mask
    
    return `${countryCode}${firstFour}${'*'.repeat(middleLength)}${lastTwo}`
  }
  
  // Handle other international numbers or fallback
  if (cleanPhone.length >= 8) {
    const firstFour = cleanPhone.substring(0, 4)
    const lastTwo = cleanPhone.substring(cleanPhone.length - 2)
    const middleLength = cleanPhone.length - 6
    
    return `${firstFour}${'*'.repeat(middleLength)}${lastTwo}`
  }
  
  // For very short numbers, just mask the middle
  if (cleanPhone.length >= 4) {
    const first = cleanPhone.substring(0, 1)
    const last = cleanPhone.substring(cleanPhone.length - 1)
    const middleLength = cleanPhone.length - 2
    
    return `${first}${'*'.repeat(middleLength)}${last}`
  }
  
  return phone // Return original if too short to mask meaningfully
}

/**
 * Mask a name
 * For long names: Show first 2 chars + asterisks + last 2 chars of each word
 * For short names: Show first char + asterisks + last char
 * 
 * Examples:
 * "Ariful Islam Fahim" -> "Ar***l Is**m Fa**m"
 * "Ela" -> "E*A"
 * "John" -> "Jo**n"
 */
export function maskName(name: string): string {
  if (!name) return ''
  
  const trimmedName = name.trim()
  const words = trimmedName.split(/\s+/)
  
  return words.map(word => {
    if (word.length <= 2) {
      // For very short words, just return the word
      return word
    } else if (word.length === 3) {
      // For 3-letter words: E*A
      return `${word[0]}*${word[2]}`
    } else if (word.length === 4) {
      // For 4-letter words: Jo**n
      return `${word[0]}${word[1]}**${word[3]}`
    } else {
      // For longer words: Ar***l
      const firstTwo = word.substring(0, 2)
      const lastChar = word.substring(word.length - 1)
      const middleLength = word.length - 3
      
      return `${firstTwo}${'*'.repeat(middleLength)}${lastChar}`
    }
  }).join(' ')
}

/**
 * Mask email address
 * Show first 2 chars + asterisks + domain
 * Example: john.doe@example.com -> jo******@example.com
 */
export function maskEmail(email: string): string {
  if (!email) return ''
  
  const [localPart, domain] = email.split('@')
  
  if (!localPart || !domain) return email
  
  if (localPart.length <= 2) {
    return `${localPart}@${domain}`
  }
  
  const firstTwo = localPart.substring(0, 2)
  const asterisks = '*'.repeat(localPart.length - 2)
  
  return `${firstTwo}${asterisks}@${domain}`
}

/**
 * Apply masking to passenger data for public display
 */
export function maskPassengerData(passenger: {
  name?: string
  phone?: string
  email?: string
}): {
  name: string
  phone: string
  email: string
} {
  return {
    name: maskName(passenger.name || ''),
    phone: maskPhoneNumber(passenger.phone || ''),
    email: maskEmail(passenger.email || '')
  }
}
