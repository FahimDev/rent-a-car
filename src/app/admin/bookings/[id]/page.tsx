'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

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
    photos: {
      id: string
      url: string
      alt: string
    }[]
  }
  notifications: {
    id: string
    type: string
    status: string
    message?: string
    sentAt?: string
  }[]
}

export default function BookingDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchBooking()
  }, [router, params.id])

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setBooking(data.booking)
        setStatus(data.booking.status)
        setNotes(data.booking.notes || '')
      } else {
        toast.error('Failed to fetch booking details')
        router.push('/admin/bookings')
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
      toast.error('Failed to load booking details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateBooking = async () => {
    if (!booking) return

    setIsUpdating(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          notes
        })
      })

      if (response.ok) {
        toast.success('Booking updated successfully')
        fetchBooking() // Refresh data
      } else {
        toast.error('Failed to update booking')
      }
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
              The booking you're looking for doesn't exist or has been removed.
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Bookings
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
                <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a href={`tel:${booking.passenger.phone}`}>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </a>
              <a href={`https://wa.me/${booking.passenger.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-mobile py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                    <p className="text-lg font-semibold">{formatDate(booking.bookingDate)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Pickup Time</Label>
                    <p className="text-lg font-semibold">{formatTime(booking.pickupTime)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Trip Type</Label>
                    <p className="text-lg font-semibold capitalize">{booking.tripType} Trip</p>
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
                  <p className="text-lg font-semibold">{booking.pickupLocation}</p>
                </div>
                
                {booking.dropoffLocation && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Drop-off Location</Label>
                    <p className="text-lg font-semibold">{booking.dropoffLocation}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="text-lg font-semibold">{booking.passenger.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-lg font-semibold">{booking.passenger.phone}</p>
                  </div>
                  {booking.passenger.email && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-lg font-semibold">{booking.passenger.email}</p>
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
                <div className="flex items-center space-x-4">
                  {booking.vehicle.photos.length > 0 ? (
                    <img 
                      src={booking.vehicle.photos[0].url} 
                      alt={booking.vehicle.photos[0].alt}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Car className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{booking.vehicle.name}</h3>
                    <p className="text-gray-600 capitalize">{booking.vehicle.type}</p>
                    <p className="text-gray-600">{booking.vehicle.capacity} seats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Update Booking */}
            <Card>
              <CardHeader>
                <CardTitle>Update Booking</CardTitle>
                <CardDescription>Change booking status and add notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this booking..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleUpdateBooking}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? 'Updating...' : 'Update Booking'}
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
                  
                  {booking.notifications.map((notification) => (
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}