'use client'
export const runtime = "edge";
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Search, 
  Filter, 
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  XCircle,
  Calendar,
  Car
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { api } from '@/lib/api/utils'

interface Passenger {
  id: string
  name: string
  phone: string
  email?: string
  isVerified: boolean
  createdAt: string
  bookings: {
    id: string
    bookingDate: string
    status: string
    notes?: string
    vehicle: {
      name: string
      type: string
    }
  }[]
}

interface PassengersApiResponse {
  passengers: Passenger[]
  pagination?: {
    pages: number
  }
}

export default function AdminPassengers() {
  const router = useRouter()
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [verificationFilter, setVerificationFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPassengers = useCallback(async () => {
    try {
      const data = await api.admin.getPassengers({
        page: currentPage,
        limit: 10,
        verified: verificationFilter !== 'all' ? verificationFilter === 'true' : undefined
      })

      setPassengers(data.passengers || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      toast.error('Failed to load passengers')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, verificationFilter])

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchPassengers()
  }, [router, currentPage, verificationFilter, fetchPassengers])

  const handleVerificationToggle = async (passengerId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/passengers', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          passengerId,
          isVerified: !currentStatus
        })
      })

      if (response.ok) {
        toast.success(`Passenger ${!currentStatus ? 'verified' : 'unverified'} successfully`)
        fetchPassengers() // Refresh data
      } else {
        toast.error('Failed to update verification status')
      }
    } catch (error) {
      toast.error('Failed to update verification status')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredPassengers = passengers.filter(passenger => {
    const matchesSearch = 
      passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.phone.includes(searchTerm) ||
      (passenger.email && passenger.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading passengers...</p>
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
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Passenger Management</h1>
                <p className="text-sm text-gray-600">View and manage all passengers</p>
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
                  placeholder="Search passengers by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Passengers</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Passengers List */}
        {filteredPassengers.length > 0 ? (
          <div className="space-y-4">
            {filteredPassengers.map((passenger) => (
              <Card key={passenger.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {passenger.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {passenger.isVerified ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Verified
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{passenger.phone}</span>
                        </div>
                        {passenger.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{passenger.email}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Joined {formatDate(passenger.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2" />
                          <span>{passenger.bookings.length} booking{passenger.bookings.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      
                      {/* Recent Bookings */}
                      {passenger.bookings.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Bookings:</h4>
                          <div className="space-y-2">
                            {passenger.bookings.slice(0, 3).map((booking) => (
                              <Link 
                                key={booking.id} 
                                href={`/admin/bookings/${booking.id}`}
                                className="block p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-gray-600">{formatDate(booking.bookingDate)}</span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-600">{booking.vehicle.name}</span>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'fake' ? 'bg-orange-100 text-orange-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </div>
                                {booking.notes && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    <span className="font-medium">Notes:</span> {booking.notes}
                                  </div>
                                )}
                              </Link>
                            ))}
                            {passenger.bookings.length > 3 && (
                              <Link 
                                href={`/admin/bookings?passenger=${passenger.id}`}
                                className="block p-2 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors text-center"
                              >
                                <p className="text-xs text-gray-500">
                                  +{passenger.bookings.length - 3} more booking{passenger.bookings.length - 3 !== 1 ? 's' : ''} (click to view all)
                                </p>
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerificationToggle(passenger.id, passenger.isVerified)}
                      >
                        {passenger.isVerified ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Unverify
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </>
                        )}
                      </Button>
                      <a href={`tel:${passenger.phone}`}>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </a>
                      <a href={`https://wa.me/${passenger.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || verificationFilter !== 'all' ? 'No passengers found' : 'No passengers yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || verificationFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Passengers will appear here once they start making bookings.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          {/* Results info */}
          <div className="text-sm text-gray-600">
            Showing {passengers.length} passengers
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