## Authentication Strategy

### Admin Authentication
- **Type**: Traditional username/password authentication
- **Implementation**: NextAuth.js with credentials provider
- **Roles**: 
  - Super Admin (can modify bookings)
  - Regular Admin (view and verify passengers)
- **Features**:
  - Secure login with session management
  - Role-based access control
  - Dashboard access for booking management

### Passenger Authentication
- **Type**: NO authentication portal required
- **Process**: Simple form submission with mobile number + name
- **Verification**: Manual verification by admin through phone calls
- **No OTP**: Completely manual and trust-based system
- **Mobile Number**: Primary identifier for passenger (unique, stored once)

## Verification Workflow

### Passenger Verification Process
1. **Booking Submission**: Passenger fills form with mobile + name
2. **Admin Contact**: Admin manually calls the mobile number
3. **Verification**: If admin can reach passenger, marks number as "verified"
4. **WhatsApp Status**: Admin can optionally mark if passenger uses WhatsApp
5. **Future Bookings**: Same mobile number can be used for multiple bookings

### Verification Requirements
- Country code validation for mobile numbers
- Mobile number uniqueness enforcement
- Manual verification status tracking
- WhatsApp availability flag
