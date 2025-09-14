import { Suspense } from 'react'
import { api } from '@/lib/api/utils'

export const runtime = 'edge'
import VehicleGallery from './VehicleGallery'

interface VehiclesPageProps {
  searchParams: Promise<{ type?: string }>
}

// Helper function to call API endpoint
async function getVehicles(type?: string) {
  try {
    const response = await api.vehicles.getAll(type)
    
    if (response.success && response.data?.vehicles) {
      return response.data.vehicles
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