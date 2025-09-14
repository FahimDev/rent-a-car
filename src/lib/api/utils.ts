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
  // In browser environment, always use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // For SSR, use environment variables or fallback to localhost
  return process.env.NEXT_PUBLIC_BASE_URL || 
         process.env.NEXT_PUBLIC_APP_URL || 
         'http://localhost:3000'
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
  
  console.log('🚀 [API UTILS] Making API call:', {
    endpoint,
    baseUrl,
    fullUrl: url,
    method: options.method || 'GET'
  })
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  }

  try {
    console.log('🚀 [API UTILS] Fetching URL:', url)
    const response = await fetch(url, defaultOptions)
    
    console.log('🚀 [API UTILS] Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any
      console.error('🚀 [API UTILS] Response not OK:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      })
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json() as any
    console.log('🚀 [API UTILS] Response data:', {
      success: data.success,
      hasData: !!data.data,
      dataKeys: data.data ? Object.keys(data.data) : [],
      fullData: data
    })
    return data as T
  } catch (error) {
    console.error('🚀 [API UTILS] API call failed for', endpoint, ':', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
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
    },

    async getBookingById(id: string): Promise<{ booking: any }> {
      const token = localStorage.getItem('adminToken')
      return apiCall<{ booking: any }>(`/api/admin/bookings/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    },

                async updateBooking(id: string, updateData: { status?: string; notes?: string }): Promise<{ booking: any; message: string }> {
                  const token = localStorage.getItem('adminToken')
                  return apiCall<{ booking: any; message: string }>(`/api/admin/bookings/${id}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(updateData)
                  })
                },
                async getVehicles(): Promise<{ vehicles: any[] }> {
                  const token = localStorage.getItem('adminToken')
                  return apiCall<{ vehicles: any[] }>('/api/admin/vehicles', {
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                },
                async createVehicle(formData: FormData): Promise<{ vehicle: any; message: string }> {
                  const token = localStorage.getItem('adminToken')
                  return apiCall<{ vehicle: any; message: string }>('/api/admin/vehicles', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                  })
                },
                async updateVehicle(id: string, formData: FormData): Promise<{ vehicle: any; message: string }> {
                  const token = localStorage.getItem('adminToken')
                  return apiCall<{ vehicle: any; message: string }>(`/api/admin/vehicles/${id}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                  })
                },
                async deleteVehicle(id: string): Promise<{ message: string }> {
                  const token = localStorage.getItem('adminToken')
                  return apiCall<{ message: string }>(`/api/admin/vehicles/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                },
                async setPrimaryPhoto(vehicleId: string, photoId: string): Promise<{ message: string }> {
                  const token = localStorage.getItem('adminToken')
                  return apiCall<{ message: string }>(`/api/admin/vehicles/${vehicleId}/photos/${photoId}/primary`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                },
                async deletePhoto(photoId: string): Promise<{ message: string }> {
                  const token = localStorage.getItem('adminToken')
                  return apiCall<{ message: string }>(`/api/admin/photos/${photoId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                }
              }
            }