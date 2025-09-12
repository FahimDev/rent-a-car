import { Suspense } from 'react'
import { createPrismaClient } from '@/lib/db'

export const runtime = 'edge'
import VehicleGallery from './VehicleGallery'

async function getVehicles(type?: string) {
  try {
    // Get D1 database from Cloudflare environment
    const d1Database = (globalThis as any).DB
    const prisma = createPrismaClient(d1Database)
    
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
  searchParams: Promise<{ type?: string }>
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const { type } = await searchParams
  const vehicles = await getVehicles(type)

  return <VehicleGallery vehicles={vehicles} />
}