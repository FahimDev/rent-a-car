## Key Features Overview

### Customer-Facing Features
1. **Company Landing Page** - Professional showcase with contact information
2. **Vehicle Gallery** - Browse and filter available vehicles
3. **Booking System** - 4-step booking process (Date/Time → Locations → Contact → Confirm)
4. **Quick Book** - Simplified 3-step booking for senior citizens
5. **Mobile-First Design** - Progressive Web App experience
6. **No Registration Required** - Direct booking without account creation

## Technical Considerations

### Database Design
- **Simple Schema**: 7 main entities (Vehicles, Photos, Passengers, Bookings, Contacts, Quick_Bookings, Admins, Company_Info, Notifications)
- **Phone-Based Identity**: Passengers identified by phone numbers (no email required)
- **Quick Book Contacts**: UUID-like contact system for simplified bookings
- **WhatsApp Integration**: Notification tracking for admin alerts
