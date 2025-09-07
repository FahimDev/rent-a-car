# Business Rules

## Core Business Rules

### Mobile Number Management

#### Rule 1: Unique Customer Identity
- **One mobile number equals one passenger record**
- **Rationale**: Prevents duplicate customer records and ensures data consistency
- **Implementation**: Database unique constraint on mobile_number field
- **Exception**: None - this rule is absolute

#### Rule 2: Country Code Requirement
- **All mobile numbers must include valid country code**
- **Format**: +[country_code][mobile_number] (e.g., +919876543210)
- **Validation**: System validates country code format
- **Default**: +91 for Indian numbers if not specified

#### Rule 3: Mobile Number Immutability
- **Mobile numbers cannot be changed once booking is created**
- **Rationale**: Maintains booking integrity and audit trail
- **Workaround**: Cancel existing booking and create new one if absolutely necessary
- **Exception**: Only super admin can override in extreme cases

#### Rule 4: Manual Verification Requirement
- **All new customers must be verified through phone call**
- **Process**: Admin calls customer to confirm legitimacy
- **Status**: Customer marked as verified/unverified
- **Booking Impact**: Unverified customers can book but flagged for priority verification

### Booking Management Rules

#### Rule 5: Manual Confirmation Process
- **No automatic booking confirmations**
- **Process**: Admin reviews and manually confirms each booking
- **Timeline**: Bookings should be confirmed within 2 hours during business hours
- **Status Flow**: pending → confirmed → in-progress → completed/cancelled

#### Rule 6: No Real-Time Availability Checking
- **System allows overlapping bookings for same vehicle**
- **Rationale**: Admin handles scheduling conflicts manually
- **Admin Responsibility**: Check vehicle availability before confirmation
- **Conflict Resolution**: Admin contacts customers to resolve conflicts

#### Rule 7: Super Admin Modification Rights
- **Only super admins can modify confirmed bookings**
- **Scope**: Can change any booking detail except mobile number
- **Audit Requirement**: All modifications logged with reason
- **Customer Notification**: Customer informed of changes via phone

#### Rule 8: Booking Reference Uniqueness
- **Every booking gets unique system-generated reference**
- **Format**: BK[YYMMDD][4-digit-random] (e.g., BK2401151234)
- **Purpose**: Easy identification and customer communication
- **Immutability**: Reference number never changes

### Payment Processing Rules

#### Rule 9: Offline Payment Only
- **No online payment gateway integration**
- **Methods Accepted**: Cash, bank transfer, UPI, card (physical), cheque
- **Admin Entry**: All payments entered manually by admin
- **Verification**: Admin verifies payment before recording

#### Rule 10: Multiple Payment Support
- **One booking can have multiple payment entries**
- **Use Cases**: Advance payment, balance payment, additional charges
- **Tracking**: System calculates total paid vs booking amount
- **Status**: Outstanding amount displayed for partial payments

#### Rule 11: Payment Method Flexibility
- **Support for various local payment methods**
- **Cash**: Most common method, immediate confirmation
- **Bank Transfer**: Requires transaction reference number
- **UPI**: Record UPI transaction ID
- **Card**: For on-site card payments
- **Cheque**: Record cheque number and bank details

#### Rule 12: Currency Support
- **Primary currency**: Indian Rupees (INR)
- **Future Support**: Multiple currencies for international customers
- **Exchange Rate**: Manual conversion if needed
- **Reporting**: All reports in primary currency

### Vehicle Management Rules

#### Rule 13: License Plate Privacy
- **License plate numbers hidden from public**
- **Admin Access**: Only admins can view and search by license plate
- **Security**: Prevents unauthorized vehicle tracking
- **Customer Communication**: Customers receive vehicle details without license plate

#### Rule 14: Vehicle Type Classification
- **Standard Categories**: Hatchback, Sedan, SUV, Premium, Tempo Traveller
- **Capacity Based**: Classification includes seating capacity
- **Pricing Impact**: Different rates for different categories (manual setting)
- **Customer Choice**: Customers select by category, admin assigns specific vehicle

