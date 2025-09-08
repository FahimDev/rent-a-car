import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import VehicleGallery from './VehicleGallery'

async function getVehicles(type?: string) {
  try {
    const where = type ? { isAvailable: true, type } : { isAvailable: true }
    const vehicles = await prisma.vehicle.findMany({
      where,
      include: { 
        photos: true,
        bookings: {
          where: {
            status: { in: ['confirmed', 'pending'] }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return vehicles
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return []
  }
}

interface VehiclesPageProps {
  searchParams: { type?: string }
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const vehicles = await getVehicles(searchParams.type)

  return <VehicleGallery vehicles={vehicles} />
}