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
    isPrimary: boolean
    order: number
    createdAt: string
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
  existingPhotos?: {
    id: string
    url: string
    alt: string
    isPrimary: boolean
  }[]
}

export default function VehicleManagement() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    
    // Validate files for mobile compatibility
    const validFiles: File[] = []
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Please use JPEG, PNG, or WebP images.`)
        continue
      }
      
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Please use images under 5MB.`)
        continue
      }
      
      validFiles.push(file)
    }
    
    if (validFiles.length > 0) {
      setFormData(prev => ({ ...prev, photos: validFiles, primaryImageIndex: 0 }))
      if (validFiles.length !== files.length) {
        toast.error(`Only ${validFiles.length} of ${files.length} files were valid and added.`)
      }
    } else if (files.length > 0) {
      toast.error('No valid image files were selected.')
    }
  }

  const handlePrimaryImageChange = (index: number) => {
    setFormData(prev => ({ ...prev, primaryImageIndex: index }))
  }

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => {
      const newPhotos = prev.photos.filter((_, i) => i !== index)
      const newPrimaryIndex = prev.primaryImageIndex >= newPhotos.length 
        ? Math.max(0, newPhotos.length - 1)
        : prev.primaryImageIndex
      return { 
        ...prev, 
        photos: newPhotos, 
        primaryImageIndex: newPrimaryIndex 
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Vehicle name is required')
      return
    }
    if (!formData.type) {
      toast.error('Vehicle type is required')
      return
    }
    if (!formData.pricePerDay || formData.pricePerDay <= 0) {
      toast.error('Valid price per day is required')
      return
    }
    if (!formData.description.trim()) {
      toast.error('Vehicle description is required')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append('name', formData.name.trim())
      formDataToSend.append('type', formData.type)
      formDataToSend.append('capacity', formData.capacity.toString())
      formDataToSend.append('pricePerDay', formData.pricePerDay.toString())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('features', formData.features.trim())
      formDataToSend.append('isAvailable', formData.isAvailable.toString())
      
      // Add photos
      formData.photos.forEach((photo, index) => {
        formDataToSend.append(`photo_${index}`, photo)
      })
      
      // For editing, calculate the correct primary image index
      // If we have new photos, the primary index refers to new photos
      // If no new photos, we need to handle existing photos differently
      let primaryImageIndex = formData.primaryImageIndex
      
      if (editingVehicle && formData.photos.length === 0 && formData.existingPhotos) {
        // If no new photos, we're working with existing photos
        // The primaryImageIndex should refer to existing photos
        primaryImageIndex = formData.primaryImageIndex
      }
      
      formDataToSend.append('primaryImageIndex', primaryImageIndex.toString())

      if (editingVehicle) {
        const response = await api.admin.updateVehicle(editingVehicle.id, formDataToSend)
        if (response) {
          toast.success('Vehicle updated successfully')
          setShowAddForm(false)
          setEditingVehicle(null)
          resetForm()
          fetchVehicles()
        }
      } else {
        const response = await api.admin.createVehicle(formDataToSend)
        if (response) {
          toast.success('Vehicle added successfully')
          setShowAddForm(false)
          resetForm()
          fetchVehicles()
        }
      }
    } catch (error) {
      console.error('Error saving vehicle:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save vehicle'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    
    // Find the primary photo index
    const primaryPhotoIndex = vehicle.photos.findIndex(photo => photo.isPrimary)
    const validPrimaryIndex = primaryPhotoIndex >= 0 ? primaryPhotoIndex : 0
    
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      pricePerDay: vehicle.pricePerDay,
      description: vehicle.description,
      features: vehicle.features.join(', '),
      isAvailable: vehicle.isAvailable,
      photos: [], // New photos will be added here
      primaryImageIndex: validPrimaryIndex,
      existingPhotos: vehicle.photos // Store existing photos for display
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
      primaryImageIndex: 0,
      existingPhotos: undefined
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="btn-mobile">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Vehicle Management</h1>
                <p className="text-xs sm:text-sm text-gray-600">Manage your fleet of vehicles</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setShowAddForm(true)
                setEditingVehicle(null)
                resetForm()
              }}
              className="bg-primary-600 hover:bg-primary-700 btn-mobile w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Vehicle</span>
              <span className="sm:hidden">Add</span>
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
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Car className="h-5 w-5 mr-2" />
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {editingVehicle ? 'Update vehicle information' : 'Add a new vehicle to your fleet'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="name">Vehicle Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Toyota Camry 2023"
                      className="btn-mobile"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Vehicle Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 btn-mobile"
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.capacity || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        const numValue = value === '' ? 4 : parseInt(value)
                        handleInputChange('capacity', isNaN(numValue) ? 4 : numValue)
                      }}
                      min="1"
                      max="20"
                      placeholder="Enter capacity"
                      className="btn-mobile"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerDay">Price per Day (BDT)</Label>
                    <Input
                      id="pricePerDay"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.pricePerDay || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        const numValue = value === '' ? 0 : parseFloat(value)
                        handleInputChange('pricePerDay', isNaN(numValue) ? 0 : numValue)
                      }}
                      min="0"
                      step="0.01"
                      placeholder="Enter daily rental price"
                      className="btn-mobile"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 btn-mobile"
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
                    className="btn-mobile"
                  />
                </div>

                <div>
                  <Label htmlFor="photos" className="text-base font-semibold text-gray-900">
                    Vehicle Photos <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 transition-colors">
                    <Input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="photos" className={`cursor-pointer ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing photos...
                            </span>
                          ) : formData.photos.length > 0 ? (
                            `${formData.photos.length} photo(s) selected`
                          ) : (
                            'Tap to upload photos'
                          )}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-4">
                          Upload up to 10 images (JPEG, PNG, WebP)
                        </p>
                        <Button type="button" variant="outline" className="px-4 sm:px-6 py-2 btn-mobile">
                          Choose Photos
                        </Button>
                      </div>
                    </label>
                  </div>
                  {formData.photos.length > 0 && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {formData.photos.length} photo(s) ready to upload
                    </p>
                  )}
                  
                  {/* Existing Photos (when editing) */}
                  {editingVehicle && formData.existingPhotos && formData.existingPhotos.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-semibold text-gray-900">
                          Existing Photos
                        </Label>
                        <span className="text-sm text-gray-500">
                          {formData.existingPhotos.length} existing photo(s)
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {formData.existingPhotos.map((photo, index) => (
                          <div key={photo.id} className="relative group">
                            <div className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                              formData.primaryImageIndex === index && formData.photos.length === 0
                                ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg' 
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                            }`}>
                              <Image
                                src={photo.url}
                                alt={photo.alt}
                                width={150}
                                height={150}
                                className="w-full h-32 object-cover"
                                onClick={() => {
                                  // When clicking existing photos, set as primary if no new photos
                                  if (formData.photos.length === 0) {
                                    handlePrimaryImageChange(index)
                                  }
                                }}
                              />
                              
                              {/* Primary Badge */}
                              {formData.primaryImageIndex === index && formData.photos.length === 0 && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                                  <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Primary
                                </div>
                              )}
                              
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (formData.photos.length === 0) {
                                      handlePrimaryImageChange(index)
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                  {formData.primaryImageIndex === index && formData.photos.length === 0 ? '✓ Primary' : 'Set Primary'}
                                </button>
                              </div>
                              
                              {/* Photo Number */}
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                                {index + 1}
                              </div>
                            </div>
                            
                            {/* Photo Name */}
                            <p className="text-xs text-gray-600 mt-2 text-center truncate font-medium">
                              {photo.alt}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Instructions */}
                      <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>💡 Tip:</strong> Click on any existing photo to set it as primary. Upload new photos below to add more images.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Photo Preview with Primary Selection */}
                  {formData.photos.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-semibold text-gray-900">
                          Photo Preview & Primary Selection
                        </Label>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">
                            {formData.photos.length} of 10 photos
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, photos: [], primaryImageIndex: 0 }))}
                            className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <div className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                              formData.primaryImageIndex === index 
                                ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg' 
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                            }`}>
                              <Image
                                src={URL.createObjectURL(photo)}
                                alt={`Preview ${index + 1}`}
                                width={150}
                                height={150}
                                className="w-full h-32 object-cover"
                                onClick={() => handlePrimaryImageChange(index)}
                              />
                              
                              {/* Primary Badge */}
                              {formData.primaryImageIndex === index && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                                  <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Primary
                                </div>
                              )}
                              
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handlePrimaryImageChange(index)}
                                  className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                  {formData.primaryImageIndex === index ? '✓ Primary' : 'Set Primary'}
                                </button>
                              </div>
                              
                              {/* Photo Number */}
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                                {index + 1}
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemovePhoto(index)
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Photo Name */}
                            <p className="text-xs text-gray-600 mt-2 text-center truncate font-medium">
                              {photo.name}
                            </p>
                            
                            {/* File Size */}
                            <p className="text-xs text-gray-400 text-center">
                              {(photo.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Instructions */}
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>💡 Tip:</strong> Click on any photo to set it as the primary image. The primary image will be displayed first in the vehicle gallery.
                        </p>
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

                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingVehicle(null)
                      resetForm()
                    }}
                    className="btn-mobile"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary-600 hover:bg-primary-700 btn-mobile"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingVehicle ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingVehicle ? 'Update Vehicle' : 'Add Vehicle'
                    )}
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
