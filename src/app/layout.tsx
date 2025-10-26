// Removed edge runtime for Prisma compatibility
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'



const inter = Inter({ 
  subsets: ['latin'],
  fallback: ['system-ui', 'arial'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Rent-A-Car Bangladesh | আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন',
  description: 'Premium car rental services across Bangladesh with professional drivers and well-maintained vehicles. Book your ride today!',
  keywords: 'car rental, rent a car, bangladesh, dhaka, transportation, vehicle booking, car hire, reliable transport',
  authors: [{ name: 'Rent-A-Car Bangladesh' }],
  creator: 'Rent-A-Car Bangladesh',
  publisher: 'Rent-A-Car Bangladesh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Rent-A-Car Bangladesh | আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন',
    description: 'Premium car rental services across Bangladesh with professional drivers and well-maintained vehicles.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Rent-A-Car Bangladesh',
    locale: 'en_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rent-A-Car Bangladesh',
    description: 'Premium car rental services across Bangladesh',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rent-A-Car" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
