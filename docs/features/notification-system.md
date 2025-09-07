## Notification System Overview

### WhatsApp Integration
- **Passenger Notifications**: For verified WhatsApp users only
- **Admin Notifications**: WhatsApp alerts for new bookings
- **Status Updates**: Booking status changes sent via WhatsApp
- **Manual Control**: Admin decides which passengers get WhatsApp notifications

## Notification Types

### For Passengers (WhatsApp Users Only)
- Booking confirmation
- Booking status updates
- Pickup reminders
- Cancellation notifications

### For Admins
- New booking alerts via WhatsApp
- Daily booking summary
- Payment received confirmations

## WhatsApp Verification
```prisma
model Passenger {
  // ...existing fields...
  hasWhatsApp     Boolean  @default(false)
  whatsAppVerified Boolean @default(false)
  whatsAppVerifiedAt DateTime?
  whatsAppVerifiedBy String? // Admin who verified
}
```

### Implementation Requirements
- WhatsApp Business API integration
- Admin interface to mark WhatsApp status
- Message templates for different notification types
- Opt-out mechanism for passengers
- Admin dashboard for notification management
