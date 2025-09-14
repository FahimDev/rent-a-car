import { PassengerRepository } from '../repositories/PassengerRepository'
import { Passenger } from '@/types'
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/utils'

/**
 * Passenger Service
 * Contains business logic for passenger operations
 */
export class PassengerService {
  private passengerRepository: PassengerRepository

  constructor(passengerRepository: PassengerRepository) {
    this.passengerRepository = passengerRepository
  }

  /**
   * Create a new passenger
   */
  async createPassenger(passengerData: {
    phone: string
    name?: string
    email?: string
  }): Promise<Passenger> {
    // Validate phone number
    if (!validatePhoneNumber(passengerData.phone)) {
      throw new Error('Invalid phone number format')
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(passengerData.phone)

    // Check if passenger already exists
    const existingPassenger = await this.passengerRepository.findByPhone(formattedPhone)
    if (existingPassenger) {
      throw new Error('Passenger with this phone number already exists')
    }

    // Validate email if provided
    if (passengerData.email && !/\S+@\S+\.\S+/.test(passengerData.email)) {
      throw new Error('Invalid email format')
    }

    return this.passengerRepository.create({
      phone: formattedPhone,
      name: passengerData.name,
      email: passengerData.email,
      isVerified: false
    })
  }

  /**
   * Get passenger by ID
   */
  async getPassengerById(id: string): Promise<Passenger | null> {
    return this.passengerRepository.findById(id)
  }

  /**
   * Get passenger by phone number
   */
  async getPassengerByPhone(phone: string): Promise<Passenger | null> {
    const formattedPhone = formatPhoneNumber(phone)
    return this.passengerRepository.findByPhone(formattedPhone)
  }

  /**
   * Get all passengers with pagination and filters
   */
  async getPassengers(options: {
    page?: number
    limit?: number
    isVerified?: boolean
  } = {}): Promise<{ passengers: Passenger[], total: number }> {
    return this.passengerRepository.findAll(options)
  }

  /**
   * Update passenger information
   */
  async updatePassenger(id: string, updateData: {
    name?: string
    email?: string
  }): Promise<boolean> {
    const passenger = await this.passengerRepository.findById(id)
    if (!passenger) {
      throw new Error('Passenger not found')
    }

    // Validate email if provided
    if (updateData.email && !/\S+@\S+\.\S+/.test(updateData.email)) {
      throw new Error('Invalid email format')
    }

    return this.passengerRepository.updatePassenger(id, updateData)
  }

  /**
   * Verify passenger phone number
   */
  async verifyPassenger(phone: string): Promise<boolean> {
    const formattedPhone = formatPhoneNumber(phone)
    const passenger = await this.passengerRepository.findByPhone(formattedPhone)
    
    if (!passenger) {
      throw new Error('Passenger not found')
    }

    return this.passengerRepository.updateVerificationStatus(formattedPhone, true)
  }

  /**
   * Unverify passenger phone number
   */
  async unverifyPassenger(phone: string): Promise<boolean> {
    const formattedPhone = formatPhoneNumber(phone)
    const passenger = await this.passengerRepository.findByPhone(formattedPhone)
    
    if (!passenger) {
      throw new Error('Passenger not found')
    }

    return this.passengerRepository.updateVerificationStatus(formattedPhone, false)
  }

  /**
   * Delete passenger
   */
  async deletePassenger(id: string): Promise<boolean> {
    const passenger = await this.passengerRepository.findById(id)
    if (!passenger) {
      throw new Error('Passenger not found')
    }

    return this.passengerRepository.deletePassenger(id)
  }

  /**
   * Check if passenger exists by phone
   */
  async passengerExists(phone: string): Promise<boolean> {
    const formattedPhone = formatPhoneNumber(phone)
    return this.passengerRepository.existsByPhone(formattedPhone)
  }

  /**
   * Get passenger statistics
   */
  async getPassengerStats(): Promise<{
    total: number
    verified: number
    unverified: number
  }> {
    return this.passengerRepository.getStats()
  }

  /**
   * Find or create passenger (useful for booking process)
   */
  async findOrCreatePassenger(passengerData: {
    phone: string
    name?: string
    email?: string
  }): Promise<Passenger> {
    const formattedPhone = formatPhoneNumber(passengerData.phone)
    
    // Try to find existing passenger
    let passenger = await this.passengerRepository.findByPhone(formattedPhone)
    
    if (passenger) {
      // Update passenger info if provided
      if (passengerData.name || passengerData.email) {
        await this.passengerRepository.updatePassenger(passenger.id, {
          name: passengerData.name || passenger.name,
          email: passengerData.email || passenger.email
        })
        
        // Fetch updated passenger
        passenger = await this.passengerRepository.findById(passenger.id) as Passenger
      }
      
      return passenger
    }

    // Create new passenger
    return this.createPassenger(passengerData)
  }

  /**
   * Search passengers by name or phone
   */
  async searchPassengers(query: string, options: {
    page?: number
    limit?: number
  } = {}): Promise<{ passengers: Passenger[], total: number }> {
    // This would require a more complex SQL query with LIKE conditions
    // For now, we'll get all passengers and filter in memory
    // In a production system, you'd want to implement proper search in the repository
    const { passengers, total } = await this.getPassengers({ 
      page: 1, 
      limit: 1000 // Get all for now
    })

    const filteredPassengers = passengers.filter(passenger => 
      passenger.name?.toLowerCase().includes(query.toLowerCase()) ||
      passenger.phone.includes(query) ||
      passenger.email?.toLowerCase().includes(query.toLowerCase())
    )

    const { page = 1, limit = 10 } = options
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPassengers = filteredPassengers.slice(startIndex, endIndex)

    return {
      passengers: paginatedPassengers,
      total: filteredPassengers.length
    }
  }
}
