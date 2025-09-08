import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Car, 
  Search, 
  Filter, 
  Users, 
  Calendar,
  MapPin,
  Star,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { VEHICLE_TYPES } from '@/types'

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

  const getVehicleTypeInfo = (type: string) => {
    return VEHICLE_TYPES.find(t => t.id === type) || VEHICLE_TYPES[0]
  }

  const getVehicleIcon = (type: string) => {
    const typeInfo = getVehicleTypeInfo(type)
    return typeInfo.icon
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-mobile py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Our Fleet</h1>
                <p className="text-sm text-gray-600">Choose your perfect ride</p>
              </div>
            </div>
            <Link href="/booking">
              <Button className="btn-mobile">
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-mobile py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filter by Vehicle Type</h2>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VEHICLE_TYPES.map((type) => (
              <Link
                key={type.id}
                href={searchParams.type === type.id ? '/vehicles' : `/vehicles?type=${type.id}`}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  searchParams.type === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.capacity} Seats</p>
                  <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {searchParams.type ? `${getVehicleTypeInfo(searchParams.type).name}s` : 'All Vehicles'}
            </h2>
            <span className="text-sm text-gray-600">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>

        {/* Vehicles Grid */}
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="card-mobile overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {vehicle.photos.length > 0 ? (
                    <img 
                      src={vehicle.photos[0].url} 
                      alt={vehicle.photos[0].alt || vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">{getVehicleIcon(vehicle.type)}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                      {vehicle.capacity} Seats
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-primary-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                      {vehicle.type.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{vehicle.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{vehicle.type}</p>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium ml-1">4.8</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {vehicle.description}
                  </p>
                  
                  {vehicle.features && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(vehicle.features).slice(0, 3).map((feature: string, index: number) => (
                          <span 
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {JSON.parse(vehicle.features).length > 3 && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            +{JSON.parse(vehicle.features).length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{vehicle.capacity} passengers</span>
                    </div>
                    <Link href={`/booking?vehicle=${vehicle.id}`}>
                      <Button size="sm" className="btn-mobile">
                        Select Vehicle
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600 mb-6">
              {searchParams.type 
                ? `No ${getVehicleTypeInfo(searchParams.type).name.toLowerCase()}s available at the moment.`
                : 'No vehicles available at the moment.'
              }
            </p>
            <Link href="/vehicles">
              <Button variant="outline">
                View All Vehicles
              </Button>
            </Link>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-black rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Book Your Ride?</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Choose from our well-maintained vehicles and enjoy a comfortable journey across Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="btn-mobile bg-primary-600 text-white hover:bg-primary-700">
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="btn-mobile border-white text-white hover:bg-white hover:text-black">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
