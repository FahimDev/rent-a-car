'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api/utils'

export const runtime = 'edge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Car, 
  MessageCircle,
  Home,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, formatTime, formatPhoneNumber } from '@/lib/utils'

interface SuccessPageProps {
  searchParams: Promise<{ id?: string }>
}

// Helper function to get company info (same as landing page)
async function getCompanyInfo() {
  const fallbackData = {
    id: 'default',
    name: 'Rent-A-Car Bangladesh',
    tagline: 'আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন | Reliable Transportation for Your Journey',
    description: 'We provide premium car rental services across Bangladesh with professional drivers and well-maintained vehicles.',
    phone: '+8801234567893',
    email: 'info@rentacar.com',
    whatsapp: '+8801234567893',
    latitude: 23.8103,
    longitude: 90.4125,
    address: 'Dhaka, Bangladesh'
  }

  try {
    const response = await api.company.getInfo()
    
    if (response.success && response.data) {
      return response.data
    }
    
    return fallbackData
  } catch (error) {
    return fallbackData
  }
}

async function getBooking(id: string) {
  console.log('🚀 [BOOKING SUCCESS] Starting booking fetch...', { id })
  
  try {
    console.log('🚀 [BOOKING SUCCESS] Calling api.bookings.getById()...')
    const response = await api.bookings.getById(id)
    console.log('🚀 [BOOKING SUCCESS] Booking API response:', {
      success: response.success,
      hasData: !!response.data,
      bookingId: response.data?.id,
      fullResponse: response
    })
    
    if (response.success && response.data) {
      console.log('🚀 [BOOKING SUCCESS] Using API data for booking')
      return response.data
    }
    
    console.log('🚀 [BOOKING SUCCESS] No booking data from API, returning null')
    return null
  } catch (error) {
    console.error('🚀 [BOOKING SUCCESS] Error fetching booking:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    console.log('🚀 [BOOKING SUCCESS] Returning null due to error')
    return null
  }
}

function BookingSuccessPageContent() {
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<any>(null)
  const [companyInfo, setCompanyInfo] = useState({
    id: 'default',
    name: 'Rent-A-Car Bangladesh',
    tagline: 'আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন | Reliable Transportation for Your Journey',
    description: 'We provide premium car rental services across Bangladesh with professional drivers and well-maintained vehicles.',
    phone: '+8801234567893',
    email: 'info@rentacar.com',
    whatsapp: '+8801234567893',
    latitude: 23.8103,
    longitude: 90.4125,
    address: 'Dhaka, Bangladesh'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      console.log('🚀 [BOOKING SUCCESS] useEffect - Loading data...')
      const id = searchParams?.get('id')
      
      try {
        const [companyData, bookingData] = await Promise.all([
          getCompanyInfo(),
          id ? getBooking(id) : Promise.resolve(null)
        ])
        
        setCompanyInfo(companyData)
        
        if (id) {
          console.log('🚀 [BOOKING SUCCESS] Booking loaded:', {
            hasBooking: !!bookingData,
            bookingId: bookingData?.id
          })
          setBooking(bookingData)
        } else {
          console.log('🚀 [BOOKING SUCCESS] No booking ID provided')
        }
      } catch (error) {
        console.error('🚀 [BOOKING SUCCESS] Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="card-mobile max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">
              The booking you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/">
              <Button className="btn-mobile">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed</h1>
                <p className="text-sm text-gray-600">Your booking has been successfully created</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-mobile py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="card-mobile mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-green-500 mb-6">
                <CheckCircle className="h-20 w-20 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Booking Confirmed! 🎉
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for choosing {companyInfo.name}. Your booking has been successfully created and we&apos;ll contact you soon.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 font-medium">
                  Booking Reference: <span className="font-mono">{booking.id}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="card-mobile mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Booking Details
              </CardTitle>
              <CardDescription>
                Here are the details of your booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trip Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{formatDate(new Date(booking.bookingDate))}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Pickup Time</p>
                      <p className="font-medium">{formatTime(booking.pickupTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Trip Type</p>
                      <p className="font-medium capitalize">{booking.tripType} Trip</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                    <p className="font-medium">{booking.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Drop-off Location</p>
                    <p className="font-medium">
                      {booking.dropoffLocation || 
                       (booking.tripType === 'single' ? 'To be determined' : 'Not specified')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Vehicle Details
                </h3>
                <div className="flex items-center space-x-4">
                  {booking.vehicle?.photos?.length > 0 ? (
                    <Image 
                      src={booking.vehicle.photos[0].url} 
                      alt={booking.vehicle.photos[0].alt || booking.vehicle.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Car className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold">{booking.vehicle?.name || 'Vehicle'}</h4>
                    <p className="text-sm text-gray-600 capitalize">{booking.vehicle?.type || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{booking.vehicle?.capacity || 0} seats</p>
                  </div>
                </div>
              </div>

              {/* Passenger Information */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Passenger Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{booking.passenger?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{booking.passenger?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="card-mobile mb-8">
            <CardHeader>
              <CardTitle>What&apos;s Next?</CardTitle>
              <CardDescription>
                Here&apos;s what happens after your booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Confirmation Call</h4>
                    <p className="text-sm text-gray-600">
                      We&apos;ll call you within 30 minutes to confirm your booking details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Driver Assignment</h4>
                    <p className="text-sm text-gray-600">
                      A professional driver will be assigned to your booking.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Pickup</h4>
                    <p className="text-sm text-gray-600">
                      Your driver will arrive at the specified location and time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="card-mobile mb-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Contact us if you have any questions about your booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a 
                  href={`tel:${companyInfo.phone}`}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{companyInfo.phone}</p>
                  </div>
                </a>
                <a 
                  href={`https://wa.me/${companyInfo.whatsapp?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-600">{companyInfo.whatsapp}</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="btn-mobile">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/vehicles">
              <Button size="lg" variant="outline" className="btn-mobile">
                <Car className="h-4 w-4 mr-2" />
                Book Another Ride
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    }>
      <BookingSuccessPageContent />
    </Suspense>
  )
}