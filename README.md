# Rent-A-Car Bangladesh | আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন

A professional car rental booking application built with Next.js, designed for the Bangladesh market with Bangla/English localization and mobile-first Progressive Web App experience.

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

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom mobile-first utilities
- **Database**: SQLite (development) / MySQL (production)
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **UI Components**: Radix UI primitives
- **Notifications**: React Hot Toast
- **External APIs**: WhatsApp Business API, Google Maps API
- **Hosting**: cPanel compatible

## 📋 Vehicle Types

- **4-seat Sedan** 🚗: Compact and efficient for city travel
- **7-seat Noah** 🚐: Family and group travel
- **12-seat Hiace** 🚌: Large group transportation

## 🏗️ Project Structure

```
rent-a-car/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page with Bangla/English fusion
│   │   ├── vehicles/          # Vehicle gallery with filtering
│   │   ├── booking/           # 4-step booking process
│   │   │   ├── page.tsx       # Booking form
│   │   │   └── success/       # Booking confirmation
│   │   ├── admin/             # Admin panel
│   │   │   ├── login/         # Admin authentication
│   │   │   └── dashboard/     # Admin dashboard
│   │   └── api/               # API routes
│   │       ├── bookings/      # Booking CRUD operations
│   │       ├── admin/         # Admin authentication & management
│   │       └── whatsapp/      # WhatsApp notifications
│   ├── components/            # Reusable React components
│   │   └── ui/               # Basic UI components (Button, Card, Input, etc.)
│   ├── lib/                  # Utilities and helpers
│   │   ├── prisma.ts         # Prisma client
│   │   └── utils.ts          # Common utilities
│   └── types/                # TypeScript type definitions
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Database seeding
├── public/                   # Static assets
│   ├── images/              # Vehicle images
│   └── manifest.json        # PWA manifest
├── docs/                    # Comprehensive documentation
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

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
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Admin Credentials
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="admin123"
   
   # WhatsApp Business API (for production)
   WHATSAPP_API_KEY=""
   WHATSAPP_PHONE_NUMBER=""
   
   # Google Maps API
   GOOGLE_MAPS_API_KEY=""
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_COMPANY_NAME="Rent-A-Car"
   NEXT_PUBLIC_COMPANY_PHONE="+8801234567890"
   NEXT_PUBLIC_COMPANY_EMAIL="info@rentacar.com"
   NEXT_PUBLIC_COMPANY_WHATSAPP="+8801234567890"
   ```

4. **Set up database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **Project Context**: `PROJECT_CONTEXT.md` - High-level project overview
- **Product Concept**: `docs/product-concept-note.md` - Product vision and requirements
- **Functional Requirements**: `docs/functional/` - Detailed feature specifications
- **Technical Architecture**: `docs/technical/` - System design and implementation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data

### Code Structure

- **Components**: Reusable React components in `src/components/`
- **API Routes**: Next.js API routes in `src/app/api/`
- **Pages**: Next.js pages in `src/app/`
- **Types**: TypeScript definitions in `src/types/`
- **Utilities**: Helper functions in `src/lib/`

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

### cPanel Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload files** to your cPanel hosting via FTP or Git

3. **Set up MySQL database** in cPanel and update `DATABASE_URL`

4. **Configure environment variables** in cPanel

5. **Start the application**
   ```bash
   npm start
   ```

### Environment Configuration for Production

```env
# Database (MySQL for production)
DATABASE_URL="mysql://username:password@localhost:3306/rentacar"

# WhatsApp Business API
WHATSAPP_API_KEY="your_whatsapp_api_key"
WHATSAPP_PHONE_NUMBER="your_whatsapp_number"

# Google Maps API
GOOGLE_MAPS_API_KEY="your_google_maps_key"

# JWT Secret (use a strong secret in production)
JWT_SECRET="your-super-secure-jwt-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_COMPANY_NAME="Your Company Name"
NEXT_PUBLIC_COMPANY_PHONE="+8801234567890"
NEXT_PUBLIC_COMPANY_EMAIL="info@yourcompany.com"
NEXT_PUBLIC_COMPANY_WHATSAPP="+8801234567890"
```

## 📱 User Experience

### Passenger Journey
1. **Landing Page**: View company info, services, and location
2. **Vehicle Gallery**: Browse and filter available vehicles
3. **Booking Process**: 4-step guided booking
4. **Confirmation**: Receive booking confirmation with reference number

### Admin Workflow
1. **Login**: Secure admin authentication
2. **Dashboard**: Overview of business metrics
3. **Booking Management**: View and manage all bookings
4. **Notifications**: Receive WhatsApp alerts for new bookings

## 🔐 Security Features

- JWT-based admin authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Secure environment variable handling
- CORS configuration

## 📊 Database Schema

The application uses a simple, efficient database schema:

- **Admins**: Admin user management
- **Vehicles**: Vehicle information and photos
- **Passengers**: Customer information (phone-based identification)
- **Bookings**: Booking details and status
- **Company Info**: Company details for landing page
- **Notifications**: WhatsApp notification tracking

## 🤝 Contributing

This is an experimental project for learning purposes. Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database management with [Prisma](https://www.prisma.io/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Toast notifications with [React Hot Toast](https://react-hot-toast.com/)

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team

---

**Built with ❤️ for the Bangladesh car rental market**
