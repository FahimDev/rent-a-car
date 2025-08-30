# Technical Specifications - DriveShare

## Overview
This directory contains comprehensive technical specifications for the DriveShare car booking platform, including architecture, database design, API specifications, and deployment guidelines. The system is built as a simple Next.js application for easy deployment on cPanel hosting.

## Technical Areas

### 1. [System Architecture](architecture.md)
- Next.js application structure
- Frontend and backend integration
- Technology stack and frameworks
- File organization and routing
- Deployment architecture for cPanel

### 2. [Database Design](database-design.md)
- Mermaid ERD diagram for visualization
- Database schema and relationships
- Data models and entity relationships
- Sample data and common queries
- Migration and seeding strategy

### 3. [API Specifications](api-specifications.md)
- Next.js API routes design
- Request/response formats and schemas
- Authentication and authorization
- Error handling and status codes
- API documentation and examples

### 4. [Deployment Guide](deployment-guide.md)
- cPanel hosting setup and configuration
- Environment setup and configuration
- Database setup and migration
- Production deployment procedures
- Maintenance and monitoring

## Technology Stack

### Frontend & Backend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI or Radix UI
- **State Management**: React Context or Zustand
- **Form Handling**: React Hook Form

### Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Migration**: Prisma Migrate
- **Visualization**: Mermaid ERD

### External Services
- **WhatsApp**: WhatsApp Business API
- **Maps**: Google Maps API
- **File Storage**: Local storage or simple cloud storage

### Hosting
- **Platform**: cPanel hosting
- **Database**: Shared PostgreSQL
- **File Storage**: Local server storage

## Development Environment

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL (local development)
- Git

### Local Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npx prisma migrate dev`
5. Seed database: `npx prisma db seed`
6. Start development server: `npm run dev`

### Environment Configuration
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/driveshare"

# WhatsApp
WHATSAPP_API_KEY="your_whatsapp_api_key"
WHATSAPP_PHONE_NUMBER="your_whatsapp_number"

# Google Maps
GOOGLE_MAPS_API_KEY="your_google_maps_key"

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="secure_password"
```

## Code Quality and Standards

### Code Style and Formatting
- ESLint configuration for TypeScript
- Prettier for code formatting
- Husky for pre-commit hooks
- Consistent naming conventions

### Testing Strategy
- Unit testing with Jest
- Integration testing for API routes
- End-to-end testing with Playwright
- Manual testing for user flows

### Documentation Standards
- API documentation with examples
- Code documentation with JSDoc
- Component documentation
- Deployment and maintenance guides

## Performance and Optimization

### Next.js Optimizations
- Static generation for landing page
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Built-in caching strategies

### Database Optimization
- Proper indexing strategy
- Query optimization with Prisma
- Connection pooling
- Efficient data retrieval

### Mobile Optimization
- Progressive Web App features
- Responsive design
- Touch-friendly interface
- Fast loading times

## Security and Compliance

### Security Measures
- HTTPS enforcement
- Input validation and sanitization
- Admin authentication
- Secure environment variables

### Data Protection
- Password hashing with bcrypt
- Input sanitization
- Secure admin access
- Basic security best practices

## Deployment and Operations

### cPanel Deployment
- File upload via FTP or Git
- Database setup and migration
- Environment configuration
- Application startup

### Monitoring and Maintenance
- Basic error logging
- Performance monitoring
- Database backups
- Regular updates

## File Structure

```
driveshare/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Landing page
│   │   ├── vehicles/     # Vehicle gallery
│   │   ├── booking/      # Booking process
│   │   ├── admin/        # Admin panel
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── lib/             # Utilities
│   └── types/           # TypeScript types
├── prisma/              # Database schema
├── public/              # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## API Design

### RESTful Endpoints
```
GET    /api/vehicles          # Get all vehicles
POST   /api/vehicles          # Create vehicle (admin)
PUT    /api/vehicles/[id]     # Update vehicle (admin)
DELETE /api/vehicles/[id]     # Delete vehicle (admin)

POST   /api/bookings          # Create booking
GET    /api/bookings          # Get bookings (admin)
GET    /api/bookings/[id]     # Get booking details

POST   /api/admin/login       # Admin login
GET    /api/admin/bookings    # Admin booking list

POST   /api/whatsapp/notify   # Send WhatsApp notification
```

## Database Schema

### Core Entities
- **Vehicles**: Vehicle information and availability
- **Vehicle_Photos**: Multiple photos per vehicle
- **Passengers**: Passenger information (phone-based)
- **Bookings**: Booking details and status
- **Admins**: Admin user management
- **Company_Info**: Company details for landing page
- **Notifications**: WhatsApp notification tracking

### Key Relationships
- Vehicles have multiple photos
- Passengers can have multiple bookings
- Bookings trigger notifications to admins
- Simple one-to-many relationships

## Future Considerations

### Scalability
- Database optimization
- Caching implementation
- Performance monitoring
- Load balancing if needed

### Features
- Enhanced admin features
- Booking analytics
- Advanced notifications
- Mobile app development

---
**Related Documents:**
- [Product Concept Note](../product-concept-note.md) - Overall product vision
- [Module Specifications](../module/README.md) - Technical module breakdown
- [Functional Requirements](../functional/README.md) - Feature specifications

*Last Updated: [Current Date]*
*Document Owner: Development Team*
