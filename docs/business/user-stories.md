# User Stories

## Admin User Stories

### Vehicle Management

**As an admin, I want to:**

1. **Add New Vehicle**
   - Add a new vehicle to the fleet with all details (make, model, year, license plate, color, fuel type, transmission, seating capacity)
   - Assign vehicle to a specific category (Hatchback, Sedan, SUV, Premium, Tempo Traveller)
   - Set vehicle as active/inactive
   - Add notes about vehicle condition or special features

2. **Search and Filter Vehicles**
   - Search vehicles by license plate number (private to admin)
   - Filter vehicles by type, make, model, fuel type, transmission
   - View only active vehicles for booking assignment
   - Sort vehicles by usage, revenue, or availability

3. **Update Vehicle Information**
   - Edit vehicle details (except license plate)
   - Change vehicle status (active/inactive)
   - Add maintenance notes or special instructions
   - Track vehicle utilization and revenue

### Customer Management

**As an admin, I want to:**

4. **Register New Customer**
   - Create customer profile with mobile number as unique identifier
   - Collect customer details (name, email, address)
   - Verify customer legitimacy through phone call
   - Add verification notes and status

5. **Search Customers**
   - Find customer by mobile number instantly
   - Search customers by name or email
   - View customer booking history
   - Check customer verification status

6. **Manage Customer Information**
   - Update customer details (except mobile number)
   - Add verification notes after phone calls
   - Mark customer as verified/unverified
   - View complete customer booking and payment history

### Booking Management

**As an admin, I want to:**

7. **Create New Booking**
   - Select or create customer record
   - Choose available vehicle for the trip
   - Set pickup and drop locations
   - Specify pickup date/time and return date/time
   - Select trip type (one-way or round-trip)
   - Generate unique booking reference automatically

8. **Manage Booking Status**
   - Confirm pending bookings after verification
   - Update booking status (pending → confirmed → in-progress → completed/cancelled)
   - Add admin notes for special instructions
   - Handle booking cancellations with reasons

9. **Search and Filter Bookings**
   - Search bookings by reference number
   - Filter by customer mobile number
   - Filter by date range, status, or vehicle
   - Find bookings by pickup/drop locations

**As a super admin, I want to:**

10. **Modify Confirmed Bookings**
    - Change booking details after confirmation
    - Update trip dates, locations, or vehicle
    - Log all modifications with reasons
    - Maintain complete audit trail of changes

### Payment Management

**As an admin, I want to:**

11. **Record Payments**
    - Add payment details for completed bookings
    - Select payment method (cash, bank transfer, UPI, card, cheque)
    - Enter payment amount and transaction reference
    - Record payment date and add notes

12. **Track Payment Status**
    - View payment status for all bookings
    - Handle partial payments (multiple payments per booking)
    - Track outstanding amounts
    - Generate payment receipts

13. **Payment Reporting**
    - Export payment reports to Excel
    - Generate daily/weekly/monthly revenue reports
    - Track payments by method (cash vs digital)
    - Monitor outstanding payments

### System Administration

**As a super admin, I want to:**

14. **Manage Admin Users**
    - Create new admin accounts
    - Set user roles (admin/super admin)
    - Activate/deactivate admin accounts
    - Reset admin passwords

15. **Monitor System Activity**
    - View admin activity logs
    - Track who made what changes and when
    - Monitor login/logout activities
    - Investigate suspicious activities

16. **System Configuration**
    - Manage vehicle types and categories
    - Configure payment methods
    - Set system preferences
    - Manage master data

### Reporting and Analytics

**As an admin, I want to:**

17. **Generate Reports**
    - Export booking reports to Excel
    - Generate customer reports with booking history
    - Create vehicle utilization reports
    - Produce financial summaries for accounting

18. **View Dashboard Analytics**
    - See today's bookings at a glance
    - Monitor pending confirmations
    - View revenue trends
    - Track vehicle utilization rates

19. **Business Intelligence**
    - Identify most popular vehicles
    - Track customer loyalty and repeat bookings
    - Monitor seasonal booking patterns
    - Analyze revenue by vehicle type

## Customer User Stories (Future Scope)

### Self-Service Portal

**As a customer, I want to:**

20. **Submit Booking Request**
    - Fill booking form with trip details
    - Select preferred vehicle type
    - Provide contact information
    - Receive booking reference number

21. **Track Booking Status**
    - Check booking status using reference number
    - Receive confirmation notifications
    - View trip details and vehicle assigned

22. **Manage Profile**
    - Update personal information
    - View booking history
    - Contact support for assistance

## Technical User Stories

### System Performance

**As a system user, I want:**

23. **Fast Response Times**
    - Page loads in under 2 seconds
    - Search results appear instantly
    - Form submissions process quickly
    - Reports generate within reasonable time

24. **Reliable System**
    - System available 99.9% of the time
    - Data never lost or corrupted
    - Graceful error handling
    - Automatic data backups

### Security and Access

**As a system administrator, I want:**

25. **Secure Access**
    - Strong authentication for all admin users
    - Role-based access control
    - Session timeouts for security
    - Activity logging for audit

26. **Data Protection**
    - Customer data encrypted and secure
    - License plate numbers hidden from unauthorized access
    - Payment information properly protected
    - Regular security updates

## Acceptance Criteria Examples

### Story: Create New Booking

**Given** I am a logged-in admin
**When** I create a new booking
**Then** I should be able to:
- Select existing customer or create new one
- Choose from available vehicles
- Set pickup and drop locations (minimum 10 characters)
- Select pickup date/time (must be future date)
- Choose trip type (one-way/round-trip)
- System generates unique booking reference
- Booking starts with "pending" status
- Customer and admin receive confirmation

**And** the system should validate:
- Mobile number format with country code
- Required fields are filled
- Pickup date is not in the past
- Vehicle is available (not already booked)

### Story: Record Payment

**Given** I am a logged-in admin with a completed booking
**When** I record a payment
**Then** I should be able to:
- Select payment method from predefined list
- Enter payment amount (positive number)
- Add transaction reference (if applicable)
- Set payment date (cannot be future date)
- Add payment notes
- Link payment to specific booking

**And** the system should:
- Calculate outstanding amount if partial payment
- Update booking payment status
- Generate payment record with timestamp
- Allow multiple payments for same booking

These user stories provide clear guidance for development and testing, ensuring the application meets all business requirements while maintaining focus on manual operations and offline payment processing.
