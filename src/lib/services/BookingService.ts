import { BookingRepository } from '../repositories/BookingRepository'
import { PassengerRepository } from '../repositories/PassengerRepository'
import { VehicleRepository } from '../repositories/VehicleRepository'
import { Booking, Passenger, BookingFormData } from '@/types'
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/utils'
import { maskPassengerData } from '@/lib/utils/masking'

/**
 * Booking Service
 * Contains business logic for booking operations
 */
export class BookingService {
  private bookingRepository: BookingRepository
  private passengerRepository: PassengerRepository
  private vehicleRepository: VehicleRepository

  constructor(
    bookingRepository: BookingRepository,
    passengerRepository: PassengerRepository,
    vehicleRepository: VehicleRepository
  ) {
    this.bookingRepository = bookingRepository
    this.passengerRepository = passengerRepository
    this.vehicleRepository = vehicleRepository
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: BookingFormData): Promise<Booking> {
    // Validate booking data
    this.validateBookingData(bookingData)

    // Check if vehicle exists and is available (skip validation for placeholder)
    let vehicle = null
    if (bookingData.vehicleId && bookingData.vehicleId !== 'pending-assignment') {
      vehicle = await this.vehicleRepository.getVehicleById(bookingData.vehicleId)
      if (!vehicle) {
        throw new Error('Vehicle not found')
      }

      if (!vehicle.isAvailable) {
        throw new Error('Vehicle is not available for booking')
      }
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(bookingData.passengerPhone)

    // Find or create passenger
    let passenger = await this.passengerRepository.findByPhone(formattedPhone)
    
    if (!passenger) {
      passenger = await this.passengerRepository.create({
        phone: formattedPhone,
        name: bookingData.passengerName,
        email: bookingData.passengerEmail,
        isVerified: false
      })
    } else {
      // Update passenger info if provided
      await this.passengerRepository.updatePassenger(passenger.id, {
        name: bookingData.passengerName,
        email: bookingData.passengerEmail || passenger.email
      })
    }

    // Create booking
    const booking = await this.bookingRepository.create({
      passengerId: passenger.id,
      vehicleId: bookingData.vehicleId || 'pending-assignment',
      bookingDate: bookingData.bookingDate,
      pickupTime: bookingData.pickupTime,
      tripType: bookingData.tripType,
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      status: 'pending'
    })

    return booking
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookingRepository.findById(id)
  }

  /**
   * Get all bookings with pagination and filters
   */
  async getBookings(options: {
    status?: string
    passengerId?: string
    page?: number
    limit?: number
  } = {}): Promise<{ bookings: Booking[], total: number }> {
    return this.bookingRepository.findAll(options)
  }

  /**
   * Get bookings by passenger phone
   */
  async getBookingsByPassengerPhone(phone: string): Promise<Booking[]> {
    const formattedPhone = formatPhoneNumber(phone)
    const passenger = await this.passengerRepository.findByPhone(formattedPhone)
    
    if (!passenger) {
      return []
    }

    return this.bookingRepository.findByPassengerId(passenger.id)
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(
    id: string, 
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ): Promise<boolean> {
    const booking = await this.bookingRepository.findById(id)
    if (!booking) {
      throw new Error('Booking not found')
    }

    return this.bookingRepository.updateStatus(id, status)
  }

  /**
   * Update booking details
   */
  async updateBooking(id: string, updateData: {
    bookingDate?: Date
    pickupTime?: string
    tripType?: 'single' | 'round'
    pickupLocation?: string
    dropoffLocation?: string
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'fake'
    notes?: string
  }): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id)
    if (!booking) {
      throw new Error('Booking not found')
    }

    const updated = await this.bookingRepository.updateBooking(id, updateData)
    
    // If status is being changed to 'confirmed', automatically verify the passenger's phone number
    if (updateData.status === 'confirmed' && booking.passenger) {
      try {
        await this.passengerRepository.updateVerificationStatusById(booking.passenger.id, true)
        console.log(`✅ [BOOKING SERVICE] Auto-verified passenger ${booking.passenger.id} phone number for confirmed booking ${id}`)
      } catch (error) {
        console.error(`❌ [BOOKING SERVICE] Failed to auto-verify passenger phone number for booking ${id}:`, error)
        // Don't throw error here - booking update should still succeed even if verification fails
      }
    }
    
    // If status is being changed to 'fake', automatically unverify the passenger's phone number
    if (updateData.status === 'fake' && booking.passenger) {
      try {
        await this.passengerRepository.updateVerificationStatusById(booking.passenger.id, false)
        console.log(`🚫 [BOOKING SERVICE] Auto-unverified passenger ${booking.passenger.id} phone number for fake booking ${id}`)
      } catch (error) {
        console.error(`❌ [BOOKING SERVICE] Failed to auto-unverify passenger phone number for booking ${id}:`, error)
        // Don't throw error here - booking update should still succeed even if unverification fails
      }
    }
    
    // Return the updated booking (even if no changes were made, the booking still exists)
    return this.bookingRepository.findById(id) as Promise<Booking>
  }

