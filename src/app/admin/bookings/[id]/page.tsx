'use client'
export const runtime = "edge";
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  Square
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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
    capacity: number
    photos?: {
      id: string
      url: string
      alt: string
    }[]
  }
  notifications?: {
    id: string
    type: string
    status: string
    message?: string
    sentAt?: string
  }[]
}

interface BookingApiResponse {
  booking: Booking
}

export default function BookingDetail() {
  const router = useRouter()
  const params = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [showStatusModal, setShowStatusModal] = useState(false)

  const fetchBooking = useCallback(async () => {
    try {
      const data = await api.admin.getBookingById(params.id as string)
      setBooking(data.booking)
      setStatus(data.booking.status)
      setNotes(data.booking.notes || '')
    } catch (error) {
      console.error('Error fetching booking:', error)
      toast.error('Failed to load booking details')
      router.push('/admin/bookings')
    } finally {
      setIsLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchBooking()
  }, [router, params.id, fetchBooking])

  const handleUpdateBooking = async () => {
    if (!booking) return

    setIsUpdating(true)
    try {
      await api.admin.updateBooking(params.id as string, {
        status,
        notes
      })
      
      // Show enhanced success message for confirmed and fake bookings
      if (status === 'confirmed') {
        toast.success('Booking confirmed successfully! Phone number has been automatically verified.')
      } else if (status === 'fake') {
        toast.success('Booking marked as fake! Phone number has been automatically unverified.')
      } else {
        toast.success('Booking updated successfully')
      }
      
      fetchBooking() // Refresh data
      setShowStatusModal(false) // Close modal
    } catch (error) {
      console.error('Error updating booking:', error)
      toast.error('Failed to update booking')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleQuickStatusUpdate = async (newStatus: string) => {
    if (!booking) return

    setIsUpdating(true)
    try {
      await api.admin.updateBooking(params.id as string, {
        status: newStatus,
        notes: booking.notes // Keep existing notes
      })
      
      // Show enhanced success message for confirmed and fake bookings
      if (newStatus === 'confirmed') {
        toast.success(`Booking confirmed successfully! Phone number has been automatically verified.`)
      } else if (newStatus === 'fake') {
        toast.success(`Booking marked as fake! Phone number has been automatically unverified.`)
      } else {
        toast.success(`Booking ${newStatus} successfully`)
      }
      
      fetchBooking() // Refresh data
      setShowStatusModal(false) // Close modal
    } catch (error) {
      console.error('Error updating booking:', error)
      toast.error('Failed to update booking')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
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
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">
              The booking you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/admin/bookings">
              <Button className="btn-mobile">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-mobile py-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm" className="btn-mobile">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Bookings
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Booking Details</h1>
                <p className="text-xs sm:text-sm text-gray-600">Booking ID: {booking.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a href={`tel:${booking.passenger.phone}`}>
                <Button 
                  size="sm" 
                  className={`relative bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 btn-mobile ${
                    booking.status === 'pending' 
                      ? 'shadow-lg shadow-blue-500/50 animate-pulse' 
                      : ''
                  }`}
                  style={booking.status === 'pending' ? {
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)'
                  } : {}}
                >
                  {booking.status === 'pending' && (
                    <div className="absolute inset-0 bg-blue-400 rounded-md animate-ping opacity-60" style={{
                      boxShadow: '0 0 15px rgba(96, 165, 250, 0.8)'
                    }}></div>
                  )}
                  <div className="relative flex items-center justify-center sm:justify-start">
                    <Phone className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Call</span>
                  </div>
                </Button>
              </a>
              <a href={`https://wa.me/${booking.passenger.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="sm" 
                  className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 btn-mobile"
                >
                  <div className="flex items-center justify-center sm:justify-start">
                    <svg className="h-4 w-4 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span className="hidden sm:inline">WhatsApp</span>
                  </div>
                </Button>
              </a>
              {(() => {
                const country = getCountryFromPhone(booking.passenger.phone)
                return country ? (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md">
                    <span className="text-sm">{country.flag}</span>
                    <span className="text-xs font-medium text-gray-700 hidden sm:inline">{country.name}</span>
                  </div>
                ) : null
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="container-mobile py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                    <p className="text-base sm:text-lg font-semibold">{formatDate(booking.bookingDate)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Pickup Time</Label>
                    <p className="text-base sm:text-lg font-semibold">{formatTime(booking.pickupTime)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Trip Type</Label>
                    <p className="text-base sm:text-lg font-semibold capitalize">{booking.tripType} Trip</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {getStatusIcon(booking.status)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Pickup Location</Label>
                  <p className="text-base sm:text-lg font-semibold break-words">{booking.pickupLocation}</p>
                </div>
                
                {booking.dropoffLocation && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Drop-off Location</Label>
                    <p className="text-base sm:text-lg font-semibold break-words">{booking.dropoffLocation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Passenger Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Passenger Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="text-base sm:text-lg font-semibold break-words">{booking.passenger.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <div className="flex items-center space-x-2">
                      <p className="text-base sm:text-lg font-semibold">{booking.passenger.phone}</p>
                    </div>
                  </div>
                  {(() => {
                    const country = getCountryFromPhone(booking.passenger.phone)
                    return country ? (
                      <div className="sm:col-span-2">
                        <Label className="text-sm font-medium text-gray-600">Country Information</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <span className="text-2xl">{country.flag}</span>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{country.name}</p>
                              <p className="text-xs text-gray-600">Country Code: {country.code}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null
                  })()}
                  {booking.passenger.email && (
                    <div className="sm:col-span-2">
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-base sm:text-lg font-semibold break-words">{booking.passenger.email}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Verification Status</Label>
                    <div className="flex items-center space-x-2">
                      {booking.passenger.isVerified ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {booking.vehicle.photos && booking.vehicle.photos.length > 0 ? (
                    <Image 
                      src={booking.vehicle.photos[0].url} 
                      alt={booking.vehicle.photos[0].alt}
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Car className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold break-words">{booking.vehicle.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600 capitalize">{booking.vehicle.type}</p>
                    <p className="text-sm sm:text-base text-gray-600">{booking.vehicle.capacity} seats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Update booking status with one tap</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Status Display */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Current Status</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    {getStatusIcon(booking.status)}
                  </div>
                </div>

                {/* Quick Status Update Button */}
                <Button 
                  onClick={() => setShowStatusModal(true)}
                  className="w-full btn-mobile h-12 text-lg font-semibold"
                  size="lg"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Change Status
                </Button>

                {/* Notes Section */}
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this booking..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 btn-mobile"
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleUpdateBooking}
                  disabled={isUpdating}
                  variant="outline"
                  className="w-full btn-mobile"
                >
                  {isUpdating ? 'Updating...' : 'Update Notes'}
                </Button>
              </CardContent>
            </Card>

            {/* Booking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Booking Created</p>
                      <p className="text-xs text-gray-600">{formatDate(booking.createdAt)}</p>
                    </div>
                  </div>
                  
                  {booking.notifications && booking.notifications.length > 0 ? (
                    booking.notifications.map((notification) => (
                      <div key={notification.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          notification.status === 'sent' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">
                            {notification.type === 'whatsapp' ? 'WhatsApp Notification' : 'Notification'} 
                            {notification.status === 'sent' ? ' Sent' : ' Pending'}
                          </p>
                          {notification.sentAt && (
                            <p className="text-xs text-gray-600">{formatDate(notification.sentAt)}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No notifications sent</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Update Booking Status</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-3">
                {/* Pending Status */}
                <Button
                  onClick={() => handleQuickStatusUpdate('pending')}
                  disabled={isUpdating || booking?.status === 'pending'}
                  className={`w-full h-16 text-lg font-semibold flex items-center justify-center space-x-3 ${
                    booking?.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  <AlertCircle className="h-6 w-6" />
                  <span>Mark as Pending</span>
                </Button>

                {/* Confirmed Status */}
                <Button
                  onClick={() => handleQuickStatusUpdate('confirmed')}
                  disabled={isUpdating || booking?.status === 'confirmed'}
                  className={`w-full h-16 text-lg font-semibold flex items-center justify-center space-x-3 ${
                    booking?.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800 border-green-300' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <CheckCircle className="h-6 w-6" />
                  <span>Confirm Booking</span>
                </Button>

                {/* Completed Status */}
                <Button
                  onClick={() => handleQuickStatusUpdate('completed')}
                  disabled={isUpdating || booking?.status === 'completed'}
                  className={`w-full h-16 text-lg font-semibold flex items-center justify-center space-x-3 ${
                    booking?.status === 'completed' 
                      ? 'bg-blue-100 text-blue-800 border-blue-300' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Square className="h-6 w-6" />
                  <span>Mark as Completed</span>
                </Button>

                {/* Cancelled Status */}
                <Button
                  onClick={() => handleQuickStatusUpdate('cancelled')}
                  disabled={isUpdating || booking?.status === 'cancelled'}
                  className={`w-full h-16 text-lg font-semibold flex items-center justify-center space-x-3 ${
                    booking?.status === 'cancelled' 
                      ? 'bg-red-100 text-red-800 border-red-300' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <XCircle className="h-6 w-6" />
                  <span>Cancel Booking</span>
                </Button>

                {/* Fake Booking Status */}
                <Button
                  onClick={() => handleQuickStatusUpdate('fake')}
                  disabled={isUpdating || booking?.status === 'fake'}
                  className={`w-full h-16 text-lg font-semibold flex items-center justify-center space-x-3 ${
                    booking?.status === 'fake' 
                      ? 'bg-orange-100 text-orange-800 border-orange-300' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  <AlertTriangle className="h-6 w-6" />
                  <span>Mark as Fake Booking</span>
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                  className="w-full btn-mobile"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}