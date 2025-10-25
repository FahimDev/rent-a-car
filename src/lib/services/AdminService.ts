import { AdminRepository } from '../repositories/AdminRepository'
import { Admin } from '@/types'
import { comparePassword, signJWT, hashPassword } from '@/lib/auth'

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
    return this.adminRepository.findByUsernameWithPassword(username)
  }

  /**
   * Get admin by ID
   */
  async getAdminById(id: string): Promise<Admin | null> {
    return this.adminRepository.findById(id)
  }

  /**
   * Update admin password
   */
  async updatePassword(adminId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    // Get admin by ID first
    const admin = await this.adminRepository.findById(adminId)
    if (!admin) {
      throw new Error('Admin not found')
    }

    // Get admin with password for verification using the same method as login
    const adminWithPassword = await this.getAdminWithPassword(admin.username)
    
    if (!adminWithPassword) {
      throw new Error('Admin credentials not found')
    }

    // Verify current password using the same method as login
    const isValidPassword = await comparePassword(currentPassword, adminWithPassword.password)
    if (!isValidPassword) {
      throw new Error('Current password is incorrect')
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    return this.adminRepository.updatePassword(adminId, hashedNewPassword)
  }

  /**
   * Create new admin
   */
  async createAdmin(adminData: {
    username: string
    password: string
    email?: string
    phone?: string
    role?: string
  }): Promise<Admin> {
    // Check if username already exists
    const usernameExists = await this.adminRepository.usernameExists(adminData.username)
    if (usernameExists) {
      throw new Error('Username already exists')
    }

    // Hash password
    const hashedPassword = await hashPassword(adminData.password)

    // Create admin
    return this.adminRepository.create({
      ...adminData,
      password: hashedPassword
    })
  }

  /**
   * Get all admins
   */
  async getAllAdmins(): Promise<Admin[]> {
    return this.adminRepository.getAll()
  }
}
