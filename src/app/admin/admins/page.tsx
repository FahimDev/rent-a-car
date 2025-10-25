'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Users, Shield, Mail, Phone, Calendar, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { api } from '@/lib/api/utils'

interface Admin {
  id: string
  username: string
  email?: string
  phone?: string
  role: string
  createdAt: string
  updatedAt: string
}

export default function AdminManagementPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'admin'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchAdmins()
  }, [router])

  const fetchAdmins = async () => {
    try {
      const data = await api.admin.getAdmins()
      setAdmins(data.admins || [])
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error('Failed to load admins')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (createFormData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setIsCreating(true)

    try {
      await api.admin.createAdmin({
        username: createFormData.username,
        password: createFormData.password,
        email: createFormData.email || undefined,
        phone: createFormData.phone || undefined,
        role: createFormData.role
      })
      toast.success('Admin created successfully!')
      setShowCreateForm(false)
      setCreateFormData({
        username: '',
        password: '',
        email: '',
        phone: '',
        role: 'admin'
      })
      fetchAdmins()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create admin')
    } finally {
      setIsCreating(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCreateFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-mobile py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
              <p className="text-sm text-gray-600">Manage admin accounts and permissions</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </div>
      </div>

      <div className="container-mobile py-8">
        {/* Create Admin Form */}
        {showCreateForm && (
          <Card className="card-mobile mb-8">
            <CardHeader>
              <CardTitle>Create New Admin</CardTitle>
              <CardDescription>
                Add a new admin account to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAdmin} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter username"
                      value={createFormData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="input-mobile"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        value={createFormData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="input-mobile pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email (optional)"
                      value={createFormData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="input-mobile"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone (optional)"
                      value={createFormData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="input-mobile"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={createFormData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="input-mobile"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                    className="btn-mobile"
                  >
                    {isCreating ? 'Creating...' : 'Create Admin'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Admins List */}
        <Card className="card-mobile">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Admin Accounts ({admins.length})
            </CardTitle>
            <CardDescription>
              Manage existing admin accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {admins.length > 0 ? (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div key={admin.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{admin.username}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                            {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          {admin.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {admin.email}
                            </div>
                          )}
                          {admin.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {admin.phone}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Created: {formatDate(admin.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
                <p className="text-gray-600">Create the first admin account to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
