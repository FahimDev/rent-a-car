# Rent-A-Car Bangladesh | আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন

A professional car rental booking application built with Next.js and Cloudflare D1, designed for the Bangladesh market with Bangla/English localization and mobile-first Progressive Web App experience.

## 🚀 Features

### For Passengers
- **Professional Landing Page**: Company information with Bangla/English fusion for SEO
- **Vehicle Gallery**: Browse and filter vehicles by type (4-seat Sedan, 7-seat Noah, 12-seat Hiace)
- **4-Step Booking Process**: Simple stepper-based booking (Date/Time → Locations → Contact → Confirm)
- **Mobile-First Design**: Optimized for mobile users with touch-friendly interface
- **Progressive Web App**: Installable app-like experience
- **No Registration Required**: Book without creating an account
- **Professional UI**: Clean, simple design inspired by Shohag Paribahan Bangladesh

### For Admins
- **Secure Admin Panel**: Simple login system with JWT authentication
- **Dashboard**: Overview of bookings, vehicles, and passengers
- **Booking Management**: View, filter, and manage all bookings
- **WhatsApp Integration**: Instant notifications for new bookings
- **Vehicle Management**: Add, edit, and manage vehicle information
- **Passenger Management**: View and contact passengers

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ with App Router & Edge Runtime
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom mobile-first utilities
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Architecture**: Clean Architecture with Repository Pattern
- **Authentication**: JWT with bcrypt
- **UI Components**: Radix UI primitives
- **Notifications**: React Hot Toast
- **External APIs**: WhatsApp Business API, Google Maps API
- **Hosting**: Cloudflare Pages
- **CORS**: Centralized CORS management

## 📋 Vehicle Types

- **4-seat Sedan** 🚗: Compact and efficient for city travel
- **7-seat Noah** 🚐: Family and group travel
- **12-seat Hiace** 🚌: Large group transportation

## 🏗️ Clean Architecture

This project follows Clean Architecture principles with clear separation of concerns:

### Core Architecture
```
src/
├── lib/
│   ├── database/           # Database abstraction layer
│   │   ├── types.ts        # Database interfaces
│   │   ├── DatabaseFactory.ts  # Database provider factory
│   │   └── providers/      # Database implementations
│   │       ├── CloudflareD1Provider.ts
│   │       ├── PostgreSQLProvider.ts
│   │       └── MySQLProvider.ts
│   ├── repositories/       # Data access layer
│   │   ├── BaseRepository.ts
│   │   └── VehicleRepository.ts
│   ├── services/          # Business logic layer
│   │   ├── VehicleService.ts
│   │   ├── ServiceFactory.ts
│   │   └── api/           # API service layer
│   │       ├── VehicleApiService.ts
│   │       └── CompanyApiService.ts
│   ├── api/               # API utilities
│   │   └── cors.ts        # Centralized CORS management
│   └── utils/             # Utility functions
│       └── api.ts         # API request utilities
```

### Key Design Patterns

1. **Repository Pattern**: Data access abstraction
2. **Service Layer**: Business logic encapsulation
3. **Factory Pattern**: Provider instantiation
4. **Dependency Injection**: Loose coupling
5. **Strategy Pattern**: Database provider switching

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Cloudflare account (for D1 database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fahimdev/rent-a-car.git
   cd rent-a-car
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
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
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   ```

4. **Set up Cloudflare D1 database**
   ```bash
   # Create D1 database
   npx wrangler d1 create rent-a-car-db
   
   # Run migrations
   npx wrangler d1 execute rent-a-car-db --file=./schema.sql
   
   # Seed database
   npx wrangler d1 execute rent-a-car-db --file=./seed-d1.sql
   ```

5. **Start development server**
   ```bash
   # For local development with D1
   npm run dev:d1
   
   # Or regular development
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **Project Context**: `PROJECT_CONTEXT.md` - High-level project overview
- **Clean Architecture**: `docs/technical/clean-architecture.md` - Architecture patterns
- **API Documentation**: `docs/technical/api-documentation.md` - API endpoints
- **Database Schema**: `docs/technical/database-schema.md` - Database design
- **Development Guide**: `docs/technical/development-guide.md` - Development workflow

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:d1` - Start development with D1 bindings
- `npm run build` - Build for production
- `npm run pages:build` - Build for Cloudflare Pages
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Development Workflow

1. **Database Changes**: Update `schema.sql` and run migrations
2. **API Changes**: Update service layer, then API routes
3. **UI Changes**: Update components and pages
4. **Testing**: Use `npm run dev:d1` for local testing with D1

## 🎨 Design Features

### Mobile-First Approach
- Touch-friendly interface with 44px minimum touch targets
- Responsive design that works on all screen sizes
- Optimized for mobile users (90% of traffic expected)

### Bangla/English Localization
- SEO-optimized landing page with Bangla/English fusion
- Professional design inspired by Shohag Paribahan Bangladesh
- Localized content for Bangladesh market

### Progressive Web App
- Installable on mobile devices
- Offline capabilities
- App-like experience
- Service worker for caching

## 🚀 Deployment

### Cloudflare Pages Deployment

1. **Build the application**
   ```bash
   npm run pages:build
   ```

2. **Deploy to Cloudflare Pages**
   ```bash
   npm run deploy
   ```

3. **Set environment variables** in Cloudflare Pages dashboard:
   ```
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_API_TOKEN=your_api_token
   CLOUDFLARE_D1_DATABASE_ID=your_database_id
   NEXT_PUBLIC_BASE_URL=https://your-domain.pages.dev
   ```

### Environment Configuration for Production

```env
# Cloudflare D1 Database
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_API_TOKEN="your_api_token"
CLOUDFLARE_D1_DATABASE_ID="your_database_id"

# App Configuration
NEXT_PUBLIC_BASE_URL="https://your-domain.pages.dev"

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="secure_password"

# JWT Secret (use a strong secret in production)
JWT_SECRET="your-super-secure-jwt-secret"
```

## 🔐 Security Features

- JWT-based admin authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Secure environment variable handling
- Centralized CORS management
- Edge runtime security

## 📊 Database Schema

The application uses Cloudflare D1 (SQLite-compatible) with the following schema:

- **Admins**: Admin user management
- **Vehicles**: Vehicle information and photos
- **Passengers**: Customer information (phone-based identification)
- **Bookings**: Booking details and status
- **Company Info**: Company details for landing page
- **Notifications**: WhatsApp notification tracking

## 🤝 Contributing

This project follows clean architecture principles. When contributing:

1. **Follow the architecture**: Use repositories for data access, services for business logic
2. **Maintain patterns**: Keep the established patterns for consistency
3. **Update documentation**: Update relevant docs when adding features
4. **Test thoroughly**: Test with both local and D1 environments

### Development Guidelines

1. **Database Changes**: Always update `schema.sql` and create migrations
2. **API Changes**: Update service layer first, then API routes
3. **CORS**: Use the centralized CORS utility for all API routes
4. **Error Handling**: Implement proper error handling in all layers
5. **Type Safety**: Maintain TypeScript types throughout

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [Cloudflare D1](https://developers.cloudflare.com/d1/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Toast notifications with [React Hot Toast](https://react-hot-toast.com/)

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team

---

**Built with ❤️ for the Bangladesh car rental market using Clean Architecture principles**