#### Rule 15: Vehicle Availability Status
- **Active/Inactive Status**: Controls availability for new bookings
- **Maintenance Mode**: Temporarily inactive for servicing
- **Admin Control**: Only admins can change vehicle status
- **Booking Impact**: Inactive vehicles not shown for new bookings

### User Access and Security Rules

#### Rule 16: Role-Based Access Control
- **Admin Role**: Basic operations (create bookings, record payments, view reports)
- **Super Admin Role**: All admin functions plus modify bookings, manage users
- **Separation of Duties**: Critical operations require super admin approval
- **Access Logging**: All actions logged with user identification

#### Rule 17: Session Management
- **Automatic Logout**: Sessions expire after 30 minutes of inactivity
- **Single Session**: One active session per user account
- **Secure Authentication**: Strong password requirements
- **Failed Login Protection**: Account locked after 5 failed attempts

#### Rule 18: Data Modification Audit
- **Complete Audit Trail**: All data changes logged
- **Change Details**: Old value, new value, user, timestamp, reason
- **Immutable Logs**: Audit records cannot be deleted or modified
- **Retention Period**: Audit logs retained for minimum 7 years

### Reporting and Analytics Rules

#### Rule 19: Data Export Capability
- **Excel Format**: All reports exportable to Excel
- **Data Filtering**: Reports can be filtered by date, customer, vehicle, status
- **Scheduled Reports**: Daily, weekly, monthly automated reports
- **Custom Reports**: Ad-hoc reporting capability for specific requirements

#### Rule 20: Financial Reporting Accuracy
- **Payment Reconciliation**: All payments must reconcile with bookings
- **Revenue Tracking**: Accurate revenue calculation and reporting
- **Tax Compliance**: Reports formatted for tax filing requirements
- **Audit Support**: Financial reports support business audits

### Business Process Rules

#### Rule 21: Customer Communication
- **Primary Channel**: Phone calls for all important communications
- **Booking Confirmation**: Customer called to confirm booking details
- **Changes Notification**: Customer informed of any booking changes
- **Payment Reminders**: Outstanding payments followed up via phone

#### Rule 22: Conflict Resolution
- **Booking Conflicts**: Admin contacts customers to resolve scheduling conflicts
- **Vehicle Unavailability**: Offer alternative vehicle or reschedule
- **Customer Complaints**: Super admin handles all customer complaints
- **Escalation Process**: Clear escalation path for unresolved issues

#### Rule 23: Data Retention
- **Active Records**: All active bookings and customers retained indefinitely
- **Completed Bookings**: Retained for minimum 3 years for business purposes
- **Cancelled Bookings**: Retained for 1 year for analysis
- **Payment Records**: Retained for 7 years for tax and audit purposes

### Exception Handling Rules

#### Rule 24: Emergency Modifications
- **Super Admin Override**: Can override system restrictions in emergencies
- **Documentation Required**: All emergency overrides documented with justification
- **Customer Authorization**: Customer consent obtained before major changes
- **Post-Emergency Review**: All emergency actions reviewed and approved

#### Rule 25: System Downtime Procedures
- **Manual Backup**: Paper-based booking log during system downtime
- **Data Entry**: Manual records entered into system once online
- **Customer Communication**: Customers informed of any delays due to system issues
- **Business Continuity**: Operations continue with manual processes if needed

## Implementation Guidelines

### Rule Enforcement
- **System Level**: Database constraints and application logic enforce rules
- **Process Level**: Admin training ensures procedural rule compliance
- **Monitoring**: Regular audits to ensure rule compliance
- **Updates**: Rules reviewed and updated quarterly

### Exception Management
- **Documentation**: All rule exceptions documented with justification
- **Approval Process**: Super admin approval required for rule exceptions
- **Monitoring**: Exception patterns monitored for potential rule updates
- **Customer Impact**: Customer informed of any rule exceptions affecting them

### Rule Violations
- **Detection**: Automated alerts for rule violations
- **Investigation**: Immediate investigation of all violations
- **Corrective Action**: Remedial steps taken to prevent recurrence
- **Training**: Additional training provided if violations due to lack of understanding

These business rules ensure consistent operations while maintaining flexibility for manual processes and customer service excellence.
