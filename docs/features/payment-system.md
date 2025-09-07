## Payment System Overview

### Payment Processing
- **Method**: Completely offline payment handling
- **No Online Payments**: No payment gateway integration required
- **Manual Entry**: Admin enters payment details manually
- **Excel Export**: System generates reports for admin accounting

## Payment Workflow

### Payment Collection
1. **Booking Creation**: Customer submits booking (no payment)
2. **Admin Contact**: Admin discusses payment during verification call
3. **Offline Payment**: Customer pays via cash/bank transfer/UPI offline
4. **Manual Entry**: Admin updates payment status in dashboard
5. **Receipt Generation**: Admin can print/download receipts

### Payment Tracking Fields
```prisma
model Booking {
  // ...existing fields...
  totalAmount     Float
  advanceAmount   Float?
  remainingAmount Float?
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   String?       // "Cash", "Bank Transfer", "UPI", etc.
  paymentNotes    String?       // Admin notes about payment
  paidAt          DateTime?     // When payment was received
  receivedBy      String?       // Admin who received payment
}

enum PaymentStatus {
  PENDING
  ADVANCE_PAID
  FULLY_PAID
  REFUNDED
}
```

### Admin Payment Management
- Manual payment status updates
- Payment method tracking
- Payment notes and timestamps
- Excel export for accounting
- Monthly/weekly revenue reports
