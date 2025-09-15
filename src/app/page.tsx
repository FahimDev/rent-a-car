'use client'

import { Suspense, useEffect, useState } from 'react'

export const runtime = 'edge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Shield, 
  Users,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import { api } from '@/lib/api/utils'
import { VehicleGridSkeleton, VehicleLoader } from '@/components/ui/VehicleLoader'

// Helper functions to call API endpoints
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

async function getVehicles() {
  try {
    const response = await api.vehicles.getAll()
    
    if (response.success && response.data?.vehicles) {
      return response.data.vehicles.slice(0, 3) // Limit to 3 for landing page
    }
    
    return []
  } catch (error) {
    return []
  }
}

export default function HomePage() {
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
  
  const [vehicles, setVehicles] = useState<any[]>([])
  const [vehiclesLoading, setVehiclesLoading] = useState(true)
  const [companyLoading, setCompanyLoading] = useState(true)

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const companyData = await getCompanyInfo()
        setCompanyInfo(companyData)
      } catch (error) {
        // Handle error silently
      } finally {
        setCompanyLoading(false)
      }
    }

    const loadVehiclesData = async () => {
      try {
        const vehiclesData = await getVehicles()
        setVehicles(vehiclesData)
      } catch (error) {
        // Handle error silently
      } finally {
        setVehiclesLoading(false)
      }
    }

    // Load company data first (faster)
    loadCompanyData()
    // Load vehicles data separately
    loadVehiclesData()
  }, [])

  const services = [
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: "Airport Transfer",
      titleBn: "এয়ারপোর্ট ট্রান্সফার",
      description: "Reliable airport pickup and drop-off services",
      descriptionBn: "নির্ভরযোগ্য এয়ারপোর্ট পিকআপ ও ড্রপ-অফ সেবা"
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "City Tour",
      titleBn: "সিটি ট্যুর",
      description: "Explore Dhaka and other cities with our guided tours",
      descriptionBn: "আমাদের গাইডেড ট্যুরের সাথে ঢাকা ও অন্যান্য শহর ঘুরে দেখুন"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Corporate Transportation",
      titleBn: "কর্পোরেট পরিবহন",
      description: "Professional transportation for business needs",
      descriptionBn: "ব্যবসায়িক প্রয়োজনে পেশাদার পরিবহন সেবা"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Wedding & Events",
      titleBn: "বিয়ে ও অনুষ্ঠান",
      description: "Special vehicles for your special occasions",
      descriptionBn: "আপনার বিশেষ অনুষ্ঠানের জন্য বিশেষ যানবাহন"
    }
  ]

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      text: "Professional Drivers",
      textBn: "পেশাদার চালক"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      text: "Well-Maintained Vehicles",
      textBn: "ভালোভাবে রক্ষণাবেক্ষণকৃত যানবাহন"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      text: "24/7 Customer Support",
      textBn: "২৪/৭ গ্রাহক সেবা"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      text: "Competitive Pricing",
      textBn: "প্রতিযোগিতামূলক মূল্য"
    }
  ]


  return (
    <div className="min-h-screen">
      {/* Header with Admin Login */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="container-mobile">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Logo only visible on desktop */}
              <div className="hidden sm:block w-20 h-20">
                <img 
                  src="/logo.webp" 
                  alt="Rent-A-Car Bangladesh Logo" 
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <div className="text-white/90 text-sm sm:text-lg font-semibold hidden sm:block">
                {companyInfo.name}
              </div>
              {/* Mobile: Show company name only */}
              <div className="sm:hidden text-white/90 text-sm font-semibold">
                {companyInfo.name}
              </div>
            </div>
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 text-xs sm:text-sm">
                <Shield className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Admin Login</span>
                <span className="sm:hidden">Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container-mobile py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="heading-responsive font-bold mb-6 leading-tight">
              <span className="block">{companyInfo.name}</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal mt-2 opacity-90">
                {companyInfo.tagline}
              </span>
            </h1>
            <p className="text-responsive mb-8 opacity-90 max-w-2xl mx-auto">
              {companyInfo.description} 
              Book your ride today for a comfortable and safe journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vehicles">
                <Button size="lg" className="btn-mobile bg-primary-600 text-white hover:bg-primary-700">
                  <Car className="mr-2 h-5 w-5" />
                  View Our Vehicles
                </Button>
              </Link>
              <Link href="/booking">
                <Button size="lg" variant="outline" className="btn-mobile border-[#ae3338] text-[#ae3338] bg-[#ae3338] text-white">
                  <Clock className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Logo Section - Pokéball Center Style */}
      <div className="sm:hidden relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-28 h-28 bg-white rounded-full shadow-xl border-4 border-gray-200 flex items-center justify-center">
            <img 
              src="/logo.webp" 
              alt="Rent-A-Car Bangladesh Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
        <div className="h-12 bg-white"></div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-mobile">
          <div className="text-center mb-12">
            <h2 className="heading-responsive font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-responsive text-gray-600 max-w-2xl mx-auto">
              We provide the best car rental experience with our commitment to quality and service.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      {feature.icon}
                    </div>
                  </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.text}</h3>
                <p className="text-sm text-gray-600 font-bangla">{feature.textBn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-mobile">
          <div className="text-center mb-12">
            <h2 className="heading-responsive font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-responsive text-gray-600 max-w-2xl mx-auto">
              Comprehensive transportation solutions for all your travel needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="card-mobile hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="font-bangla text-sm">
                    {service.titleBn}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <p className="text-sm text-gray-500 font-bangla">{service.descriptionBn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Preview Section */}
      {vehicles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-mobile">
            <div className="text-center mb-12">
              <h2 className="heading-responsive font-bold text-gray-900 mb-4">
                Our Fleet
              </h2>
              <p className="text-responsive text-gray-600 max-w-2xl mx-auto">
                Choose from our well-maintained vehicles for your journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vehiclesLoading ? (
                <VehicleGridSkeleton count={3} />
              ) : vehicles.length > 0 ? (
                vehicles.map((vehicle: any) => (
                <Card key={vehicle.id} className="card-mobile overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    {vehicle.photos.length > 0 ? (
                      <Image 
                        src={vehicle.photos[0].url} 
                        alt={vehicle.photos[0].alt || vehicle.name}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{vehicle.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-600">
                        {vehicle.capacity} Seats
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {vehicle.type}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                ))
              ) : (
                <div className="col-span-full flex justify-center">
                  <VehicleLoader 
                    size="lg" 
                    text="No vehicles available" 
                    className="py-8"
                  />
                </div>
              )}
            </div>
            <div className="text-center mt-8">
              <Link href="/vehicles">
                <Button size="lg" className="btn-mobile">
                  View All Vehicles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-mobile">
          <div className="text-center mb-12">
            <h2 className="heading-responsive font-bold mb-4">
              Contact Us
            </h2>
            <p className="text-responsive opacity-90 max-w-2xl mx-auto">
              Get in touch with us for your transportation needs. We&apos;re here to help!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="opacity-90">{companyInfo.phone}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="opacity-90">{companyInfo.email}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="opacity-90">{companyInfo.whatsapp}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-mobile">
          <div className="text-center mb-12">
            <h2 className="heading-responsive font-bold text-gray-900 mb-4">
              Our Location
            </h2>
            <p className="text-responsive text-gray-600 max-w-2xl mx-auto">
              Visit our office in Chittagong or find us on the map for easy navigation.
            </p>
          </div>
          
          {/* Business Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-mobile text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-sm text-gray-600">
                  Chittagong, Bangladesh
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-mobile text-center">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-sm text-gray-600">
                  24/7 Service Available
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-mobile text-center">
              <CardContent className="p-6">
                <div className="h-8 w-8 text-primary mx-auto mb-3">
                  <div 
                    className="w-full h-full bg-primary"
                    style={{
                      maskImage: 'url(/bangladesh.svg)',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: 'url(/bangladesh.svg)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center'
                    }}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Area</h3>
                <p className="text-sm text-gray-600">
                  All over Bangladesh
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Interactive Map */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5203.548905356438!2d91.85144059999999!3d22.351691699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad27b7e726a8c7%3A0xd705bc7c4ebcc2b6!2sChittagong%20Rent%20A%20Car!5e1!3m2!1sen!2sbd!4v1757965102645!5m2!1sen!2sbd" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Chittagong Rent A Car Location"
              />
            </div>
          </div>
          
          {/* Map Instructions */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Click on the map to open in Google Maps for directions
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container-mobile text-center">
          <h2 className="heading-responsive font-bold mb-4">
            Ready to Book Your Ride?
          </h2>
          <p className="text-responsive mb-8 opacity-90 max-w-2xl mx-auto">
            Experience the best car rental service. Book now and enjoy a comfortable journey!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="btn-mobile bg-primary-600 text-white hover:bg-primary-700">
                <Clock className="mr-2 h-5 w-5" />
                Book Now
              </Button>
            </Link>
            <Link href="/vehicles">
              <Button size="lg" variant="outline" className="btn-mobile border-[#ae3338] text-[#ae3338] bg-[#ae3338] text-white">
                <Car className="mr-2 h-5 w-5" />
                View Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}