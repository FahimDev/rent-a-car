# Rent-A-Car - Simple Car Booking Application

## Project Overview
Rent-A-Car is a simple, professional car booking application designed for a car rental company. The platform provides a seamless booking experience for passengers while giving admins easy vehicle and booking management capabilities.

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

## Project Clarifications (Updated)

### Core Business Model
- **Simple Form Submission System**: No complex inventory or real-time availability
- **Mobile-First Design**: 90% mobile users, 10% desktop
- **Manual Admin Process**: Trust-based system with manual verification
- **Offline Payments**: No online payment integration required

### Authentication Strategy
- **Admin**: Username/password with NextAuth.js (Super Admin + Regular Admin roles)
- **Passengers**: No authentication portal - simple form submission only
- **Verification**: Manual phone verification by admin (no OTP system)

### Key Features (Simplified)
1. **Vehicle Gallery**: Browse and select vehicles
2. **Booking Form**: Mobile number + details submission
3. **Admin Dashboard**: Manage bookings, verify passengers, track payments
4. **WhatsApp Integration**: Notifications for verified WhatsApp users
5. **Manual Payment Tracking**: Offline payment with Excel export
6. **Basic Analytics**: Simple business metrics dashboard

### Mobile Number as Primary Key
- **Unique Identifier**: One mobile number = One passenger record
- **Multiple Bookings**: Same number can book multiple times
- **Manual Verification**: Admin calls to verify legitimacy
- **Country Code Validation**: Required for all mobile numbers
- **Immutable**: Cannot change mobile number in existing bookings

### Admin Capabilities
- **Passenger Verification**: Mark mobile numbers as verified after call
- **WhatsApp Status**: Track which passengers use WhatsApp
- **Payment Management**: Manual payment entry and tracking
- **Booking Modification**: Super Admin can modify (except mobile number)
- **Analytics Dashboard**: View booking stats and revenue metrics

### Technical Priorities
- **Mobile Responsiveness**: Primary focus on mobile experience
- **Simple Architecture**: No complex inventory or availability systems
- **Manual Workflow**: Admin-centered process management
- **Data Export**: Excel reports for business tracking
- **Change Tracking**: Audit trail for booking modifications

---
*Last Updated: [Current Date]*
*Project Status: Planning Phase*
