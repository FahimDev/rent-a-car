import { AdminRepository } from '../repositories/AdminRepository'
import { Admin } from '@/types'
import { comparePassword, signJWT } from '@/lib/auth'

export class AdminService {
  private adminRepository: AdminRepository

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository
  }

  /**
   * Authenticate admin user
   */
  async authenticate(username: string, password: string): Promise<{ admin: Admin; token: string } | null> {
    // Find admin by username
    const admin = await this.adminRepository.findByUsername(username)
    
    if (!admin) {
      return null
    }

    // Get admin with password for verification
    const adminWithPassword = await this.getAdminWithPassword(username)
    if (!adminWithPassword) {
      return null
    }

    // Verify password
    const isValidPassword = await comparePassword(password, adminWithPassword.password)
    
    if (!isValidPassword) {
      return null
    }

    // Update last login time
    await this.adminRepository.updateLastLogin(admin.id)

    // Generate JWT token
    const token = await signJWT(
      { 
        adminId: admin.id, 
        username: admin.username,
        role: admin.role 
      },
      process.env.JWT_SECRET || 'fallback-secret'
    )

    return { admin, token }
  }

  /**
   * Get admin with password (for authentication)
   */
  private async getAdminWithPassword(username: string): Promise<{ id: string; username: string; password: string; role: string } | null> {
    const sql = `
      SELECT id, username, password, role
      FROM admins 
      WHERE username = $1
    `
    
    const results = await this.adminRepository.select(sql, [username])
    
    if (results.length === 0) {
      return null
    }

    return results[0]
  }

  /**
   * Get admin by ID
   */
  async getAdminById(id: string): Promise<Admin | null> {
    return this.adminRepository.findById(id)
  }
}
