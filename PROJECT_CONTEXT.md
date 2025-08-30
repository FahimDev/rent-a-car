# DriveShare - Simple Car Booking Application

## Project Overview
DriveShare is a simple, professional car booking application designed for a car rental company. The platform provides a seamless booking experience for passengers while giving admins easy vehicle and booking management capabilities.

## Project Structure
```
car-rental-app/
├── PROJECT_CONTEXT.md          # Root context (this file)
├── docs/                       # Detailed documentation
│   ├── product-concept-note.md # Product vision and concept
│   ├── epic-stories.md         # High-level user stories
│   ├── functional/             # Functional requirements
│   │   ├── README.md
│   │   ├── passenger-booking.md
│   │   ├── admin-management.md
│   │   └── vehicle-management.md
│   ├── module/                 # Module specifications
│   │   ├── README.md
│   │   ├── booking-module.md
│   │   ├── admin-module.md
│   │   └── vehicle-module.md
│   └── technical/              # Technical specifications
│       ├── README.md
│       ├── architecture.md
│       ├── database-design.md
│       └── deployment-guide.md
└── src/                        # Application source code
```

## Technology Stack
- **Frontend**: React.js with TypeScript (Progressive Web App)
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: Simple admin login
- **Notifications**: WhatsApp integration
- **Maps**: Google Maps API
- **UI**: Mobile-first responsive design

## Key Features

### Passenger Features
1. **Landing Page**: Company details, services, location map
2. **Vehicle Gallery**: Browse available vehicles with filters
3. **Booking System**: 4-step booking process
4. **Mobile-First**: Progressive Web App experience

### Admin Features
1. **Vehicle Management**: Upload and manage vehicle data
2. **Booking Management**: View and manage bookings
3. **WhatsApp Notifications**: Receive booking alerts
4. **Simple Login**: Direct access via booking links

## User Types
1. **Passenger**: Anyone can book without registration
2. **Admin**: Company staff managing vehicles and bookings

## Booking Flow
1. **Step 1**: Date/time selection + Trip type (Single/Round)
2. **Step 2**: Pickup and drop-off locations
3. **Step 3**: Contact person details (name, phone)
4. **Step 4**: Preview and confirmation

## Vehicle Types
- 4-seat Sedan
- 7-seat Noah
- 12-seat Hiace

## Documentation Navigation
- **Start Here**: [Product Concept Note](docs/product-concept-note.md)
- **User Stories**: [Epic Stories](docs/epic-stories.md)
- **Functional Requirements**: [Functional README](docs/functional/README.md)
- **Module Specifications**: [Module README](docs/module/README.md)
- **Technical Specifications**: [Technical README](docs/technical/README.md)

## Development Phases
1. **Phase 1**: Landing page and vehicle gallery
2. **Phase 2**: Booking system with stepper
3. **Phase 3**: Admin panel and vehicle management
4. **Phase 4**: WhatsApp integration and notifications

## Cursor AI Integration
This project is designed to leverage Cursor AI's capabilities:
- Clear, focused requirements for accurate implementation
- Mobile-first PWA approach
- Simple, professional UI design
- Streamlined booking flow

---
*Last Updated: [Current Date]*
*Project Status: Planning Phase*
