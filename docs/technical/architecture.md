# System Architecture - DriveShare

## Overview
DriveShare is a simple Next.js application that combines frontend and backend in a single framework. The system is designed for easy deployment on cPanel hosting with minimal complexity.

## Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                      │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Frontend      │    │    Backend      │                │
│  │   (React)       │◄──►│   (API Routes)  │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   File Storage  │    │   WhatsApp API  │
│   Database      │    │   (Local/Cloud) │    │   Integration   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

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

### External Services
- **WhatsApp**: WhatsApp Business API
- **Maps**: Google Maps API
- **File Storage**: Local storage or simple cloud storage

### Hosting
- **Platform**: cPanel hosting
- **Database**: Shared PostgreSQL
- **File Storage**: Local server storage

## Component Architecture

### 1. Frontend Components
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── vehicles/          # Vehicle gallery
│   ├── booking/           # Booking process
│   └── admin/             # Admin panel
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
└── lib/                  # Utilities and helpers
```

### 2. Backend API Routes
```
src/
└── app/
    └── api/              # Next.js API routes
        ├── vehicles/     # Vehicle management
        ├── bookings/     # Booking operations
        ├── admin/        # Admin operations
        └── whatsapp/     # WhatsApp integration
```

### 3. Database Layer
```
prisma/
├── schema.prisma         # Database schema
├── migrations/           # Database migrations
└── seed.ts              # Sample data
```

## Data Flow

### Passenger Booking Flow
1. **Landing Page**: Static page with company info
2. **Vehicle Gallery**: API call to fetch vehicles
3. **Booking Process**: API calls for each step
4. **Confirmation**: Create booking and send WhatsApp notification

### Admin Management Flow
1. **Login**: Simple authentication
2. **Vehicle Management**: CRUD operations via API
3. **Booking View**: Fetch and display bookings
4. **Notifications**: Receive WhatsApp alerts

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

## Security Considerations

### Simple Security
- **Admin Authentication**: Basic session-based auth
- **Input Validation**: Form validation and sanitization
- **CORS**: Configured for same-origin requests
- **Environment Variables**: Secure configuration

### Data Protection
- **Password Hashing**: bcrypt for admin passwords
- **Input Sanitization**: Prevent XSS and injection
- **HTTPS**: Secure communication

## Performance Optimization

### Next.js Optimizations
- **Static Generation**: Landing page and vehicle gallery
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic by Next.js
- **Caching**: Built-in caching strategies

### Database Optimization
- **Connection Pooling**: Prisma connection management
- **Indexing**: Proper database indexes
- **Query Optimization**: Efficient Prisma queries

## Deployment

### cPanel Hosting Setup
1. **Upload Code**: Git or direct upload
2. **Install Dependencies**: `npm install`
3. **Build Application**: `npm run build`
4. **Configure Database**: Set up PostgreSQL
5. **Environment Variables**: Configure production settings
6. **Start Application**: `npm start`

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

## Development Workflow

### Local Development
1. **Setup**: Clone repository and install dependencies
2. **Database**: Run Prisma migrations and seed data
3. **Development**: `npm run dev`
4. **Testing**: Manual testing and basic validation

### Production Deployment
1. **Build**: `npm run build`
2. **Upload**: Deploy to cPanel hosting
3. **Database**: Run production migrations
4. **Configure**: Set environment variables
5. **Start**: Launch application

## Monitoring and Maintenance

### Simple Monitoring
- **Error Logging**: Basic error tracking
- **Performance**: Monitor page load times
- **Database**: Monitor query performance
- **Uptime**: Basic availability monitoring

### Maintenance Tasks
- **Regular Updates**: Keep dependencies updated
- **Database Backups**: Regular PostgreSQL backups
- **Log Rotation**: Manage application logs
- **Security Updates**: Monitor for vulnerabilities

## Future Considerations

### Scalability
- **Database Optimization**: Query optimization and indexing
- **Caching**: Implement Redis for caching
- **CDN**: Add CDN for static assets
- **Load Balancing**: If needed for high traffic

### Features
- **Analytics**: Basic booking analytics
- **Notifications**: Enhanced notification system
- **Mobile App**: React Native or PWA enhancement
- **Multi-language**: Internationalization support

---
**Related Documents:**
- [Database Design](database-design.md) - Database schema with Mermaid ERD
- [API Specifications](api-specifications.md) - API design and endpoints
- [Deployment Guide](deployment-guide.md) - Deployment instructions

*Last Updated: [Current Date]*
*Document Owner: Development Team*
