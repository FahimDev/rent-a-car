'use client'

interface LocationPinLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LocationPinLoader({ 
  size = 'md', 
  text = 'Locating...', 
  className = '' 
}: LocationPinLoaderProps) {
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

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Mobile Device Frame */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="relative w-20 h-32 bg-gray-800 rounded-2xl border-4 border-gray-600 shadow-lg">
          {/* Screen */}
          <div className="absolute inset-2 bg-gray-900 rounded-xl overflow-hidden">
            {/* Map Background */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 relative">
              {/* Map Grid Lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }} />
              </div>
              
              {/* Animated Location Pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* Pulsing Circle */}
                <div className="absolute inset-0 animate-ping">
                  <div className="w-6 h-6 bg-red-500 rounded-full opacity-75"></div>
                </div>
                
                {/* Location Pin */}
                <div className="relative">
                  <svg 
                    className={`${sizeClasses[size]} text-red-500 drop-shadow-lg animate-bounce`}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  
                  {/* Pin Shadow */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-black opacity-20 rounded-full blur-sm"></div>
                </div>
              </div>
              
              {/* Signal Waves */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 border-2 border-white opacity-30 rounded-full animate-ping"></div>
                <div className="absolute inset-0 w-20 h-20 border border-white opacity-20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-0 w-24 h-24 border border-white opacity-10 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
          
          {/* Home Button */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-600 rounded-full"></div>
        </div>
        
        {/* GPS Signal Indicator */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <p className={`font-medium text-gray-700 ${textSizeClasses[size]}`}>
          {text}
        </p>
        <div className="flex items-center justify-center space-x-1 mt-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

// Alternative simpler version for smaller spaces
export function SimpleLocationPinLoader({ 
  size = 'md', 
  text = 'Locating...', 
  className = '' 
}: LocationPinLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {/* Simple Pin Animation */}
      <div className="relative">
        {/* Pulsing Background */}
        <div className="absolute inset-0 animate-ping">
          <div className="w-12 h-12 bg-red-100 rounded-full"></div>
        </div>
        
        {/* Location Pin */}
        <svg 
          className={`${sizeClasses[size]} text-red-500 animate-bounce`}
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
      
      {/* Loading Text */}
      <p className="text-sm font-medium text-gray-600">{text}</p>
    </div>
  )
}
