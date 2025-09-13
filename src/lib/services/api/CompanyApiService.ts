import { apiGet, ApiResponse } from '@/lib/utils/api'

/**
 * Company information interface
 */
export interface CompanyInfo {
  id: string
  name: string
  tagline?: string
  description?: string
  phone?: string
  email?: string
  whatsapp?: string
  latitude?: number
  longitude?: number
  address?: string
}

/**
 * Company API Service
 * Centralized service for all company-related API calls
 */
export class CompanyApiService {
  /**
   * Get company information
   * @returns Promise<CompanyInfo | null> Company info or null if not found
   */
  static async getCompanyInfo(): Promise<CompanyInfo | null> {
    const response = await apiGet<ApiResponse<CompanyInfo>>('/api/company')
    
    if (!response || !response.success) {
      return null
    }
    
    return response.data || null
  }

  /**
   * Get company info with fallback data
   * @returns Promise<CompanyInfo> Company info with fallback values
   */
  static async getCompanyInfoWithFallback(): Promise<CompanyInfo> {
    const companyInfo = await this.getCompanyInfo()
    
    // Fallback data if API doesn't return data
    const fallbackCompanyInfo: CompanyInfo = {
      id: 'default',
      name: 'Rent-A-Car Bangladesh',
      tagline: 'আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন | Reliable Transportation for Your Journey',
      description: 'We provide premium car rental services across Bangladesh with professional drivers and well-maintained vehicles.',
      phone: '+8801234567893',
      email: 'info@rentacar.com',
      whatsapp: '+8801234567893',
      latitude: 23.8103,
      longitude: 90.4125,
      address: 'Dhaka, Bangladesh'
    }
    
    return companyInfo || fallbackCompanyInfo
  }
}
