// Country code mapping for phone numbers
const COUNTRY_CODES: Record<string, { name: string; flag: string; code: string }> = {
  '880': { name: 'Bangladesh', flag: '🇧🇩', code: 'BD' },
  '1': { name: 'United States/Canada', flag: '🇺🇸🇨🇦', code: 'US/CA' },
  '44': { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  '91': { name: 'India', flag: '🇮🇳', code: 'IN' },
  '61': { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  '49': { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  '33': { name: 'France', flag: '🇫🇷', code: 'FR' },
  '39': { name: 'Italy', flag: '🇮🇹', code: 'IT' },
  '34': { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  '81': { name: 'Japan', flag: '🇯🇵', code: 'JP' },
  '82': { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
  '86': { name: 'China', flag: '🇨🇳', code: 'CN' },
  '65': { name: 'Singapore', flag: '🇸🇬', code: 'SG' },
  '60': { name: 'Malaysia', flag: '🇲🇾', code: 'MY' },
  '66': { name: 'Thailand', flag: '🇹🇭', code: 'TH' },
  '62': { name: 'Indonesia', flag: '🇮🇩', code: 'ID' },
  '63': { name: 'Philippines', flag: '🇵🇭', code: 'PH' },
  '84': { name: 'Vietnam', flag: '🇻🇳', code: 'VN' },
  '971': { name: 'UAE', flag: '🇦🇪', code: 'AE' },
  '966': { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SA' },
  '20': { name: 'Egypt', flag: '🇪🇬', code: 'EG' },
  '27': { name: 'South Africa', flag: '🇿🇦', code: 'ZA' },
  '234': { name: 'Nigeria', flag: '🇳🇬', code: 'NG' },
  '254': { name: 'Kenya', flag: '🇰🇪', code: 'KE' },
  '233': { name: 'Ghana', flag: '🇬🇭', code: 'GH' },
  '212': { name: 'Morocco', flag: '🇲🇦', code: 'MA' },
  '213': { name: 'Algeria', flag: '🇩🇿', code: 'DZ' },
  '216': { name: 'Tunisia', flag: '🇹🇳', code: 'TN' },
  '218': { name: 'Libya', flag: '🇱🇾', code: 'LY' },
  '249': { name: 'Sudan', flag: '🇸🇩', code: 'SD' },
  '251': { name: 'Ethiopia', flag: '🇪🇹', code: 'ET' },
  '256': { name: 'Uganda', flag: '🇺🇬', code: 'UG' },
  '255': { name: 'Tanzania', flag: '🇹🇿', code: 'TZ' },
  '250': { name: 'Rwanda', flag: '🇷🇼', code: 'RW' },
  '257': { name: 'Burundi', flag: '🇧🇮', code: 'BI' },
  '265': { name: 'Malawi', flag: '🇲🇼', code: 'MW' },
  '260': { name: 'Zambia', flag: '🇿🇲', code: 'ZM' },
  '263': { name: 'Zimbabwe', flag: '🇿🇼', code: 'ZW' },
  '267': { name: 'Botswana', flag: '🇧🇼', code: 'BW' },
  '264': { name: 'Namibia', flag: '🇳🇦', code: 'NA' },
  '268': { name: 'Swaziland', flag: '🇸🇿', code: 'SZ' },
  '266': { name: 'Lesotho', flag: '🇱🇸', code: 'LS' },
  '261': { name: 'Madagascar', flag: '🇲🇬', code: 'MG' },
  '230': { name: 'Mauritius', flag: '🇲🇺', code: 'MU' },
  '248': { name: 'Seychelles', flag: '🇸🇨', code: 'SC' },
  '269': { name: 'Comoros', flag: '🇰🇲', code: 'KM' },
  '253': { name: 'Djibouti', flag: '🇩🇯', code: 'DJ' },
  '252': { name: 'Somalia', flag: '🇸🇴', code: 'SO' },
  '291': { name: 'Eritrea', flag: '🇪🇷', code: 'ER' },
  '211': { name: 'South Sudan', flag: '🇸🇸', code: 'SS' },
  '236': { name: 'Central African Republic', flag: '🇨🇫', code: 'CF' },
  '235': { name: 'Chad', flag: '🇹🇩', code: 'TD' },
  '227': { name: 'Niger', flag: '🇳🇪', code: 'NE' },
  '223': { name: 'Mali', flag: '🇲🇱', code: 'ML' },
  '226': { name: 'Burkina Faso', flag: '🇧🇫', code: 'BF' },
  '225': { name: 'Côte d\'Ivoire', flag: '🇨🇮', code: 'CI' },
  '231': { name: 'Liberia', flag: '🇱🇷', code: 'LR' },
  '232': { name: 'Sierra Leone', flag: '🇸🇱', code: 'SL' },
  '224': { name: 'Guinea', flag: '🇬🇳', code: 'GN' },
  '245': { name: 'Guinea-Bissau', flag: '🇬🇼', code: 'GW' },
  '220': { name: 'Gambia', flag: '🇬🇲', code: 'GM' },
  '221': { name: 'Senegal', flag: '🇸🇳', code: 'SN' },
  '222': { name: 'Mauritania', flag: '🇲🇷', code: 'MR' },
  '238': { name: 'Cape Verde', flag: '🇨🇻', code: 'CV' },
  '239': { name: 'São Tomé and Príncipe', flag: '🇸🇹', code: 'ST' },
  '240': { name: 'Equatorial Guinea', flag: '🇬🇶', code: 'GQ' },
  '241': { name: 'Gabon', flag: '🇬🇦', code: 'GA' },
  '242': { name: 'Republic of the Congo', flag: '🇨🇬', code: 'CG' },
  '243': { name: 'Democratic Republic of the Congo', flag: '🇨🇩', code: 'CD' },
  '244': { name: 'Angola', flag: '🇦🇴', code: 'AO' },
  '237': { name: 'Cameroon', flag: '🇨🇲', code: 'CM' }
}

/**
 * Extract country code from phone number
 */
function extractCountryCode(phone: string): string | null {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Remove leading + if present
  const withoutPlus = cleaned.startsWith('+') ? cleaned.substring(1) : cleaned
  
  // Check for multi-digit country codes first (longest first)
  const sortedCodes = Object.keys(COUNTRY_CODES).sort((a, b) => b.length - a.length)
  
  for (const code of sortedCodes) {
    if (withoutPlus.startsWith(code)) {
      return code
    }
  }
  
  return null
}

/**
 * Get country information from phone number
 */
export function getCountryFromPhone(phone: string): { name: string; flag: string; code: string } | null {
  const countryCode = extractCountryCode(phone)
  
  if (!countryCode) {
    return null
  }
  
  return COUNTRY_CODES[countryCode] || null
}

/**
 * Format phone number with country flag and name
 */
export function formatPhoneWithCountry(phone: string): {
  formatted: string
  country: { name: string; flag: string; code: string } | null
} {
  const country = getCountryFromPhone(phone)
  
  return {
    formatted: phone,
    country
  }
}
