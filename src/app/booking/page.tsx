'use client'
export const runtime = "edge";
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Car, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Navigation
} from 'lucide-react'
import Link from 'next/link'
import { VEHICLE_TYPES } from '@/types'
import { formatDate, formatTime, validatePhoneNumber, formatPhoneNumber } from '@/lib/utils'

interface BookingFormData {
  // Step 1: Date, Time, Trip Type
  bookingDate: string
  pickupTime: string
  tripType: 'single' | 'round'
  
  // Step 2: Locations
  pickupLocation: string
  dropoffLocation: string
  
  // Step 3: Contact Information
  passengerName: string
  passengerPhone: string
  passengerEmail: string
  
  // Step 4: Vehicle Selection
  vehicleId: string
}

interface VehicleApiResponse {
  id: string
  name: string
  type: string
  capacity: number
  pricePerDay: number
  description: string
  features: string[]
  isAvailable: boolean
  photos: {
    id: string
    url: string
    alt: string
  }[]
}

interface BookingApiResponse {
  id: string
}

const initialFormData: BookingFormData = {
  bookingDate: '',
  pickupTime: '',
  tripType: 'single',
  pickupLocation: '',
  dropoffLocation: '',
  passengerName: '',
  passengerPhone: '',
  passengerEmail: '',
  vehicleId: ''
}

function BookingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get vehicle from URL params
  useEffect(() => {
    const vehicleId = searchParams?.get('vehicle')
    if (vehicleId) {
      setFormData(prev => ({ ...prev, vehicleId }))
      // Fetch the actual vehicle details
      fetchVehicleDetails(vehicleId)
    }
  }, [searchParams])

  const fetchVehicleDetails = async (vehicleId: string) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (response.ok) {
        const vehicle = await response.json() as VehicleApiResponse
        setSelectedVehicle(vehicle)
      } else {
        console.error('Failed to fetch vehicle details')
        // Fallback to a basic vehicle object
        setSelectedVehicle({ 
          id: vehicleId, 
          name: 'Selected Vehicle', 
          type: 'sedan', 
          capacity: 4,
          pricePerDay: 0,
          description: '',
          features: [],
          isAvailable: true,
          photos: []
        })
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error)
      // Fallback to a basic vehicle object
      setSelectedVehicle({ 
        id: vehicleId, 
        name: 'Selected Vehicle', 
        type: 'sedan', 
        capacity: 4,
        pricePerDay: 0,
        description: '',
        features: [],
        isAvailable: true,
        photos: []
      })
    }
  }

  const steps = [
    { id: 1, title: 'Date & Time', icon: <Calendar className="h-5 w-5" /> },
    { id: 2, title: 'Locations', icon: <MapPin className="h-5 w-5" /> },
    { id: 3, title: 'Contact Info', icon: <User className="h-5 w-5" /> },
    { id: 4, title: 'Confirmation', icon: <CheckCircle className="h-5 w-5" /> }
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.bookingDate) newErrors.bookingDate = 'Booking date is required'
        if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required'
        break
      case 2:
        if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required'
        if (formData.tripType === 'round' && !formData.dropoffLocation) {
          newErrors.dropoffLocation = 'Drop-off location is required for round trip'
        }
        break
      case 3:
        if (!formData.passengerName) newErrors.passengerName = 'Name is required'
        if (!formData.passengerPhone) {
          newErrors.passengerPhone = 'Phone number is required'
        } else if (!validatePhoneNumber(formData.passengerPhone)) {
          newErrors.passengerPhone = 'Please enter a valid phone number'
        }
        if (formData.passengerEmail && !/\S+@\S+\.\S+/.test(formData.passengerEmail)) {
          newErrors.passengerEmail = 'Please enter a valid email address'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)
    try {
      // Format phone number
      const formattedPhone = formatPhoneNumber(formData.passengerPhone)
      
      const bookingData = {
        ...formData,
        passengerPhone: formattedPhone,
        bookingDate: new Date(formData.bookingDate).toISOString()
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })

      if (response.ok) {
        const result = await response.json() as BookingApiResponse
        router.push(`/booking/success?id=${result.id}`)
      } else {
        throw new Error('Booking failed')
      }
    } catch (error) {
      console.error('Booking error:', error)
      setErrors({ submit: 'Failed to create booking. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getVehicleTypeInfo = (type: string) => {
    return VEHICLE_TYPES.find(t => t.id === type) || VEHICLE_TYPES[0]
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
                <h1 className="text-2xl font-bold text-gray-900">Book Your Ride</h1>
                <p className="text-sm text-gray-600">Complete your booking in 4 simple steps</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-mobile py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="card-mobile">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {steps[currentStep - 1].icon}
                  <span className="ml-2">Step {currentStep}: {steps[currentStep - 1].title}</span>
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Select your travel date and time'}
                  {currentStep === 2 && 'Tell us where to pick you up and drop you off'}
                  {currentStep === 3 && 'Provide your contact information'}
                  {currentStep === 4 && 'Review and confirm your booking'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Date, Time, Trip Type */}
                {currentStep === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="bookingDate">Booking Date *</Label>
                        <Input
                          id="bookingDate"
                          type="date"
                          value={formData.bookingDate}
                          onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="input-mobile"
                        />
                        {errors.bookingDate && (
                          <p className="text-sm text-red-600 mt-1">{errors.bookingDate}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="pickupTime">Pickup Time *</Label>
                        <Input
                          id="pickupTime"
                          type="time"
                          value={formData.pickupTime}
                          onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                          className="input-mobile"
                        />
                        {errors.pickupTime && (
                          <p className="text-sm text-red-600 mt-1">{errors.pickupTime}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Trip Type *</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange('tripType', 'single')}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.tripType === 'single'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <Navigation className="h-5 w-5 mr-2" />
                            <div>
                              <p className="font-medium">Single Trip</p>
                              <p className="text-sm text-gray-600">One-way journey</p>
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange('tripType', 'round')}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.tripType === 'round'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <Navigation className="h-5 w-5 mr-2" />
                            <div>
                              <p className="font-medium">Round Trip</p>
                              <p className="text-sm text-gray-600">Return journey</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Locations */}
                {currentStep === 2 && (
                  <>
                    <div>
                      <Label htmlFor="pickupLocation">Pickup Location *</Label>
                      <Input
                        id="pickupLocation"
                        type="text"
                        placeholder="Enter pickup address"
                        value={formData.pickupLocation}
                        onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                        className="input-mobile"
                      />
                      {errors.pickupLocation && (
                        <p className="text-sm text-red-600 mt-1">{errors.pickupLocation}</p>
                      )}
                    </div>
                    {formData.tripType === 'round' && (
                      <div>
                        <Label htmlFor="dropoffLocation">Drop-off Location *</Label>
                        <Input
                          id="dropoffLocation"
                          type="text"
                          placeholder="Enter drop-off address"
                          value={formData.dropoffLocation}
                          onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                          className="input-mobile"
                        />
                        {errors.dropoffLocation && (
                          <p className="text-sm text-red-600 mt-1">{errors.dropoffLocation}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 3 && (
                  <>
                    <div>
                      <Label htmlFor="passengerName">Full Name *</Label>
                      <Input
                        id="passengerName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.passengerName}
                        onChange={(e) => handleInputChange('passengerName', e.target.value)}
                        className="input-mobile"
                      />
                      {errors.passengerName && (
                        <p className="text-sm text-red-600 mt-1">{errors.passengerName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="passengerPhone">Phone Number *</Label>
                      <Input
                        id="passengerPhone"
                        type="tel"
                        placeholder="+8801234567890"
                        value={formData.passengerPhone}
                        onChange={(e) => handleInputChange('passengerPhone', e.target.value)}
                        className="input-mobile"
                      />
                      {errors.passengerPhone && (
                        <p className="text-sm text-red-600 mt-1">{errors.passengerPhone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="passengerEmail">Email Address (Optional)</Label>
                      <Input
                        id="passengerEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.passengerEmail}
                        onChange={(e) => handleInputChange('passengerEmail', e.target.value)}
                        className="input-mobile"
                      />
                      {errors.passengerEmail && (
                        <p className="text-sm text-red-600 mt-1">{errors.passengerEmail}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{formatDate(new Date(formData.bookingDate))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{formatTime(formData.pickupTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trip Type:</span>
                          <span className="font-medium capitalize">{formData.tripType} Trip</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pickup:</span>
                          <span className="font-medium">{formData.pickupLocation}</span>
                        </div>
                        {formData.tripType === 'round' && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Drop-off:</span>
                            <span className="font-medium">{formData.dropoffLocation}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Passenger:</span>
                          <span className="font-medium">{formData.passengerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{formatPhoneNumber(formData.passengerPhone)}</span>
                        </div>
                      </div>
                    </div>
                    {errors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{errors.submit}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="btn-mobile"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button onClick={handleNext} className="btn-mobile">
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="btn-mobile"
                    >
                      {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-mobile sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Booking Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mr-3 ${
                        currentStep >= step.id
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {currentStep > step.id ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <span className={`text-sm ${
                        currentStep >= step.id ? 'text-primary-600 font-medium' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
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

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  )
}
