export interface Vehicle {
  id: string
  name: string
  type: 'sedan' | 'noah' | 'hiace'
  capacity: number
  pricePerDay: number
  description?: string
  features?: string[]
  isAvailable: boolean
  adminId?: string
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
  photos: VehiclePhoto[]
}

export interface VehiclePhoto {
  id: string
  vehicleId: string
  url: string
  alt?: string
  isPrimary: boolean
  order: number
  createdAt: Date
}

export interface Passenger {
  id: string
  phone: string
  name?: string
  email?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  passengerId: string
  vehicleId: string
  bookingDate: Date
  pickupTime: string
  tripType: 'single' | 'round'
  pickupLocation: string
  dropoffLocation?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'fake'
  notes?: string
  createdAt: Date
  updatedAt: Date
  passenger: Passenger
  vehicle: Vehicle
}

export interface CompanyInfo {
  id: string
  name: string
  tagline?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  latitude?: number
  longitude?: number
  services?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Admin {
  id: string
  username: string
  email?: string
  phone?: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface BookingFormData {
  // Step 1: Date, Time, Trip Type
  bookingDate: Date
  pickupTime: string
  tripType: 'single' | 'round'
  
  // Step 2: Locations
  pickupLocation: string
  dropoffLocation?: string
  
  // Step 3: Contact Information
  passengerName: string
  passengerPhone: string
  passengerEmail?: string
  
  // Step 4: Vehicle Selection (optional - uses placeholder if not selected)
  vehicleId: string
}

export interface VehicleType {
  id: 'sedan' | 'noah' | 'hiace'
  name: string
  capacity: number
  description: string
  icon: string
}

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: 'sedan',
    name: '4-Seat Sedan',
    capacity: 4,
    description: 'Comfortable sedan perfect for city travel and short trips',
    icon: '🚗'
  },
  {
    id: 'noah',
    name: '7-Seat Noah',
    capacity: 7,
    description: 'Spacious 7-seater perfect for family trips and group travel',
    icon: '🚐'
  },
  {
    id: 'hiace',
    name: '12-Seat Hiace',
    capacity: 12,
    description: 'Large capacity vehicle ideal for corporate events and large groups',
    icon: '🚌'
  }
]
