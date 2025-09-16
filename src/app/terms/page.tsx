'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Globe, FileText, Shield, Users, Clock, Phone, Mail, Car, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Head from 'next/head'
import { api } from '@/lib/api/utils'

export const runtime = 'edge'

export default function TermsPage() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en')
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

  // Helper function to get company info
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

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const data = await getCompanyInfo()
        setCompanyInfo(data)
      } catch (error) {
        console.error('Error loading company data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCompanyData()
  }, [])

  const getTermsContent = () => ({
    en: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last Updated: January 2025',
      sections: [
        {
          title: '1. Service Agreement',
          content: `By using ${companyInfo.name} services, you agree to these terms and conditions. Our car rental service provides reliable transportation across Bangladesh with professional drivers and well-maintained vehicles.`
        },
        {
          title: '2. Booking and Payment',
          content: 'All bookings must be made through our official channels. Payment terms include advance booking fees and full payment before service commencement. We accept cash, mobile banking, and digital payment methods.'
        },
        {
          title: '3. Vehicle Usage',
          content: 'Vehicles must be used for lawful purposes only. Passengers are responsible for their personal belongings. Smoking and consumption of alcohol are strictly prohibited in our vehicles.'
        },
        {
          title: '4. Cancellation Policy',
          content: 'Cancellations made 24 hours before the scheduled time are fully refundable. Cancellations within 24 hours may incur charges. No-show bookings will be charged the full amount.'
        },
        {
          title: '5. Liability and Insurance',
          content: 'We maintain comprehensive insurance for all vehicles. Passengers are covered under our insurance policy during the service period. Personal liability insurance is recommended for extended trips.'
        },
        {
          title: '6. Driver Responsibilities',
          content: 'Our professional drivers are licensed and experienced. They will follow traffic rules and ensure passenger safety. Any concerns about driver behavior should be reported immediately.'
        },
        {
          title: '7. Emergency Procedures',
          content: `In case of emergencies, contact our 24/7 helpline. We maintain backup vehicles and alternative arrangements for urgent situations. Emergency contact: ${companyInfo.phone}`
        },
        {
          title: '8. Privacy Policy',
          content: 'We collect and use personal information only for service provision. Your data is protected and will not be shared with third parties without consent. We comply with Bangladesh data protection laws.'
        },
        {
          title: '9. Modifications',
          content: 'These terms may be updated periodically. Continued use of our services constitutes acceptance of modified terms. Users will be notified of significant changes.'
        },
        {
          title: '10. Contact Information',
          content: `For questions about these terms, contact us at ${companyInfo.email} or call ${companyInfo.phone}. Our office is located in ${companyInfo.address}.`
        }
      ]
    },
    bn: {
      title: 'শর্তাবলী ও নীতিমালা',
      lastUpdated: 'সর্বশেষ আপডেট: জানুয়ারি ২০২৫',
      sections: [
        {
          title: '১. সেবা চুক্তি',
          content: `${companyInfo.name} এর সেবা ব্যবহারের মাধ্যমে আপনি এই শর্তাবলী ও নীতিমালায় সম্মত হচ্ছেন। আমাদের গাড়ি ভাড়া সেবা পেশাদার চালক এবং সুপরিচালিত যানবাহনের মাধ্যমে বাংলাদেশ জুড়ে নির্ভরযোগ্য পরিবহন সরবরাহ করে।`
        },
        {
          title: '২. বুকিং ও পেমেন্ট',
          content: 'সমস্ত বুকিং আমাদের অফিসিয়াল চ্যানেলের মাধ্যমে করতে হবে। পেমেন্টের শর্তাবলীতে অগ্রিম বুকিং ফি এবং সেবা শুরুর আগে সম্পূর্ণ পেমেন্ট অন্তর্ভুক্ত। আমরা নগদ, মোবাইল ব্যাংকিং এবং ডিজিটাল পেমেন্ট পদ্ধতি গ্রহণ করি।'
        },
        {
          title: '৩. যানবাহন ব্যবহার',
          content: 'যানবাহন শুধুমাত্র বৈধ উদ্দেশ্যে ব্যবহার করতে হবে। যাত্রীরা তাদের ব্যক্তিগত জিনিসপত্রের জন্য দায়ী। আমাদের যানবাহনে ধূমপান এবং মদ্য পান কঠোরভাবে নিষিদ্ধ।'
        },
        {
          title: '৪. বাতিলকরণ নীতি',
          content: 'নির্ধারিত সময়ের ২৪ ঘন্টা আগে বাতিল করলে সম্পূর্ণ ফেরতযোগ্য। ২৪ ঘন্টার মধ্যে বাতিল করলে চার্জ লাগতে পারে। নো-শো বুকিংয়ের জন্য সম্পূর্ণ পরিমাণ চার্জ হবে।'
        },
        {
          title: '৫. দায়বদ্ধতা ও বীমা',
          content: 'আমরা সমস্ত যানবাহনের জন্য ব্যাপক বীমা বজায় রাখি। সেবা সময়কালে যাত্রীরা আমাদের বীমা পলিসির আওতায় থাকেন। দীর্ঘমেয়াদী ভ্রমণের জন্য ব্যক্তিগত দায়বদ্ধতা বীমা সুপারিশ করা হয়।'
        },
        {
          title: '৬. চালকের দায়িত্ব',
          content: 'আমাদের পেশাদার চালকরা লাইসেন্সপ্রাপ্ত এবং অভিজ্ঞ। তারা ট্রাফিক নিয়ম মেনে চলবেন এবং যাত্রীদের নিরাপত্তা নিশ্চিত করবেন। চালকের আচরণ সম্পর্কে কোনো উদ্বেগ থাকলে তাৎক্ষণিক রিপোর্ট করতে হবে।'
        },
        {
          title: '৭. জরুরি প্রক্রিয়া',
          content: `জরুরি পরিস্থিতিতে আমাদের ২৪/৭ হেল্পলাইনে যোগাযোগ করুন। আমরা জরুরি পরিস্থিতির জন্য ব্যাকআপ যানবাহন এবং বিকল্প ব্যবস্থা বজায় রাখি। জরুরি যোগাযোগ: ${companyInfo.phone}`
        },
        {
          title: '৮. গোপনীয়তা নীতি',
          content: 'আমরা সেবা প্রদানের জন্য শুধুমাত্র ব্যক্তিগত তথ্য সংগ্রহ ও ব্যবহার করি। আপনার ডেটা সুরক্ষিত এবং সম্মতি ছাড়া তৃতীয় পক্ষের সাথে শেয়ার করা হবে না। আমরা বাংলাদেশের ডেটা সুরক্ষা আইন মেনে চলি।'
        },
        {
          title: '৯. পরিবর্তন',
          content: 'এই শর্তাবলী পর্যায়ক্রমে আপডেট হতে পারে। আমাদের সেবার অব্যাহত ব্যবহার পরিবর্তিত শর্তাবলীর গ্রহণযোগ্যতা নির্দেশ করে। উল্লেখযোগ্য পরিবর্তনের বিষয়ে ব্যবহারকারীদের জানানো হবে।'
        },
        {
          title: '১০. যোগাযোগের তথ্য',
          content: `এই শর্তাবলী সম্পর্কে প্রশ্নের জন্য ${companyInfo.email} এ আমাদের সাথে যোগাযোগ করুন বা ${companyInfo.phone} নম্বরে কল করুন। আমাদের অফিস ${companyInfo.address} এ অবস্থিত।`
        }
      ]
    }
  })

  const currentContent = getTermsContent()[language]

  return (
    <>
      <Head>
        <title>{currentContent.title} | {companyInfo.name}</title>
        <meta name="description" content={`Terms and conditions for ${companyInfo.name} car rental services. Learn about our policies, booking terms, and service agreements.`} />
        <meta name="keywords" content="terms and conditions, car rental, Bangladesh, rent a car, service agreement, booking policy" />
        <meta property="og:title" content={`${currentContent.title} | ${companyInfo.name}`} />
        <meta property="og:description" content={`Terms and conditions for ${companyInfo.name} car rental services.`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${currentContent.title} | ${companyInfo.name}`} />
        <meta name="twitter:description" content={`Terms and conditions for ${companyInfo.name} car rental services.`} />
        <link rel="canonical" href="https://rentacar.com/terms" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content={language === 'en' ? 'English' : 'Bengali'} />
        <meta name="geo.region" content="BD" />
        <meta name="geo.country" content="Bangladesh" />
      </Head>

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
                  <h1 className="text-2xl font-bold text-gray-900">{currentContent.title}</h1>
                  <p className="text-sm text-gray-600">{currentContent.lastUpdated}</p>
                </div>
              </div>
              
              {/* Language Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className="text-xs"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  EN
                </Button>
                <Button
                  variant={language === 'bn' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('bn')}
                  className="text-xs"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  বাংলা
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-mobile py-8">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Welcome to Rent-A-Car Bangladesh' : 'রেন্ট-এ-কার বাংলাদেশে স্বাগতম'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'en' 
                    ? 'These terms and conditions govern your use of our car rental services. Please read them carefully before making a booking. By using our services, you agree to be bound by these terms.'
                    : 'এই শর্তাবলী ও নীতিমালা আমাদের গাড়ি ভাড়া সেবার ব্যবহার নিয়ন্ত্রণ করে। বুকিং করার আগে সেগুলো সাবধানে পড়ুন। আমাদের সেবা ব্যবহারের মাধ্যমে আপনি এই শর্তাবলী দ্বারা আবদ্ধ হতে সম্মত হচ্ছেন।'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Terms Sections */}
            <div className="space-y-6">
              {currentContent.sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Information */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Need Help?' : 'সাহায্য প্রয়োজন?'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a 
                      href={`tel:${companyInfo.phone}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Phone className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="font-medium">{language === 'en' ? 'Phone' : 'ফোন'}</p>
                        <p className="text-sm text-gray-600">{companyInfo.phone}</p>
                      </div>
                    </a>
                    <a 
                      href={`mailto:${companyInfo.email}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Mail className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="font-medium">{language === 'en' ? 'Email' : 'ইমেইল'}</p>
                        <p className="text-sm text-gray-600">{companyInfo.email}</p>
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
                        <p className="font-medium">{language === 'en' ? 'WhatsApp' : 'হোয়াটসঅ্যাপ'}</p>
                        <p className="text-sm text-gray-600">{companyInfo.whatsapp}</p>
                      </div>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/">
                <Button size="lg" className="btn-mobile">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Back to Home' : 'হোমে ফিরুন'}
                </Button>
              </Link>
              <Link href="/booking">
                <Button size="lg" variant="outline" className="btn-mobile">
                  <Car className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Book Now' : 'এখনই বুক করুন'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
