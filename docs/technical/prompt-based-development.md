# Prompt-Based Development Guide

## Overview

This guide provides comprehensive instructions for AI agents and developers working on this project. It contains all necessary information to understand the architecture, patterns, and conventions used in the Rent-A-Car Bangladesh application.

## Project Context

### What This Project Is
- **Type**: Car rental booking application
- **Market**: Bangladesh (Bangla/English localization)
- **Architecture**: Clean Architecture with Repository Pattern
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Framework**: Next.js 15+ with Edge Runtime
- **Deployment**: Cloudflare Pages

### Key Business Requirements
- **Customer Journey**: Landing page → Vehicle gallery → 4-step booking
- **Admin Panel**: Dashboard, booking management, vehicle management
- **Mobile-First**: 90% mobile users, responsive design
- **No Registration**: Book without creating account
- **WhatsApp Integration**: Instant notifications for new bookings

## Architecture Overview

### Clean Architecture Layers
```
Presentation Layer (Pages, API Routes, Components)
    ↓
Business Logic Layer (Services)
    ↓
Data Access Layer (Repositories)
    ↓
Infrastructure Layer (Database Providers)
```

### Key Design Patterns
1. **Repository Pattern**: Data access abstraction
2. **Service Layer**: Business logic encapsulation
3. **Factory Pattern**: Provider instantiation
4. **Dependency Injection**: Loose coupling
5. **Strategy Pattern**: Database provider switching

## Code Organization

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── vehicles/          # Vehicle pages
│   └── booking/           # Booking pages
├── lib/                   # Core business logic
│   ├── database/          # Database abstraction
│   ├── repositories/      # Data access layer
│   ├── services/          # Business logic layer
│   ├── api/               # API utilities
│   └── utils/             # Utility functions
├── components/            # React components
└── types/                 # TypeScript definitions
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `VehicleGallery.tsx`)
- **Services**: PascalCase (e.g., `VehicleService.ts`)
- **Repositories**: PascalCase (e.g., `VehicleRepository.ts`)
- **Types**: PascalCase (e.g., `Vehicle.ts`)
- **Utilities**: camelCase (e.g., `apiUtils.ts`)

## Database Schema

### Core Tables
```sql
-- Vehicles table
CREATE TABLE vehicles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sedan', 'noah', 'hiace')),
  capacity INTEGER NOT NULL,
  price_per_day INTEGER NOT NULL,
  description TEXT,
  features TEXT, -- JSON string array
  is_available BOOLEAN DEFAULT 1,
  admin_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  passenger_id TEXT NOT NULL,
  vehicle_id TEXT NOT NULL,
  booking_date DATE NOT NULL,
  pickup_time TEXT NOT NULL,
  trip_type TEXT NOT NULL CHECK (trip_type IN ('single', 'round')),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Passengers table
CREATE TABLE passengers (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  is_verified BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Company info table
CREATE TABLE company_info (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  latitude REAL,
  longitude REAL,
  services TEXT, -- JSON string array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## TypeScript Types

### Core Types
```typescript
// Vehicle entity
export interface Vehicle {
  id: string
  name: string
  type: 'sedan' | 'noah' | 'hiace'
  capacity: number
  pricePerDay: number
  description?: string
  features?: string[]
  isAvailable: boolean
  adminId?: string
  createdAt: string
  updatedAt: string
  photos?: VehiclePhoto[]
}

// Booking entity
export interface Booking {
  id: string
  passengerId: string
  vehicleId: string
  bookingDate: string
  pickupTime: string
  tripType: 'single' | 'round'
  pickupLocation: string
  dropoffLocation?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
  passenger?: Passenger
  vehicle?: Vehicle
}

// Passenger entity
export interface Passenger {
  id: string
  phone: string
  name?: string
  email?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// Company info entity
export interface CompanyInfo {
  id: string
  name: string
  tagline?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  latitude?: number
  longitude?: number
  services?: string[]
  createdAt: string
  updatedAt: string
}
```

## API Patterns

### Standard API Response Format
```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "count": 10
}

// Error response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### CORS Handling
All API routes must use the centralized CORS utility:

```typescript
import { withCORS, handleCORSPreflight } from '@/lib/api/cors'

// For OPTIONS requests
export async function OPTIONS() {
  return handleCORSPreflight()
}

// For other requests
const response = NextResponse.json(data)
return withCORS(response)
```

### Error Handling Pattern
```typescript
try {
  // Business logic
  const result = await service.performOperation()
  
  const response = NextResponse.json({
    success: true,
    data: result
  })
  
  return withCORS(response)
} catch (error) {
  console.error('Operation failed:', error)
  
  const response = NextResponse.json(
    { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    },
    { status: 500 }
  )
  
  return withCORS(response)
}
```

