import { Suspense } from 'react'

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
import { VehicleApiService } from '@/lib/services/api/VehicleApiService'
import { CompanyApiService } from '@/lib/services/api/CompanyApiService'

export default async function HomePage() {
  const [companyInfo, vehicles] = await Promise.all([
    CompanyApiService.getCompanyInfoWithFallback(),
    VehicleApiService.getVehiclesForLanding()
  ])

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
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <Shield className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
            </Link>
            <div className="text-white/60 text-sm">
              {companyInfo.name}
            </div>
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
                <Button size="lg" variant="outline" className="btn-mobile border-white text-white hover:bg-white hover:text-black">
                  <Clock className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
              {vehicles.map((vehicle: any) => (
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
              ))}
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
      {companyInfo.latitude && companyInfo.longitude && (
        <section className="py-16 bg-gray-50">
          <div className="container-mobile">
            <div className="text-center mb-12">
              <h2 className="heading-responsive font-bold text-gray-900 mb-4">
                Our Location
              </h2>
              <p className="text-responsive text-gray-600 max-w-2xl mx-auto">
                Visit our office or find us on the map.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Google Maps Integration</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Latitude: {companyInfo.latitude}, Longitude: {companyInfo.longitude}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
              <Button size="lg" variant="outline" className="btn-mobile border-white text-white hover:bg-white hover:text-black">
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
