import { DatabaseFactory } from '../database/DatabaseFactory'

export class AdminStatsService {
  private database = DatabaseFactory.getDefaultProvider()

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{
    totalBookings: number
    pendingBookings: number
    totalVehicles: number
    totalPassengers: number
  }> {
    const [
      totalBookingsResult,
      pendingBookingsResult,
      totalVehiclesResult,
      totalPassengersResult
    ] = await Promise.all([
      this.database.query('SELECT COUNT(*) as count FROM bookings', []),
      this.database.query('SELECT COUNT(*) as count FROM bookings WHERE status = $1', ['pending']),
      this.database.query('SELECT COUNT(*) as count FROM vehicles', []),
      this.database.query('SELECT COUNT(*) as count FROM passengers', [])
    ])

    if (!totalBookingsResult.success || !pendingBookingsResult.success || 
        !totalVehiclesResult.success || !totalPassengersResult.success) {
      throw new Error('Failed to fetch dashboard statistics')
    }

    return {
      totalBookings: totalBookingsResult.data?.[0]?.count || 0,
      pendingBookings: pendingBookingsResult.data?.[0]?.count || 0,
      totalVehicles: totalVehiclesResult.data?.[0]?.count || 0,
      totalPassengers: totalPassengersResult.data?.[0]?.count || 0
    }
  }
}