## Service Layer Patterns

### Service Class Structure
```typescript
export class VehicleService {
  constructor(private vehicleRepository: VehicleRepository) {}
  
  async getAvailableVehicles(type?: string): Promise<Vehicle[]> {
    // Business logic here
    return this.vehicleRepository.findAvailableByType(type)
  }
  
  async createVehicle(vehicleData: CreateVehicleData): Promise<Vehicle> {
    // Validation
    if (!vehicleData.name) {
      throw new Error('Vehicle name is required')
    }
    
    // Business logic
    return this.vehicleRepository.create(vehicleData)
  }
}
```

### Service Factory Pattern
```typescript
export class ServiceFactory {
  static getVehicleService(): VehicleService {
    const database = DatabaseFactory.getDefaultProvider()
    const repository = new VehicleRepository(database)
    return new VehicleService(repository)
  }
}
```

## Repository Patterns

### Base Repository
```typescript
export abstract class BaseRepository<T> {
  constructor(
    protected database: DatabaseProvider,
    protected tableName: string
  ) {}
  
  async findById(id: string): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`
    const result = await this.database.query(sql, [id])
    return result.data?.[0] || null
  }
  
  async findAll(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName}`
    const result = await this.database.query(sql)
    return this.mapRowsToEntities(result.data || [])
  }
  
  abstract mapRowsToEntities(rows: any[]): T[]
}
```

### Concrete Repository
```typescript
export class VehicleRepository extends BaseRepository<Vehicle> {
  constructor(database: DatabaseProvider) {
    super(database, 'vehicles')
  }
  
  async findAvailableByType(type?: string): Promise<Vehicle[]> {
    let sql = 'SELECT * FROM vehicles WHERE is_available = 1'
    const params: any[] = []
    
    if (type) {
      sql += ' AND type = ?'
      params.push(type)
    }
    
    const result = await this.database.query(sql, params)
    return this.mapRowsToEntities(result.data || [])
  }
  
  mapRowsToEntities(rows: any[]): Vehicle[] {
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      capacity: row.capacity,
      pricePerDay: row.price_per_day,
      description: row.description,
      features: row.features ? JSON.parse(row.features) : [],
      isAvailable: Boolean(row.is_available),
      adminId: row.admin_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  }
}
```

## Database Provider Patterns

### Database Provider Interface
```typescript
export interface DatabaseProvider {
  query(sql: string, params?: any[]): Promise<QueryResult>
}

export interface QueryResult {
  success: boolean
  data?: any[]
  error?: string
}
```

### Cloudflare D1 Provider
```typescript
export class CloudflareD1Provider implements DatabaseProvider {
  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_D1_DATABASE_ID}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sql, params })
        }
      )
      
      const result = await response.json()
      
      if (!result.success) {
        return { success: false, error: result.errors?.[0]?.message || 'Database error' }
      }
      
      return { success: true, data: result.result?.[0]?.results || [] }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
```

## Frontend Patterns

### API Service Classes
```typescript
export class VehicleApiService {
  static async getAvailableVehicles(type?: string): Promise<Vehicle[]> {
    const endpoint = type ? `/api/vehicles?type=${encodeURIComponent(type)}` : '/api/vehicles'
    const response = await apiGet<ApiResponse<{ vehicles: Vehicle[] }>>(endpoint)
    
    if (!response || !response.success) {
      return []
    }
    
    return response.data?.vehicles || []
  }
}
```

### Component Patterns
```typescript
// Server component
export default async function VehiclePage() {
  const vehicles = await VehicleApiService.getAvailableVehicles()
  
  return (
    <div>
      <VehicleGallery vehicles={vehicles} />
    </div>
  )
}

// Client component
'use client'
export function VehicleGallery({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}
```

## Development Workflow

### Adding a New Feature

1. **Plan the Feature**
   - Identify affected layers
   - Define data structures
   - Plan API endpoints

2. **Start with Types**
   ```typescript
   // src/types/index.ts
   export interface NewFeature {
     id: string
     name: string
     // ... other properties
   }
   ```

3. **Create Repository**
   ```typescript
   // src/lib/repositories/NewFeatureRepository.ts
   export class NewFeatureRepository extends BaseRepository<NewFeature> {
     constructor(database: DatabaseProvider) {
       super(database, 'new_features')
     }
     
     // Add specific methods
   }
   ```

4. **Create Service**
   ```typescript
   // src/lib/services/NewFeatureService.ts
   export class NewFeatureService {
     constructor(private repository: NewFeatureRepository) {}
     
     // Add business logic
   }
   ```

