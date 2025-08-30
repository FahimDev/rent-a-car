# DriveShare - Car Booking Application

A simple, professional car booking application built with Next.js for a car rental company. This project demonstrates the power of Cursor AI in building modern web applications.

## 🚀 Features

### For Passengers
- **Landing Page**: Company information and contact details
- **Vehicle Gallery**: Browse available vehicles with filtering
- **4-Step Booking**: Simple booking process (Date/Time → Locations → Contact → Confirm)
- **Mobile-First**: Progressive Web App experience
- **No Registration**: Book without creating an account

### For Admins
- **Vehicle Management**: Add, edit, and manage vehicles
- **Booking Management**: View and manage all bookings
- **WhatsApp Notifications**: Instant alerts for new bookings
- **Simple Login**: Direct access via booking links

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **External APIs**: WhatsApp Business API, Google Maps API
- **Hosting**: cPanel compatible

## 📋 Vehicle Types

- **4-seat Sedan**: Compact and efficient
- **7-seat Noah**: Family and group travel
- **12-seat Hiace**: Large group transportation

## 🏗️ Project Structure

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
├── docs/                # Project documentation
├── public/              # Static assets
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/driveshare.git
   cd driveshare
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
   DATABASE_URL="postgresql://user:password@localhost:5432/driveshare"
   WHATSAPP_API_KEY="your_whatsapp_api_key"
   WHATSAPP_PHONE_NUMBER="your_whatsapp_number"
   GOOGLE_MAPS_API_KEY="your_google_maps_key"
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="secure_password"
   ```

4. **Set up database**
   ```bash
   npx prisma migrate dev
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

- **[Project Context](docs/PROJECT_CONTEXT.md)** - Project overview and navigation
- **[Product Concept](docs/product-concept-note.md)** - Product vision and requirements
- **[Epic Stories](docs/epic-stories.md)** - User stories and scenarios
- **[Functional Requirements](docs/functional/README.md)** - Detailed feature specifications
- **[Technical Architecture](docs/technical/architecture.md)** - System design and architecture
- **[Database Design](docs/technical/database-design.md)** - Database schema with Mermaid ERD

## 🗄️ Database Schema

The application uses a simple PostgreSQL schema with the following entities:

- **Vehicles**: Vehicle information and availability
- **Vehicle_Photos**: Multiple photos per vehicle
- **Passengers**: Passenger information (phone-based)
- **Bookings**: Booking details and status
- **Admins**: Admin user management
- **Company_Info**: Company details for landing page
- **Notifications**: WhatsApp notification tracking

See the [Database Design](docs/technical/database-design.md) for the complete Mermaid ERD.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Structure

- **Components**: Reusable React components in `src/components/`
- **API Routes**: Next.js API routes in `src/app/api/`
- **Pages**: Next.js pages in `src/app/`
- **Database**: Prisma schema in `prisma/schema.prisma`

## 🚀 Deployment

### cPanel Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload files** to your cPanel hosting via FTP or Git

3. **Set up PostgreSQL database** in cPanel

4. **Configure environment variables** in cPanel

5. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

6. **Start the application**
   ```bash
   npm start
   ```

## 🤝 Contributing

This is an experimental project for learning Cursor AI capabilities. Feel free to:

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

---

**Built with ❤️ using Cursor AI**
