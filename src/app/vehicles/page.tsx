import { Suspense } from 'react'

export const runtime = 'edge'
import VehicleGallery from './VehicleGallery'

async function getVehicles(type?: string) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/vehicles`)
    if (type) {
      url.searchParams.set('type', type)
    }
    
    const response = await fetch(url.toString(), {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles')
    }
    
    const data = await response.json()
    // Handle new API response format: { success: true, data: { vehicles }, count: number }
    return data.data?.vehicles || data.vehicles || []
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return []
  }
}

interface VehiclesPageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const { type } = await searchParams
  const vehicles = await getVehicles(type)

  return <VehicleGallery vehicles={vehicles} />
}