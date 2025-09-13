# Clean Architecture Documentation

## Overview

This project implements Clean Architecture principles to ensure maintainability, testability, and scalability. The architecture separates concerns into distinct layers with clear dependencies.

## Architecture Layers

### 1. Domain Layer (Types & Interfaces)
**Location**: `src/types/`, `src/lib/database/types.ts`

Contains core business entities and interfaces:
- `Vehicle` - Core vehicle entity
- `Booking` - Booking business logic
- `Passenger` - Customer information
- `CompanyInfo` - Company details
- `DatabaseProvider` - Database abstraction interface

### 2. Data Access Layer (Repositories)
**Location**: `src/lib/repositories/`

Handles data persistence and retrieval:
- `BaseRepository` - Common repository functionality
- `VehicleRepository` - Vehicle-specific data operations
- Implements Repository Pattern for data abstraction

### 3. Business Logic Layer (Services)
**Location**: `src/lib/services/`

Contains business rules and use cases:
- `VehicleService` - Vehicle business logic
- `ServiceFactory` - Service instantiation
- `VehicleApiService` - API-specific vehicle operations
- `CompanyApiService` - API-specific company operations

### 4. Infrastructure Layer (Database Providers)
**Location**: `src/lib/database/providers/`

Handles external dependencies:
- `CloudflareD1Provider` - Cloudflare D1 implementation
- `PostgreSQLProvider` - PostgreSQL implementation
- `MySQLProvider` - MySQL implementation
- `DatabaseFactory` - Provider instantiation

### 5. Presentation Layer (API Routes & Pages)
**Location**: `src/app/api/`, `src/app/`

Handles user interface and API endpoints:
- API routes with CORS handling
- Next.js pages and components
- Centralized CORS management

## Key Design Patterns

### 1. Repository Pattern
```typescript
// Abstract data access
interface BaseRepository<T> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<boolean>
}

// Concrete implementation
class VehicleRepository implements BaseRepository<Vehicle> {
  constructor(private database: DatabaseProvider) {}
  // Implementation details...
}
```

### 2. Service Layer Pattern
```typescript
// Business logic encapsulation
class VehicleService {
  constructor(private vehicleRepository: VehicleRepository) {}
  
  async getAvailableVehicles(type?: string): Promise<Vehicle[]> {
    // Business logic here
    return this.vehicleRepository.findAvailableByType(type)
  }
}
```

### 3. Factory Pattern
```typescript
// Provider instantiation
class DatabaseFactory {
  static getDefaultProvider(): DatabaseProvider {
    return new CloudflareD1Provider()
  }
}

class ServiceFactory {
  static getVehicleService(): VehicleService {
    const database = DatabaseFactory.getDefaultProvider()
    const repository = new VehicleRepository(database)
    return new VehicleService(repository)
  }
}
```

### 4. Strategy Pattern
```typescript
// Database provider switching
interface DatabaseProvider {
  query(sql: string, params?: any[]): Promise<QueryResult>
}

// Different implementations for different databases
class CloudflareD1Provider implements DatabaseProvider { }
class PostgreSQLProvider implements DatabaseProvider { }
class MySQLProvider implements DatabaseProvider { }
```

## Dependency Flow

```
API Routes → Services → Repositories → Database Providers
     ↓           ↓           ↓              ↓
  CORS      Business    Data Access    Infrastructure
  Utils     Logic       Layer          Layer
```

## Benefits

### 1. Maintainability
- Clear separation of concerns
- Easy to locate and modify specific functionality
- Consistent patterns throughout the codebase

### 2. Testability
- Each layer can be tested independently
- Easy to mock dependencies
- Business logic isolated from infrastructure

### 3. Scalability
- Easy to add new database providers
- Simple to extend with new features
- Clear boundaries for team collaboration

### 4. Flexibility
- Database provider can be switched without changing business logic
- Easy to add new API endpoints
- Simple to modify data access patterns

## Usage Examples

### Adding a New Database Provider

1. **Create Provider Class**:
```typescript
// src/lib/database/providers/NewDatabaseProvider.ts
export class NewDatabaseProvider implements DatabaseProvider {
  async query(sql: string, params?: any[]): Promise<QueryResult> {
    // Implementation
  }
}
```

2. **Update Factory**:
```typescript
// src/lib/database/DatabaseFactory.ts
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

### Adding a New Service

1. **Create Service Class**:
```typescript
// src/lib/services/NewService.ts
export class NewService {
  constructor(private repository: NewRepository) {}
  
  async performBusinessLogic(): Promise<Result> {
    // Business logic here
  }
}
```

2. **Update Service Factory**:
```typescript
// src/lib/services/ServiceFactory.ts
export class ServiceFactory {
  static getNewService(): NewService {
    const database = DatabaseFactory.getDefaultProvider()
    const repository = new NewRepository(database)
    return new NewService(repository)
  }
}
```

### Adding a New API Endpoint

1. **Create API Route**:
```typescript
// src/app/api/new-endpoint/route.ts
import { ServiceFactory } from '@/lib/services/ServiceFactory'
import { withCORS } from '@/lib/api/cors'

export async function GET() {
  const service = ServiceFactory.getNewService()
  const result = await service.performBusinessLogic()
  
  const response = NextResponse.json(result)
  return withCORS(response)
}
```

## Best Practices

### 1. Dependency Injection
- Always inject dependencies through constructors
- Use factories for complex object creation
- Avoid direct instantiation in business logic

### 2. Error Handling
- Handle errors at appropriate layers
- Use consistent error response formats
- Log errors for debugging

### 3. Type Safety
- Use TypeScript interfaces for all contracts
- Maintain type safety across layers
- Use generic types where appropriate

### 4. Testing
- Write unit tests for each layer
- Mock dependencies in tests
- Test business logic independently

## Migration Guide

### From Monolithic to Clean Architecture

1. **Identify Layers**: Separate concerns into appropriate layers
2. **Create Interfaces**: Define contracts between layers
3. **Implement Repositories**: Extract data access logic
4. **Create Services**: Move business logic to service layer
5. **Update Dependencies**: Use dependency injection
6. **Test Thoroughly**: Ensure all functionality works

### Adding New Features

1. **Start with Types**: Define data structures
2. **Create Repository**: Implement data access
3. **Build Service**: Add business logic
4. **Create API**: Expose functionality
5. **Update Factory**: Register new services
6. **Test Integration**: Ensure everything works together

## Conclusion

This clean architecture provides a solid foundation for building maintainable, testable, and scalable applications. By following these patterns and principles, the codebase remains organized and easy to work with as it grows.
