# Clean Database Architecture

This directory contains a clean, extensible database architecture that supports multiple database providers and follows SOLID principles.

## 🏗️ Architecture Overview

```
API Layer (routes)
    ↓
Service Layer (business logic)
    ↓
Repository Layer (data access)
    ↓
Database Provider Layer (database abstraction)
    ↓
Database Providers (Cloudflare D1, PostgreSQL, MySQL, etc.)
```

## 📁 Directory Structure

### `/database/`
- **`types.ts`** - Core interfaces and types
- **`DatabaseFactory.ts`** - Factory for creating database providers
- **`/providers/`** - Database provider implementations
  - `CloudflareD1Provider.ts` - Cloudflare D1 implementation
  - `PostgreSQLProvider.ts` - PostgreSQL implementation (future)
  - `MySQLProvider.ts` - MySQL implementation (future)

### `/repositories/`
- **`BaseRepository.ts`** - Base repository with common database operations
- **`VehicleRepository.ts`** - Vehicle-specific data access

### `/services/`
- **`VehicleService.ts`** - Vehicle business logic
- **`ServiceFactory.ts`** - Service factory with dependency injection

## 🚀 Key Features

### 1. **Database Agnostic**
- Easy to switch between different database providers
- Consistent interface across all providers
- No vendor lock-in

### 2. **Extensible**
- Add new database providers by implementing `DatabaseProvider` interface
- Add new repositories by extending `BaseRepository`
- Add new services as needed

### 3. **Clean Code**
- Single Responsibility Principle
- Dependency Injection
- Repository Pattern
- Service Layer Pattern

### 4. **Type Safe**
- Full TypeScript support
- Proper error handling
- Interface-based design

## 🔧 Usage Examples

### Basic Usage
```typescript
// Get vehicle service
const vehicleService = ServiceFactory.getVehicleService()

// Get available vehicles
const vehicles = await vehicleService.getAvailableVehicles('sedan')

// Get vehicle by ID
const vehicle = await vehicleService.getVehicleById('vehicle-123')
```

### Adding New Database Provider
```typescript
// 1. Create new provider
export class MongoDBProvider implements DatabaseProvider {
  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    // MongoDB implementation
  }
}

// 2. Add to factory
static createProvider(type: DatabaseType, config: DatabaseConfig): DatabaseProvider {
  switch (type) {
    case 'mongodb':
      return new MongoDBProvider(config)
    // ... other cases
  }
}

// 3. Set environment variable
DATABASE_TYPE=mongodb
```

### Adding New Repository
```typescript
export class BookingRepository extends BaseRepository {
  async getBookingsByStatus(status: string): Promise<Booking[]> {
    const sql = 'SELECT * FROM bookings WHERE status = $1'
    const rows = await this.select(sql, [status])
    return rows.map(row => this.mapRowToBooking(row))
  }
}
```

## 🌍 Environment Configuration

### Cloudflare D1 (Current)
```bash
DATABASE_TYPE=cloudflare-d1
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN_D1=your_api_token
CLOUDFLARE_D1_DATABASE_ID=your_database_id
```

### PostgreSQL (Future)
```bash
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@host:port/database
```

### MySQL (Future)
```bash
DATABASE_TYPE=mysql
DATABASE_URL=mysql://user:password@host:port/database
```

## 🔄 Migration Strategy

To switch from Cloudflare D1 to another database:

1. **Update environment variables**
2. **Implement the new provider** (if not already done)
3. **Update SQL queries** if needed (different SQL dialects)
4. **Test thoroughly**

No changes needed in:
- Service layer
- Repository layer
- API routes
- Frontend components

## 🧪 Testing

Each layer can be tested independently:

```typescript
// Test repository with mock database
const mockDb = new MockDatabaseProvider()
const vehicleRepo = new VehicleRepository(mockDb)

// Test service with mock repository
const mockRepo = new MockVehicleRepository()
const vehicleService = new VehicleService(mockRepo)
```

## 📈 Benefits

1. **Maintainable** - Clear separation of concerns
2. **Testable** - Each layer can be unit tested
3. **Scalable** - Easy to add new features
4. **Flexible** - Switch databases without code changes
5. **Future-proof** - Ready for any database provider
