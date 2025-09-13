import { Suspense } from 'react'

export const runtime = 'edge'
import VehicleGallery from './VehicleGallery'
import { VehicleApiService } from '@/lib/services/api/VehicleApiService'

interface VehiclesPageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const { type } = await searchParams
  const vehicles = await VehicleApiService.getAvailableVehicles(type)

  return <VehicleGallery vehicles={vehicles} />
}