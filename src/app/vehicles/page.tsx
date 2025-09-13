import { Suspense } from 'react'

export const runtime = 'edge'
import VehicleGallery from './VehicleGallery'

interface VehiclesPageProps {
  searchParams: Promise<{ type?: string }>
}

// Helper function to call API endpoint directly
async function getVehicles(type?: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const url = type ? `${baseUrl}/api/vehicles?type=${encodeURIComponent(type)}` : `${baseUrl}/api/vehicles`
    
    const response = await fetch(url, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles')
    }
    
    const data = await response.json() as any
    
    if (data.success && data.data?.vehicles) {
      return data.data.vehicles
    }
    
    return []
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return []
  }
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const { type } = await searchParams
  const vehicles = await getVehicles(type)

  return <VehicleGallery vehicles={vehicles} />
}