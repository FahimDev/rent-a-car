'use client'

import { useState } from 'react'
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
import Image from 'next/image'
import { VEHICLE_TYPES } from '@/types'

interface Vehicle {
  id: string
  name: string
  type: string
  capacity: number
  pricePerDay: number
  description: string | null
  features: string | null
  isAvailable: boolean
  photos: {
    id: string
    url: string
    alt: string | null
    isPrimary: boolean
    order: number
  }[]
}

interface VehicleGalleryProps {
  vehicles: Vehicle[]
}

function getVehicleIcon(type: string) {
  switch (type) {
    case 'sedan':
      return '🚗'
    case 'noah':
      return '🚐'
    case 'hiace':
      return '🚌'
    default:
      return '🚗'
  }
}

export default function VehicleGallery({ vehicles }: VehicleGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.description && vehicle.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = !selectedType || vehicle.type === selectedType
    return matchesSearch && matchesType && vehicle.isAvailable
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-mobile py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Our Vehicle Fleet</h1>
              <p className="text-gray-600 mt-1">Choose your perfect ride</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container-mobile py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-mobile"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent input-mobile"
                >
                  <option value="">All Types</option>
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="card-mobile overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {vehicle.photos.length > 0 ? (
                    <Image 
                      src={vehicle.photos[0].url} 
                      alt={vehicle.photos[0].alt || vehicle.name}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ display: vehicle.photos.length > 0 ? 'none' : 'flex' }}
                  >
                    <span className="text-6xl">{getVehicleIcon(vehicle.type)}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                      {vehicle.capacity} Seats
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                      {getVehicleIcon(vehicle.type)}
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {vehicle.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        {VEHICLE_TYPES.find(t => t.id === vehicle.type)?.name || vehicle.type}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ৳{vehicle.pricePerDay.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per day</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {vehicle.description || 'No description available'}
                  </p>

                  {/* Features */}
                  {vehicle.features && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(vehicle.features).slice(0, 3).map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {feature}
                          </span>
                        ))}
                        {JSON.parse(vehicle.features).length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{JSON.parse(vehicle.features).length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Vehicle Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{vehicle.capacity} passengers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>4.8</span>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <Link href={`/booking?vehicle=${vehicle.id}`}>
                    <Button className="w-full btn-mobile group-hover:bg-blue-600 transition-colors">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedType('')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
