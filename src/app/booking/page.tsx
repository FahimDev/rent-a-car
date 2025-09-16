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
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './phone-input.css'
import { VEHICLE_TYPES } from '@/types'
import { formatDate, formatTime, validatePhoneNumber, formatPhoneNumber, getPhoneValidationMessage } from '@/lib/utils'
import { api } from '@/lib/api/utils'
import { LocationPinLoader, SimpleLocationPinLoader } from '@/components/ui/LocationPinLoader'

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
  const [isLocating, setIsLocating] = useState(false)
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
    console.log('🚀 [BOOKING PAGE] Starting vehicle details fetch...', { vehicleId })
    
    const fallbackVehicle = { 
      id: vehicleId, 
      name: 'Selected Vehicle', 
      type: 'sedan', 
      capacity: 4,
      pricePerDay: 0,
      description: '',
      features: [],
      isAvailable: true,
      photos: []
    }

    try {
      console.log('🚀 [BOOKING PAGE] Calling api.vehicles.getById()...')
      const response = await api.vehicles.getById(vehicleId)
      console.log('🚀 [BOOKING PAGE] Vehicle details API response:', {
        success: response.success,
        hasData: !!response.data,
        vehicleId: response.data?.id,
        vehicleName: response.data?.name,
        fullResponse: response
      })
      
      if (response.success && response.data) {
        console.log('🚀 [BOOKING PAGE] Using API data for vehicle details')
        setSelectedVehicle(response.data)
      } else {
        console.log('🚀 [BOOKING PAGE] No vehicle data from API, using fallback')
        setSelectedVehicle(fallbackVehicle)
      }
    } catch (error) {
      console.error('🚀 [BOOKING PAGE] Error fetching vehicle details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      })
      console.log('🚀 [BOOKING PAGE] Using fallback vehicle due to error')
      setSelectedVehicle(fallbackVehicle)
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
        if (!formData.dropoffLocation) {
          newErrors.dropoffLocation = 'Drop-off location is required'
        }
        break
      case 3:
        if (!formData.passengerName) newErrors.passengerName = 'Name is required'
        if (!formData.passengerPhone) {
          newErrors.passengerPhone = 'Phone number is required'
        } else if (!validatePhoneNumber(formData.passengerPhone)) {
          const validationMessage = getPhoneValidationMessage(formData.passengerPhone)
          newErrors.passengerPhone = validationMessage || 'Please enter a valid phone number'
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

  const handleLocationDetection = async () => {
    setIsLocating(true)
    
    // Simulate location detection delay
    setTimeout(() => {
      // In a real app, you would use the browser's geolocation API here
      // navigator.geolocation.getCurrentPosition((position) => {
      //   // Handle location data
      // })
      
      setIsLocating(false)
      // You could set a default location or show a map picker
    }, 2000)
  }

  const handleSubmit = async () => {
    // Validate all steps except vehicle selection (optional)
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return

    console.log('🚀 [BOOKING PAGE] Starting booking submission...', { formData })
    setIsSubmitting(true)
    
    try {
      // Phone number is already formatted by react-phone-input-2
      const bookingData = {
        ...formData,
        bookingDate: new Date(formData.bookingDate).toISOString(),
        // If no vehicle is selected, use a placeholder for admin assignment
        vehicleId: formData.vehicleId || 'pending-assignment'
      }

      console.log('🚀 [BOOKING PAGE] Calling api.bookings.create()...', { bookingData })
      const result = await api.bookings.create(bookingData)
      console.log('🚀 [BOOKING PAGE] Booking API response:', {
        success: result.success,
        hasData: !!result.data,
        bookingId: result.data?.id,
        fullResponse: result
      })
      
      if (result.success && result.data) {
        console.log('🚀 [BOOKING PAGE] Booking created successfully, redirecting to success page')
        router.push(`/booking/success?id=${result.data.id}`)
      } else {
        console.error('🚀 [BOOKING PAGE] Booking failed:', result.error)
        throw new Error(result.error || 'Booking failed')
      }
    } catch (error) {
      console.error('🚀 [BOOKING PAGE] Booking error:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      })
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
          {/* Mobile Layout */}
          <div className="flex flex-col sm:hidden space-y-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-xs">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <div className="w-14 h-14">
                <img 
                  src="/logo.webp" 
                  alt="Rent-A-Car Bangladesh Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-16"></div> {/* Spacer for centering */}
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">Book Your Ride</h1>
              <p className="text-xs text-gray-600">Complete your booking in 4 simple steps</p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="w-16 h-16">
                <img 
                  src="/logo.webp" 
                  alt="Rent-A-Car Bangladesh Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
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
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.tripType === 'single'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                          disabled={isSubmitting}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.tripType === 'round'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    {/* Location Detection Section */}
                    {isLocating && (
                      <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <LocationPinLoader 
                          size="md" 
                          text="Detecting your location..." 
                          className="mx-auto"
                        />
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="pickupLocation">Pickup Location *</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleLocationDetection}
                          disabled={isLocating || isSubmitting}
                          className="text-xs px-3 py-1"
                        >
                          {isLocating ? (
                            <>
                              <SimpleLocationPinLoader size="sm" text="" className="flex-row space-x-1" />
                              <span className="ml-1">Detecting...</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3 w-3 mr-1" />
                              Detect
                            </>
                          )}
                        </Button>
                      </div>
                      <Input
                        id="pickupLocation"
                        type="text"
                        placeholder="Enter pickup address"
                        value={formData.pickupLocation}
                        onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                        className="input-mobile"
                        disabled={isSubmitting || isLocating}
                      />
                      {errors.pickupLocation && (
                        <p className="text-sm text-red-600 mt-1">{errors.pickupLocation}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dropoffLocation">Drop-off Location *</Label>
                      <Input
                        id="dropoffLocation"
                        type="text"
                        placeholder="Enter drop-off address"
                        value={formData.dropoffLocation}
                        onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                        className="input-mobile"
                        disabled={isSubmitting}
                      />
                      {errors.dropoffLocation && (
                        <p className="text-sm text-red-600 mt-1">{errors.dropoffLocation}</p>
                      )}
                    </div>
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
                        disabled={isSubmitting}
                      />
                      {errors.passengerName && (
                        <p className="text-sm text-red-600 mt-1">{errors.passengerName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="passengerPhone">Phone Number *</Label>
                      <div className="relative">
                        <PhoneInput
                          country={'bd'}
                          value={formData.passengerPhone}
                          onChange={(value) => handleInputChange('passengerPhone', value)}
                          placeholder="Enter phone number"
                          disabled={isSubmitting}
                          enableSearch={true}
                          searchPlaceholder="Search countries..."
                          preferredCountries={['bd', 'us', 'gb', 'in', 'au', 'ca']}
                          onlyCountries={['bd', 'us', 'gb', 'in', 'au', 'ca', 'de', 'fr', 'it', 'es', 'jp', 'kr', 'cn', 'sg', 'my', 'th', 'id', 'ph', 'vn', 'ae', 'sa', 'eg', 'za', 'ng', 'ke', 'gh', 'ma', 'dz', 'tn', 'ly', 'sd', 'et', 'ug', 'tz', 'rw', 'bi', 'mw', 'zm', 'zw', 'bw', 'na', 'sz', 'ls', 'mg', 'mu', 'sc', 'km', 'dj', 'so', 'er', 'ss', 'cf', 'td', 'ne', 'ml', 'bf', 'ci', 'lr', 'sl', 'gn', 'gw', 'gm', 'sn', 'mr', 'cv', 'st', 'gq', 'ga', 'cg', 'cd', 'ao', 'cm']}
                          disableCountryCode={false}
                          disableDropdown={false}
                          countryCodeEditable={false}
                        />
                        {/* Bangladesh indicator */}
                        {formData.passengerPhone.startsWith('+880') && (
                          <div className="absolute -top-6 right-0 text-xs text-blue-600 font-medium">
                            🇧🇩 Bangladesh
                          </div>
                        )}
                      </div>
                      {errors.passengerPhone && (
                        <p className="text-sm text-red-600 mt-1">{errors.passengerPhone}</p>
                      )}
                      {/* Help text for Bangladesh */}
                      {formData.passengerPhone.startsWith('+880') && !errors.passengerPhone && (
                        <p className="text-xs text-gray-500 mt-1">
                          Enter 10 digits starting with 1 (e.g., 1712345678)
                        </p>
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
                        disabled={isSubmitting}
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
                        <div className="flex justify-between">
                          <span className="text-gray-600">Drop-off:</span>
                          <span className="font-medium">{formData.dropoffLocation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Passenger:</span>
                          <span className="font-medium">{formData.passengerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{formData.passengerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-medium">
                            {selectedVehicle ? selectedVehicle.name : 'No vehicle selected (optional)'}
                          </span>
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
                    disabled={currentStep === 1 || isSubmitting}
                    className="btn-mobile"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button 
                      onClick={handleNext} 
                      disabled={isSubmitting}
                      className="btn-mobile"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="btn-mobile"
                    >
                      {isSubmitting ? (
                        <>
                          <LocationPinLoader size="sm" text="" className="flex-row space-x-2" />
                          <span>Creating Booking...</span>
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
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

      {/* Full Screen Location Loader Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center">
            <LocationPinLoader 
              size="lg" 
              text="Processing your booking..." 
              className="mx-auto"
            />
            <p className="text-sm text-gray-600 mt-4">
              Please wait while we confirm your booking details
            </p>
          </div>
        </div>
      )}
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
