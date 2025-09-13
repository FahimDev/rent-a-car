# AI Agent Quick Reference

## Project Overview
- **Type**: Car rental booking app for Bangladesh
- **Architecture**: Clean Architecture + Repository Pattern
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Framework**: Next.js 15+ with Edge Runtime
- **Deployment**: Cloudflare Pages

## Key Files to Read First
1. `PROJECT_CONTEXT.md` - High-level overview
2. `docs/technical/clean-architecture.md` - Architecture patterns
3. `docs/technical/prompt-based-development.md` - Complete development guide
4. `src/types/index.ts` - TypeScript definitions
5. `src/lib/services/ServiceFactory.ts` - Service instantiation

## Quick Start Commands
```bash
# Development
npm run dev:d1

# Build for production
npm run pages:build

# Deploy
npm run deploy
```

## Architecture Layers
```
Pages/API Routes → Services → Repositories → Database Providers
```

## Common Patterns

### Adding New API Endpoint
```typescript
// 1. Create service method
export class NewService {
  async getData(): Promise<Data[]> {
    return this.repository.findAll()
  }
}

// 2. Update ServiceFactory
export class ServiceFactory {
  static getNewService(): NewService {
    const database = DatabaseFactory.getDefaultProvider()
    const repository = new NewRepository(database)
    return new NewService(repository)
  }
}

// 3. Create API route
export async function GET() {
  const service = ServiceFactory.getNewService()
  const data = await service.getData()
  
  const response = NextResponse.json({ success: true, data })
  return withCORS(response)
}
```

### Adding New Database Table
```sql
-- 1. Update schema.sql
CREATE TABLE new_table (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create migration
-- migrations/add_new_table.sql
CREATE TABLE new_table (...);

-- 3. Run migration
npx wrangler d1 execute rent-a-car-db --file=./migrations/add_new_table.sql
```

### Adding New Service
```typescript
// 1. Create service class
export class NewService {
  constructor(private repository: NewRepository) {}
  
  async performOperation(): Promise<Result> {
    // Business logic
  }
}

// 2. Update ServiceFactory
export class ServiceFactory {
  static getNewService(): NewService {
    const database = DatabaseFactory.getDefaultProvider()
    const repository = new NewRepository(database)
    return new NewService(repository)
  }
}
```

## CORS Handling
**ALWAYS** use centralized CORS utility:
```typescript
import { withCORS, handleCORSPreflight } from '@/lib/api/cors'

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET() {
  const response = NextResponse.json(data)
  return withCORS(response)
}
```

## Error Handling Pattern
```typescript
try {
  const result = await service.performOperation()
  const response = NextResponse.json({ success: true, data: result })
  return withCORS(response)
} catch (error) {
  console.error('Operation failed:', error)
  const response = NextResponse.json(
    { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
    { status: 500 }
  )
  return withCORS(response)
}
```

## Database Provider
```typescript
// Use DatabaseFactory for database access
const database = DatabaseFactory.getDefaultProvider()
const result = await database.query('SELECT * FROM table', [params])
```

## TypeScript Types
```typescript
// Always use interfaces from src/types/index.ts
import { Vehicle, Booking, Passenger } from '@/types'

// API response format
interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  error?: string
}
```

## Environment Variables
```env
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_API_TOKEN="your_api_token"
CLOUDFLARE_D1_DATABASE_ID="your_database_id"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Common Issues & Solutions

### Database Connection Issues
- Check environment variables
- Test with: `npx wrangler d1 execute rent-a-car-db --command="SELECT 1"`

### CORS Issues
- Ensure all API routes use `withCORS()`
- Check preflight handling with OPTIONS method

### Type Errors
- Check interface definitions in `src/types/index.ts`
- Ensure proper imports
- Use type assertions carefully

### Build Issues
- Clear `.next` directory
- Check TypeScript errors
- Verify all imports

## File Locations
- **API Routes**: `src/app/api/`
- **Services**: `src/lib/services/`
- **Repositories**: `src/lib/repositories/`
- **Types**: `src/types/index.ts`
- **Database**: `src/lib/database/`
- **CORS**: `src/lib/api/cors.ts`

## Testing
```bash
# Test API endpoints
curl -X GET "http://localhost:3000/api/vehicles"
curl -X GET "http://localhost:3000/api/company"

# Test database
npx wrangler d1 execute rent-a-car-db --command="SELECT * FROM vehicles LIMIT 5"
```

## Deployment
1. Build: `npm run pages:build`
2. Deploy: `npm run deploy`
3. Set environment variables in Cloudflare Pages dashboard
4. Test production endpoints

## Key Principles
1. **Follow Clean Architecture**: Use established patterns
2. **Maintain Type Safety**: Use TypeScript throughout
3. **Handle Errors Properly**: Implement consistent error handling
4. **Use CORS Utility**: Always use centralized CORS management
5. **Test Thoroughly**: Test all layers and scenarios

## Quick Reference Links
- [Clean Architecture Guide](clean-architecture.md)
- [API Documentation](api-documentation.md)
- [Development Guide](development-guide.md)
- [Database Schema](database-schema.md)
- [Prompt-Based Development](prompt-based-development.md)
