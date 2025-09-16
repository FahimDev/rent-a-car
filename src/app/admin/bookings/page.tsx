'use client'
export const runtime = "edge";
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { api } from '@/lib/api/utils'
import { getCountryFromPhone } from '@/lib/countryUtils'

interface Booking {
  id: string
  bookingDate: string
  pickupTime: string
  pickupLocation: string
  dropoffLocation?: string
  tripType: string
  status: string
  notes?: string
  createdAt: string
  passenger: {
    id: string
    name: string
    phone: string
    email?: string
    isVerified: boolean
  }
  vehicle: {
    id: string
    name: string
    type: string
  }
}

interface BookingsApiResponse {
  bookings: Booking[]
  pagination?: {
    pages: number
  }
}

export default function AdminBookings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [passengerId, setPassengerId] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      const data = await api.admin.getBookings({
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        passengerId: passengerId || undefined
      })

      setBookings(data.bookings || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, statusFilter, passengerId])

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // Get passenger ID from URL params
    const passengerParam = searchParams?.get('passenger')
    if (passengerParam) {
      setPassengerId(passengerParam)
    }

    fetchBookings()
  }, [router, currentPage, statusFilter, passengerId, fetchBookings, searchParams])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'fake':
        return 'bg-orange-100 text-orange-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passenger.phone.includes(searchTerm) ||
      (booking.passenger.email && booking.passenger.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.dropoffLocation && booking.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-mobile py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={passengerId ? "/admin/passengers" : "/admin/dashboard"}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {passengerId ? "Passengers" : "Dashboard"}
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {passengerId ? "Passenger Bookings" : "All Bookings"}
                </h1>
                <p className="text-sm text-gray-600">
                  {passengerId ? "View all bookings for this passenger" : "View and manage all bookings"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-mobile py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings by passenger, phone, email, ID, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="fake">Fake Booking</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const country = getCountryFromPhone(booking.passenger.phone)
              return (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <h3 className="font-semibold text-lg text-gray-900">
                            Booking #{booking.id}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          {booking.notes && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Has Notes
                            </span>
                          )}
                        </div>

                        {/* Passenger Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Passenger Information</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{booking.passenger.name}</span>
                                {booking.passenger.isVerified ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{booking.passenger.phone}</span>
                                {country && (
                                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
                                    <span className="text-sm">{country.flag}</span>
                                    <span className="text-xs font-medium text-blue-700">{country.name}</span>
                                  </div>
                                )}
                              </div>
                              {booking.passenger.email && (
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{booking.passenger.email}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Booking Details</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{formatDate(booking.bookingDate)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{formatTime(booking.pickupTime)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{booking.pickupLocation}</span>
                              </div>
                              {booking.dropoffLocation && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{booking.dropoffLocation}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <Car className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{booking.vehicle.name} ({booking.vehicle.type})</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {booking.notes && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Notes</h4>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-sm text-gray-700">{booking.notes}</p>
                            </div>
                          </div>
                        )}

                        {/* Trip Type */}
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Trip Type:</span> {booking.tripType} trip
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <a href={`tel:${booking.passenger.phone}`}>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No bookings found' : 'No bookings yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Bookings will appear here once passengers start making reservations.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          {/* Results info */}
          <div className="text-sm text-gray-600">
            Showing {bookings.length} bookings
            {totalPages > 1 && (
              <span className="ml-2">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-mobile"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  // Ensure pageNum is within valid range
                  if (pageNum < 1 || pageNum > totalPages) return null
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="btn-mobile w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                }).filter(Boolean)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-mobile"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}