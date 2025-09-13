# Development Guide

## Overview

This guide provides comprehensive instructions for developers working on the Rent-A-Car application. It covers setup, development workflow, architecture patterns, and best practices.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare account (for D1 database)
- Git

## Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd car-rental-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp env.example .env.local
```

Edit `.env.local`:
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

### 4. Database Setup
```bash
# Create D1 database
npx wrangler d1 create rent-a-car-db

# Run migrations
npx wrangler d1 execute rent-a-car-db --file=./schema.sql

# Seed database
npx wrangler d1 execute rent-a-car-db --file=./seed-d1.sql
```

### 5. Start Development
```bash
# With D1 bindings (recommended)
npm run dev:d1

# Or regular development
npm run dev
```

## Development Workflow

### 1. Feature Development

#### Step 1: Plan the Feature
- Identify which layers need changes
- Define data structures and interfaces
- Plan API endpoints

#### Step 2: Start with Types
```typescript
// src/types/index.ts
export interface NewFeature {
  id: string
  name: string
  // ... other properties
}
```

#### Step 3: Create Repository (if needed)
```typescript
// src/lib/repositories/NewFeatureRepository.ts
export class NewFeatureRepository extends BaseRepository<NewFeature> {
  constructor(database: DatabaseProvider) {
    super(database, 'new_features')
  }
  
  // Add specific methods if needed
  async findByCategory(category: string): Promise<NewFeature[]> {
    const sql = 'SELECT * FROM new_features WHERE category = ?'
    const result = await this.database.query(sql, [category])
    return this.mapRowsToEntities(result.data || [])
  }
}
```

#### Step 4: Create Service
```typescript
// src/lib/services/NewFeatureService.ts
export class NewFeatureService {
  constructor(private repository: NewFeatureRepository) {}
  
  async getFeaturesByCategory(category: string): Promise<NewFeature[]> {
    // Add business logic here
    return this.repository.findByCategory(category)
  }
}
```

#### Step 5: Update Service Factory
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

#### Step 6: Create API Route
```typescript
// src/app/api/new-features/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS, handleCORSPreflight } from '@/lib/api/cors'

export const runtime = 'edge'

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const service = ServiceFactory.getNewFeatureService()
    const features = await service.getFeaturesByCategory(category || '')
    
    const response = NextResponse.json({
      success: true,
      data: { features },
      count: features.length
    })
    
    return withCORS(response)
  } catch (error) {
    console.error('Error fetching features:', error)
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    return withCORS(response)
  }
}
```

#### Step 7: Update Frontend
```typescript
// src/lib/services/api/NewFeatureApiService.ts
import { apiGet, ApiResponse } from '@/lib/utils/api'

