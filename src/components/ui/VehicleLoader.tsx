'use client'

interface VehicleLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  variant?: 'card' | 'list' | 'inline'
}

export function VehicleLoader({ 
  size = 'md', 
  text = 'Loading vehicles...', 
  className = '',
  variant = 'card'
}: VehicleLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Animated Car */}
          <div className="relative">
            {/* Road */}
            <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
            </div>
            
            {/* Moving Car */}
            <div className="absolute -top-4 left-0 animate-bounce">
              <svg 
                className={`${sizeClasses[size]} text-blue-600`}
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5 1.5 1.5 0 0 1 6.5 13 1.5 1.5 0 0 1 8 14.5m11-5.5H5l1-3h11l1 3z"/>
              </svg>
            </div>
            
            {/* Speed Lines */}
            <div className="absolute -top-2 left-8 space-y-1">
              <div className="w-2 h-0.5 bg-gray-400 animate-pulse"></div>
              <div className="w-3 h-0.5 bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-0.5 bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="text-center">
            <p className={`font-medium text-gray-700 ${textSizeClasses[size]}`}>
              {text}
            </p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              {/* Car Icon */}
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5 1.5 1.5 0 0 1 6.5 13 1.5 1.5 0 0 1 8 14.5m11-5.5H5l1-3h11l1 3z"/>
                </svg>
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              
              {/* Price */}
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        {/* Spinning Car */}
        <div className="animate-spin">
          <svg 
            className={`${sizeClasses[size]} text-blue-600`}
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5 1.5 1.5 0 0 1 6.5 13 1.5 1.5 0 0 1 8 14.5m11-5.5H5l1-3h11l1 3z"/>
          </svg>
        </div>
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</span>
      </div>
    )
  }

  return null
}

// Skeleton loader for vehicle cards
export function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
      {/* Image */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        
        {/* Features */}
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>
        
        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}

// Grid skeleton for multiple vehicles
export function VehicleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  )
}
