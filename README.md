# Rent-A-Car - Car Booking Application

A comprehensive car rental management system designed for manual admin operations with offline payment processing.

## 🚀 Features

### For Passengers
- **Landing Page**: Company information and contact details
- **Vehicle Gallery**: Browse available vehicles with filtering
- **4-Step Booking**: Simple booking process (Date/Time → Locations → Contact → Confirm)
- **Quick Book**: Simplified 3-step booking interface for senior citizens
- **Mobile-First**: Progressive Web App experience
- **No Registration**: Book without creating an account
- **Quick Book**: Simplified booking interface for senior citizens

### For Admins
- **Vehicle Management**: Add, edit, and manage vehicles
- **Booking Management**: View and manage all bookings
- **WhatsApp Notifications**: Instant alerts for new bookings
- **Simple Login**: Direct access via booking links

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **External APIs**: WhatsApp Business API, Google Maps API
- **Hosting**: cPanel compatible

## 📋 Vehicle Types

- **4-seat Sedan**: Compact and efficient
- **7-seat Noah**: Family and group travel
- **12-seat Hiace**: Large group transportation

## 🏗️ Project Structure

```
car-rental-app/
├── docs/
│   ├── business/
│   │   ├── requirements.md
│   │   ├── user-stories.md
│   │   └── business-rules.md
│   ├── technical/
│   │   ├── architecture.md
│   │   ├── api-design.md
│   │   ├── database-schema.md
│   │   └── deployment.md
│   └── ui-ux/
│       ├── wireframes.md
│       ├── user-flows.md
│       └── design-system.md
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
├── docs/                # Project documentation
├── public/              # Static assets
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rent-a-car.git
   cd rent-a-car
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/carrental"
   JWT_SECRET="your_jwt_secret"
   ```

4. **Set up database**
   Use the schema provided in `/docs/technical/database-schema.md`.

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **Business Requirements**: `/docs/business/`
- **Technical Specifications**: `/docs/technical/`
- **UI/UX Guidelines**: `/docs/ui-ux/`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Code Structure

- **Components**: Reusable React components in `src/components/`
- **API Routes**: Next.js API routes in `src/app/api/`
- **Pages**: Next.js pages in `src/app/`

## 🚀 Deployment

### cPanel Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload files** to your cPanel hosting via FTP or Git

3. **Set up MySQL database** in cPanel

4. **Configure environment variables** in cPanel

5. **Start the application**
   ```bash
   npm start
   ```

## Quick Book Feature

A simplified booking experience designed specifically for senior citizens who prefer straightforward technology interactions.

### Key Benefits:
- **Simple 3-step process**: Dates → Vehicle Type → Contact
- **Large, clear interface elements**
- **No complex vehicle galleries or confusing options**
- **Icon-based vehicle selection**
- **Smart contact management** with UUID-like system

### Contact System:
- Phone numbers act as unique identifiers (UUID-like)
- Returning customers are automatically recognized
- One-to-many relationship between contacts and bookings
- No duplicate contact storage

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
- Icons from [Heroicons](https://heroicons.com/)

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
