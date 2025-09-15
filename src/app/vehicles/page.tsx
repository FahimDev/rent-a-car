'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api/utils'
import { VehicleGridSkeleton, VehicleLoader } from '@/components/ui/VehicleLoader'
import VehicleGallery from './VehicleGallery'

export const runtime = 'edge'

interface VehiclesPageProps {
  searchParams: Promise<{ type?: string }>
}

// Helper function to call API endpoint
async function getVehicles(type?: string) {
  console.log('🚀 [VEHICLES PAGE] Starting vehicles fetch...', { type })
  
  try {
    console.log('🚀 [VEHICLES PAGE] Calling api.vehicles.getAll()...')
    const response = await api.vehicles.getAll(type)
    console.log('🚀 [VEHICLES PAGE] Vehicles API response:', {
      success: response.success,
      hasData: !!response.data,
      vehiclesCount: response.data?.vehicles?.length || 0,
      fullResponse: response
    })
    
    if (response.success && response.data?.vehicles) {
      console.log('🚀 [VEHICLES PAGE] Using API data for vehicles')
      return response.data.vehicles
    }
    
    console.log('🚀 [VEHICLES PAGE] No vehicles data from API, returning empty array')
    return []
  } catch (error) {
    console.error('🚀 [VEHICLES PAGE] Error fetching vehicles:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    console.log('🚀 [VEHICLES PAGE] Returning empty array due to error')
    return []
  }
}

function VehiclesPageContent() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState<string>('')

  useEffect(() => {
    const loadVehicles = async () => {
      console.log('🚀 [VEHICLES PAGE] useEffect - Loading vehicles...')
      const vehicleType = searchParams?.get('type') || ''
      setType(vehicleType)
      
      try {
        const vehiclesData = await getVehicles(vehicleType)
        console.log('🚀 [VEHICLES PAGE] Vehicles loaded:', {
          vehiclesCount: vehiclesData.length,
          type: vehicleType
        })
        setVehicles(vehiclesData)
      } catch (error) {
        console.error('🚀 [VEHICLES PAGE] Error loading vehicles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [searchParams])

  return <VehicleGallery vehicles={vehicles} loading={loading} />
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    }>
      <VehiclesPageContent />
    </Suspense>
  )
}