  /**
   * Cancel booking
   */
  async cancelBooking(id: string, reason?: string): Promise<boolean> {
    const booking = await this.bookingRepository.findById(id)
    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled')
    }

    if (booking.status === 'completed') {
      throw new Error('Cannot cancel completed booking')
    }

    return this.bookingRepository.updateBooking(id, {
      status: 'cancelled',
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled by user'
    })
  }

  /**
   * Get booking statistics
   */
  async getBookingStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }> {
    const { bookings } = await this.bookingRepository.findAll({ limit: 1000 })
    
    const stats = {
      total: bookings.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    }

    bookings.forEach(booking => {
      switch (booking.status) {
        case 'pending':
          stats.pending++
          break
        case 'confirmed':
          stats.confirmed++
          break
        case 'completed':
          stats.completed++
          break
        case 'cancelled':
          stats.cancelled++
          break
      }
    })

    return stats
  }

  /**
   * Validate booking data
   */
  private validateBookingData(data: BookingFormData): void {
    if (!data.bookingDate) {
      throw new Error('Booking date is required')
    }

    if (!data.pickupTime) {
      throw new Error('Pickup time is required')
    }

    if (!data.tripType) {
      throw new Error('Trip type is required')
    }

    if (!data.pickupLocation) {
      throw new Error('Pickup location is required')
    }

    if (data.tripType === 'round' && !data.dropoffLocation) {
      throw new Error('Drop-off location is required for round trip')
    }

    if (!data.passengerName) {
      throw new Error('Passenger name is required')
    }

    if (!data.passengerPhone) {
      throw new Error('Passenger phone is required')
    }

    if (!validatePhoneNumber(data.passengerPhone)) {
      throw new Error('Invalid phone number format')
    }

    if (data.passengerEmail && !/\S+@\S+\.\S+/.test(data.passengerEmail)) {
      throw new Error('Invalid email format')
    }

    if (!data.vehicleId) {
      throw new Error('Vehicle selection is required')
    }

    // Validate booking date is not in the past
    const bookingDate = new Date(data.bookingDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (bookingDate < today) {
      throw new Error('Booking date cannot be in the past')
    }
  }

  /**
   * Check booking availability (basic validation)
   */
  async checkAvailability(vehicleId: string, bookingDate: Date): Promise<boolean> {
    const vehicle = await this.vehicleRepository.getVehicleById(vehicleId)
    
    if (!vehicle) {
      return false
    }

    if (!vehicle.isAvailable) {
      return false
    }

    // For now, we'll do basic availability checking
    // In a more complex system, you'd check for existing bookings on the same date
    return true
  }

  /**
   * Get bookings by vehicle ID
   */
  async getBookingsByVehicleId(vehicleId: string): Promise<Booking[]> {
    return this.bookingRepository.findByVehicleId(vehicleId)
  }

  /**
   * Get booking by ID with masked passenger data (for public access)
   */
  async getBookingByIdMasked(id: string): Promise<Booking | null> {
    const booking = await this.bookingRepository.findById(id)
    if (!booking) return null

    // Mask passenger data if passenger exists
    if (booking.passenger) {
      booking.passenger = {
        ...booking.passenger,
        name: maskPassengerData(booking.passenger).name,
        phone: maskPassengerData(booking.passenger).phone,
        email: maskPassengerData(booking.passenger).email
      }
    }

    return booking
  }

  /**
   * Get bookings by passenger ID with masked passenger data (for public access)
   */
  async getBookingsByPassengerIdMasked(passengerId: string): Promise<Booking[]> {
    const bookings = await this.bookingRepository.findByPassengerId(passengerId)
    
    return bookings.map(booking => {
      if (booking.passenger) {
        booking.passenger = {
          ...booking.passenger,
          name: maskPassengerData(booking.passenger).name,
          phone: maskPassengerData(booking.passenger).phone,
          email: maskPassengerData(booking.passenger).email
        }
      }
      return booking
    })
  }

  /**
   * Get all bookings with masked passenger data (for public access)
   */
  async getAllBookingsMasked(options: {
    page?: number
    limit?: number
    status?: string
  } = {}): Promise<{ bookings: Booking[], total: number }> {
    const { bookings, total } = await this.bookingRepository.findAll(options)
    
    const maskedBookings = bookings.map(booking => {
      if (booking.passenger) {
        booking.passenger = {
          ...booking.passenger,
          name: maskPassengerData(booking.passenger).name,
          phone: maskPassengerData(booking.passenger).phone,
          email: maskPassengerData(booking.passenger).email
        }
      }
      return booking
    })

    return {
      bookings: maskedBookings,
      total
    }
  }
}