5. **Update Service Factory**
   ```typescript
   // src/lib/services/ServiceFactory.ts
   export class ServiceFactory {
     static getNewFeatureService(): NewFeatureService {
       const database = DatabaseFactory.getDefaultProvider()
       const repository = new NewFeatureRepository(database)
       return new NewFeatureService(repository)
     }
   }
   ```

6. **Create API Route**
   ```typescript
   // src/app/api/new-features/route.ts
   export async function GET() {
     const service = ServiceFactory.getNewFeatureService()
     const features = await service.getAllFeatures()
     
     const response = NextResponse.json({
       success: true,
       data: { features }
     })
     
     return withCORS(response)
   }
   ```

7. **Update Frontend**
   ```typescript
   // src/lib/services/api/NewFeatureApiService.ts
   export class NewFeatureApiService {
     static async getFeatures(): Promise<NewFeature[]> {
       const response = await apiGet<ApiResponse<{ features: NewFeature[] }>>('/api/new-features')
       return response?.data?.features || []
     }
   }
   ```

### Database Changes

1. **Update Schema**
   ```sql
   -- schema.sql
   CREATE TABLE new_features (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Create Migration**
   ```sql
   -- migrations/add_new_features.sql
   CREATE TABLE new_features (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Run Migration**
   ```bash
   npx wrangler d1 execute rent-a-car-db --file=./migrations/add_new_features.sql
   ```

## Common Patterns and Conventions

### Error Handling
- Always use try-catch blocks
- Log errors for debugging
- Return consistent error responses
- Handle specific error types

### Type Safety
- Use TypeScript interfaces for all data structures
- Maintain type safety across layers
- Use generic types where appropriate
- Avoid `any` type

### Code Organization
- Keep related code together
- Use meaningful names
- Follow established patterns
- Document complex logic

### Testing
- Write unit tests for each layer
- Mock dependencies in tests
- Test business logic independently
- Test error scenarios

## Environment Variables

### Required Variables
```env
# Cloudflare D1 Database
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_API_TOKEN="your_api_token"
CLOUDFLARE_D1_DATABASE_ID="your_database_id"

# App Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"
```

### Development vs Production
- **Development**: Use `.env.local` file
- **Production**: Set in Cloudflare Pages dashboard
- **Secrets**: Never commit sensitive data

## Deployment Process

### 1. Build for Production
```bash
npm run pages:build
```

### 2. Deploy to Cloudflare Pages
```bash
npm run deploy
```

### 3. Set Environment Variables
Set in Cloudflare Pages dashboard:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_D1_DATABASE_ID`
- `NEXT_PUBLIC_BASE_URL`

### 4. Test Production
- Verify all endpoints work
- Check CORS headers
- Test admin functionality
- Verify database connectivity

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check environment variables
   - Verify D1 database exists
   - Test with `npx wrangler d1 execute`

2. **CORS Issues**
   - Ensure all API routes use `withCORS()`
   - Check preflight handling
   - Verify headers in browser dev tools

3. **Type Errors**
   - Check interface definitions
   - Ensure proper imports
   - Use type assertions carefully

4. **Build Issues**
   - Clear `.next` directory
   - Check for TypeScript errors
   - Verify all imports

### Debugging Steps

1. **Check Logs**
   - Console errors in browser
   - Server logs in terminal
   - Database query logs

2. **Verify Environment**
   - Check environment variables
   - Test database connectivity
   - Verify API endpoints

3. **Test Components**
   - Test individual functions
   - Mock dependencies
   - Use debugging tools

## Best Practices

### Code Quality
- Follow TypeScript best practices
- Use meaningful variable names
- Write self-documenting code
- Keep functions small and focused

### Architecture
- Follow clean architecture principles
- Keep layers separated
- Use dependency injection
- Maintain single responsibility

### Performance
- Use appropriate data structures
- Optimize database queries
- Implement caching where needed
- Monitor performance metrics

### Security
- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Handle errors securely

## Conclusion

This guide provides comprehensive information for working with the Rent-A-Car Bangladesh application. By following these patterns and conventions, developers can maintain consistency and quality while building new features and fixing issues.

The key principles are:
1. **Follow the Architecture**: Use the established patterns
2. **Maintain Type Safety**: Use TypeScript throughout
3. **Handle Errors Properly**: Implement consistent error handling
4. **Test Thoroughly**: Test all layers and scenarios
5. **Document Changes**: Update documentation when adding features

This project serves as a template for future development, demonstrating best practices in modern web application development with clean architecture principles.
