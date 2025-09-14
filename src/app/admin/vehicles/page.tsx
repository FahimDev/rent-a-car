'use client'
export const runtime = "edge";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Car, 
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { api } from '@/lib/api/utils'

interface Vehicle {
  id: string
  name: string
  type: string
  capacity: number
  pricePerDay: number
  description: string
  features: string[]
  isAvailable: boolean
  photos: {
    id: string
    url: string
    alt: string
  }[]
  createdAt: string
  updatedAt: string
}

interface VehiclesApiResponse {
  vehicles: Vehicle[]
}

interface ErrorApiResponse {
  message: string
}

interface VehicleFormData {
  name: string
  type: string
  capacity: number
  pricePerDay: number
  description: string
  features: string
  isAvailable: boolean
  photos: File[]
  primaryImageIndex: number
}

export default function VehicleManagement() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [formData, setFormData] = useState<VehicleFormData>({
    name: '',
    type: '',
    capacity: 4,
    pricePerDay: 0,
    description: '',
    features: '',
    isAvailable: true,
    photos: [],
    primaryImageIndex: 0
  })

  const vehicleTypes = [
    { id: 'sedan', name: '4-Seat Sedan', capacity: 4 },
    { id: 'noah', name: '7-Seat Noah', capacity: 7 },
    { id: 'hiace', name: '12-Seat Hiace', capacity: 12 }
  ]

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchVehicles()
  }, [router])

  const fetchVehicles = async () => {
    try {
      const data = await api.admin.getVehicles()
      // Features are already parsed by the repository, so use them directly
      const vehiclesWithParsedFeatures = (data.vehicles || []).map((vehicle: any) => ({
        ...vehicle,
        features: vehicle.features || []
      }))
      setVehicles(vehiclesWithParsedFeatures)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error('Failed to load vehicles')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTypeChange = (typeId: string) => {
    const type = vehicleTypes.find(t => t.id === typeId)
    setFormData(prev => ({
      ...prev,
      type: typeId,
      capacity: type?.capacity || 4
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, photos: files, primaryImageIndex: 0 }))
  }

  const handlePrimaryImageChange = (index: number) => {
    setFormData(prev => ({ ...prev, primaryImageIndex: index }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('adminToken')
      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('type', formData.type)
      formDataToSend.append('capacity', formData.capacity.toString())
      formDataToSend.append('pricePerDay', formData.pricePerDay.toString())
      formDataToSend.append('description', formData.description)
      formDataToSend.append('features', formData.features)
      formDataToSend.append('isAvailable', formData.isAvailable.toString())
      
      // Add photos
      formData.photos.forEach((photo, index) => {
        formDataToSend.append(`photo_${index}`, photo)
      })
      
      // Add primary image index
      formDataToSend.append('primaryImageIndex', formData.primaryImageIndex.toString())

      const url = editingVehicle 
        ? `/api/admin/vehicles/${editingVehicle.id}`
        : '/api/admin/vehicles'
      
      const method = editingVehicle ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      })

      if (response.ok) {
        toast.success(editingVehicle ? 'Vehicle updated successfully' : 'Vehicle added successfully')
        setShowAddForm(false)
        setEditingVehicle(null)
        resetForm()
        fetchVehicles()
      } else {
        const error = await response.json() as ErrorApiResponse
        toast.error(error.message || 'Failed to save vehicle')
      }
    } catch (error) {
      console.error('Error saving vehicle:', error)
      toast.error('Failed to save vehicle')
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      pricePerDay: vehicle.pricePerDay,
      description: vehicle.description,
      features: vehicle.features.join(', '),
      isAvailable: vehicle.isAvailable,
      photos: [],
      primaryImageIndex: 0
    })
    setShowAddForm(true)
  }

  const handleDelete = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        toast.success('Vehicle deleted successfully')
        fetchVehicles()
      } else {
        toast.error('Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast.error('Failed to delete vehicle')
    }
  }

  const toggleAvailability = async (vehicleId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      })

      if (response.ok) {
        toast.success(`Vehicle ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        fetchVehicles()
      } else {
        toast.error('Failed to update vehicle status')
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error)
      toast.error('Failed to update vehicle status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      capacity: 4,
      pricePerDay: 0,
      description: '',
      features: '',
      isAvailable: true,
      photos: [],
      primaryImageIndex: 0
    })
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || vehicle.type === filterType
    return matchesSearch && matchesFilter
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
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
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
                <p className="text-sm text-gray-600">Manage your fleet of vehicles</p>
              </div>
            </div>
            <Button 
              onClick={() => {
                setShowAddForm(true)
                setEditingVehicle(null)
                resetForm()
              }}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
      </div>

      <div className="container-mobile py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                {vehicleTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
              <CardDescription>
                {editingVehicle ? 'Update vehicle information' : 'Add a new vehicle to your fleet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Vehicle Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Toyota Camry 2023"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Vehicle Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select type</option>
                      {vehicleTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerDay">Price per Day (BDT)</Label>
                    <Input
                      id="pricePerDay"
                      type="number"
                      value={formData.pricePerDay}
                      onChange={(e) => handleInputChange('pricePerDay', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the vehicle features, condition, etc."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => handleInputChange('features', e.target.value)}
                    placeholder="e.g., AC, GPS, Bluetooth, Leather Seats"
                  />
                </div>

                <div>
                  <Label htmlFor="photos">Vehicle Photos</Label>
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload multiple photos to showcase the vehicle (up to 10 images)
                  </p>
                  
                  {/* Photo Preview with Primary Selection */}
                  {formData.photos.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Select Primary Image:
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <div className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                              formData.primaryImageIndex === index 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <Image
                                src={URL.createObjectURL(photo)}
                                alt={`Preview ${index + 1}`}
                                width={150}
                                height={150}
                                className="w-full h-32 object-cover"
                                onClick={() => handlePrimaryImageChange(index)}
                              />
                              {formData.primaryImageIndex === index && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  Primary
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handlePrimaryImageChange(index)}
                                  className="opacity-0 hover:opacity-100 bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-medium transition-all"
                                >
                                  {formData.primaryImageIndex === index ? 'Primary' : 'Set Primary'}
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center truncate">
                              {photo.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <Label htmlFor="isAvailable">Available for booking</Label>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingVehicle(null)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                    {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="relative">
                {vehicle.photos.length > 0 ? (
                  <Image
                    src={vehicle.photos[0].url}
                    alt={vehicle.photos[0].alt}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-48 bg-gray-200 flex items-center justify-center"
                  style={{ display: vehicle.photos.length > 0 ? 'none' : 'flex' }}
                >
                  <Car className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vehicle.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{vehicle.name}</h3>
                  <span className="text-sm text-gray-500 capitalize">{vehicle.type}</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="font-medium">Capacity:</span>
                    <span className="ml-2">{vehicle.capacity} passengers</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Price:</span>
                    <span className="ml-2">৳{vehicle.pricePerDay}/day</span>
                  </div>
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div>
                      <span className="font-medium">Features:</span>
                      <span className="ml-2">{vehicle.features.join(', ')}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {vehicle.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAvailability(vehicle.id, vehicle.isAvailable)}
                    >
                      {vehicle.isAvailable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' ? 'No vehicles found' : 'No vehicles yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Add your first vehicle to start managing your fleet.'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button 
                onClick={() => {
                  setShowAddForm(true)
                  setEditingVehicle(null)
                  resetForm()
                }}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vehicle
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