export class NewFeatureApiService {
  static async getFeaturesByCategory(category?: string): Promise<NewFeature[]> {
    const endpoint = category ? `/api/new-features?category=${encodeURIComponent(category)}` : '/api/new-features'
    const response = await apiGet<ApiResponse<{ features: NewFeature[] }>>(endpoint)
    
    if (!response || !response.success) {
      return []
    }
    
    return response.data?.features || []
  }
}
```

### 2. Database Changes

#### Adding New Tables
1. Update `schema.sql`:
```sql
CREATE TABLE new_features (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

2. Create migration:
```bash
# Create migration file
touch migrations/add_new_features_table.sql

# Add SQL to migration file
echo "CREATE TABLE new_features (...);" > migrations/add_new_features_table.sql
```

3. Run migration:
```bash
npx wrangler d1 execute rent-a-car-db --file=./migrations/add_new_features_table.sql
```

#### Modifying Existing Tables
1. Create migration file
2. Add ALTER statements
3. Run migration
4. Update repository if needed

### 3. API Development

#### CORS Handling
Always use the centralized CORS utility:

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

#### Error Handling
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

### 4. Frontend Development

#### Using API Services
```typescript
// In components
import { NewFeatureApiService } from '@/lib/services/api/NewFeatureApiService'

export default async function NewFeaturePage() {
  const features = await NewFeatureApiService.getFeaturesByCategory('premium')
  
  return (
    <div>
      {features.map(feature => (
        <div key={feature.id}>{feature.name}</div>
      ))}
    </div>
  )
}
```

#### Type Safety
Always use TypeScript interfaces:
```typescript
import { NewFeature } from '@/types'

interface NewFeaturePageProps {
  features: NewFeature[]
}
```

## Testing

### 1. Local Testing
```bash
# Start development server
npm run dev:d1

# Test API endpoints
curl -X GET "http://localhost:3000/api/vehicles"
curl -X GET "http://localhost:3000/api/company"
```

### 2. Database Testing
```bash
# Test D1 queries
npx wrangler d1 execute rent-a-car-db --command="SELECT * FROM vehicles LIMIT 5"
```

### 3. Production Testing
```bash
# Build for production
npm run pages:build

# Test production build locally
npm run start
```

## Deployment

### 1. Cloudflare Pages Deployment
```bash
# Build for Cloudflare Pages
npm run pages:build

# Deploy
npm run deploy
```

### 2. Environment Variables
Set these in Cloudflare Pages dashboard:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_D1_DATABASE_ID`
- `NEXT_PUBLIC_BASE_URL`

## Code Quality

### 1. TypeScript
- Always use TypeScript
- Define interfaces for all data structures
- Use strict type checking

### 2. Error Handling
- Handle errors at appropriate layers
- Use consistent error response formats
- Log errors for debugging

### 3. Code Organization
- Follow the established architecture
- Keep related code together
- Use meaningful names

### 4. Documentation
- Document complex business logic
- Update README when adding features
- Keep API documentation current

## Common Patterns

### 1. Adding New Database Provider
```typescript
// 1. Create provider class
export class NewDatabaseProvider implements DatabaseProvider {
  async query(sql: string, params?: any[]): Promise<QueryResult> {
    // Implementation
  }
}

// 2. Update factory
export class DatabaseFactory {
  static getProvider(type: 'd1' | 'postgres' | 'mysql' | 'new'): DatabaseProvider {
    switch (type) {
      case 'new':
        return new NewDatabaseProvider()
      // Other cases...
    }
  }
}
```

### 2. Adding New Service
```typescript
// 1. Create service class
export class NewService {
  constructor(private repository: NewRepository) {}
  
  async performOperation(): Promise<Result> {
    // Business logic
  }
}

// 2. Update service factory
export class ServiceFactory {
  static getNewService(): NewService {
    const database = DatabaseFactory.getDefaultProvider()
    const repository = new NewRepository(database)
    return new NewService(repository)
  }
}
```

### 3. Adding New API Endpoint
```typescript
// 1. Create API route
export async function GET(request: NextRequest) {
  const service = ServiceFactory.getNewService()
  const result = await service.performOperation()
  
  const response = NextResponse.json({ success: true, data: result })
  return withCORS(response)
}
```

## Troubleshooting

### 1. Database Connection Issues
- Check environment variables
- Verify D1 database exists
- Test with `npx wrangler d1 execute`

### 2. CORS Issues
- Ensure all API routes use `withCORS()`
- Check preflight handling
- Verify headers in browser dev tools

### 3. Type Errors
- Check interface definitions
- Ensure proper imports
- Use type assertions carefully

### 4. Build Issues
- Clear `.next` directory
- Check for TypeScript errors
- Verify all imports

## Best Practices

### 1. Architecture
- Follow clean architecture principles
- Keep layers separated
- Use dependency injection

### 2. Database
- Use parameterized queries
- Handle errors gracefully
- Test queries before deployment

### 3. API
- Use consistent response formats
- Handle errors properly
- Include CORS headers

### 4. Frontend
- Use TypeScript interfaces
- Handle loading states
- Implement error boundaries

### 5. Testing
- Test all layers
- Mock dependencies
- Test error scenarios

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For questions or issues:
1. Check this documentation
2. Review existing code patterns
3. Create an issue in the repository
4. Contact the development team
