/**
 * API Utility Functions
 * Centralized API calling utilities for frontend components
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Get the API base URL from environment variables
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 
         process.env.NEXT_PUBLIC_APP_URL || 
         (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
}

/**
 * Generic API call function
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * API call with error handling and fallback
 */
export async function apiCallWithFallback<T = any>(
  endpoint: string,
  fallback: T,
  options: RequestInit = {}
): Promise<T> {
  try {
    return await apiCall<T>(endpoint, options)
  } catch (error) {
    console.error(`API call failed for ${endpoint}, using fallback:`, error)
    return fallback
  }
}

/**
 * Specific API functions for common operations
 */
export const api = {
  /**
   * Company API
   */
  company: {
    async getInfo(): Promise<ApiResponse<any>> {
      return apiCall<ApiResponse<any>>('/api/company')
    }
  },

  /**
   * Vehicle API
   */
  vehicles: {
    async getAll(type?: string): Promise<ApiResponse<{ vehicles: any[] }>> {
      const endpoint = type ? `/api/vehicles?type=${encodeURIComponent(type)}` : '/api/vehicles'
      return apiCall<ApiResponse<{ vehicles: any[] }>>(endpoint)
    },

    async getById(id: string): Promise<any> {
      return apiCall<any>(`/api/vehicles/${id}`)
    }
  },

  /**
   * Booking API
   */
  bookings: {
    async create(data: any): Promise<ApiResponse<any>> {
      return apiCall<ApiResponse<any>>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    async getById(id: string): Promise<ApiResponse<any>> {
      return apiCall<ApiResponse<any>>(`/api/bookings/${id}`)
    },

    async getAll(filters?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())
      
      const queryString = params.toString()
      const endpoint = queryString ? `/api/bookings?${queryString}` : '/api/bookings'
      return apiCall<ApiResponse<any>>(endpoint)
    }
  },

  /**
   * Admin API
   */
  admin: {
    async login(credentials: { username: string; password: string }): Promise<{ message: string; token: string; admin: any }> {
      return apiCall<{ message: string; token: string; admin: any }>('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
    },

    async getStats(): Promise<{ totalBookings: number; pendingBookings: number; totalVehicles: number; totalPassengers: number }> {
      const token = localStorage.getItem('adminToken')
      return apiCall<{ totalBookings: number; pendingBookings: number; totalVehicles: number; totalPassengers: number }>('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    },

    async getBookings(filters?: { status?: string; page?: number; limit?: number }): Promise<{ bookings: any[]; pagination: any }> {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())
      
      const queryString = params.toString()
      const endpoint = queryString ? `/api/admin/bookings?${queryString}` : '/api/admin/bookings'
      
      return apiCall<{ bookings: any[]; pagination: any }>(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    },

    async getPassengers(filters?: { search?: string; verified?: boolean; page?: number; limit?: number }): Promise<{ passengers: any[]; pagination: any }> {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.verified !== undefined) params.append('verified', filters.verified.toString())
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())
      
      const queryString = params.toString()
      const endpoint = queryString ? `/api/admin/passengers?${queryString}` : '/api/admin/passengers'
      
      return apiCall<{ passengers: any[]; pagination: any }>(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    }
  }
}
