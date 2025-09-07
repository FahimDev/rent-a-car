## Booking System Overview

### Core Concept
- **Simple Form Submission System**: No complex inventory management
- **Vehicle Gallery**: Browse available vehicles with photos
- **Day-based Booking**: Book vehicle for specific day(s)
- **Manual Processing**: Admin handles all confirmations manually

## Booking Flow

### Customer Journey
1. **Browse Vehicles**: View vehicle gallery with details
2. **Select Vehicle**: Choose desired vehicle
3. **Fill Booking Form**:
   - Mobile number (with country code validation)
   - Passenger name
   - Pickup date
   - Pickup location
   - Optional: Dropoff location and date
4. **Submit Booking**: Form submission creates booking record
5. **Admin Contact**: Admin calls to confirm booking
6. **Manual Verification**: Admin marks mobile as verified if reachable

### No Inventory Management
- No real-time availability checking
- No booking conflicts prevention
- Simple trust-based system
- Admin manages availability manually

### Booking Modification
- **Who Can Modify**: Only Super Admin
- **Restrictions**: Cannot change mobile number (primary identifier)
- **Modifiable Fields**: Dates, locations, passenger name, vehicle
- **Change History**: All modifications logged with timestamps
- **Audit Trail**: Complete change history visible to admins
