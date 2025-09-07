# Business Requirements

## Project Overview
A car rental management system designed for small to medium-sized rental businesses operating with manual processes and offline payment methods.

## Core Business Objectives

### Primary Goals
1. **Streamline Operations**: Replace manual booking logs with digital system
2. **Customer Management**: Centralized passenger records with mobile-based identification
3. **Fleet Management**: Track vehicles, availability, and utilization
4. **Financial Tracking**: Monitor payments and revenue for accounting purposes
5. **Audit Compliance**: Maintain complete records of all transactions and modifications

### Success Metrics
- Reduce booking processing time by 60%
- Eliminate double-booking incidents
- Improve payment tracking accuracy to 100%
- Enable quick customer lookup by mobile number
- Generate monthly financial reports in under 5 minutes

## Functional Requirements

### 1. Vehicle Management
- **Vehicle Registration**: Add vehicles with complete details (make, model, year, license plate, etc.)
- **Vehicle Types**: Categorize vehicles (Hatchback, Sedan, SUV, Premium, Tempo Traveller)
- **Availability Tracking**: Mark vehicles as active/inactive
- **Search Capability**: Find vehicles by license plate (admin only)
- **Vehicle Details**: Store fuel type, transmission, seating capacity, color

### 2. Customer Management
- **Mobile-Based Identity**: One mobile number = One customer record
- **Customer Registration**: Name, mobile, email, address
- **Verification Process**: Manual phone verification by admin
- **Customer History**: View all bookings for a customer
- **Search Functions**: Find customers by mobile number or name

### 3. Booking System
- **Booking Creation**: Capture trip details (pickup, drop, dates, vehicle)
- **Reference Generation**: Auto-generate unique booking references
- **Status Management**: Track booking lifecycle (pending → confirmed → in-progress → completed/cancelled)
- **Manual Confirmation**: Admin confirms all bookings manually
- **Trip Types**: Support one-way and round-trip bookings
- **Modification Control**: Only super admins can modify confirmed bookings

### 4. Payment Management
- **Offline Processing**: No online payment gateway integration
- **Multiple Methods**: Cash, bank transfer, UPI, card, cheque
- **Manual Entry**: Admin enters payment details manually
- **Payment Tracking**: Link payments to specific bookings
- **Partial Payments**: Support multiple payments for single booking
- **Transaction References**: Store bank reference numbers, UPI IDs, etc.

### 5. Admin System
- **Role-Based Access**: Admin and Super Admin roles
- **User Management**: Create and manage admin accounts
- **Activity Logging**: Track all admin actions with timestamps
- **Secure Authentication**: Login with username/password
- **Session Management**: Automatic logout for security

### 6. Reporting & Analytics
- **Booking Reports**: Daily, weekly, monthly booking summaries
- **Payment Reports**: Financial reports for accounting
- **Vehicle Utilization**: Track which vehicles are most/least used
- **Customer Reports**: Customer booking history and preferences
- **Excel Export**: Export all reports to Excel format

## Non-Functional Requirements

### 1. Performance
- **Response Time**: Page loads under 2 seconds
- **Concurrent Users**: Support 10 simultaneous admin users
- **Database Performance**: Query execution under 500ms
- **Large Data Sets**: Handle 10,000+ bookings efficiently

### 2. Security
- **Data Protection**: Secure storage of customer data
- **Access Control**: Role-based permissions strictly enforced
- **Audit Trail**: Complete logging of all data changes
- **Password Security**: Strong password requirements and hashing
- **Session Security**: Secure session management with timeouts

### 3. Usability
- **Intuitive Interface**: Easy-to-use admin dashboard
- **Mobile Responsive**: Works on tablets and mobile devices
- **Quick Search**: Fast customer and vehicle lookup
- **Error Handling**: Clear error messages and validation
- **Keyboard Shortcuts**: Common actions accessible via keyboard

### 4. Reliability
- **Data Backup**: Regular automated backups
- **Error Recovery**: Graceful handling of system errors
- **Data Validation**: Prevent invalid data entry
- **Consistency**: Maintain data integrity across all operations

### 5. Scalability
- **Growth Support**: Handle business expansion (more vehicles, bookings)
- **Database Scalability**: Efficient schema design for growth
- **Modular Architecture**: Easy to add new features
- **Performance Optimization**: Indexing and query optimization

## Business Rules & Constraints

### Mobile Number Rules
1. **Unique Identifier**: One mobile number = One passenger record
2. **Country Code Required**: Must include valid country code (+91, +1, etc.)
3. **Multiple Bookings**: Same mobile can have multiple bookings
4. **No Modification**: Mobile number cannot be changed in bookings
5. **Manual Verification**: Admin calls to verify legitimacy

### Booking Rules
1. **Simple Submission**: No real-time availability checking
2. **Admin Confirmation**: All bookings confirmed manually by admin
3. **Super Admin Modification**: Only super admins can modify confirmed bookings
4. **Change Tracking**: All modifications logged with history
5. **Mobile Protection**: Cannot change mobile number in existing booking
6. **Reference Uniqueness**: Each booking gets unique reference number

### Payment Rules
1. **Offline Only**: No online payment processing
2. **Manual Entry**: Admin enters payment details manually
3. **Flexible Methods**: Cash, bank transfer, UPI, card, cheque
4. **Export Capability**: Excel reports for accounting
5. **Multiple Payments**: One booking can have multiple payment entries
6. **Currency Support**: Support for different currencies (primarily INR)

### Admin Rules
1. **Role Hierarchy**: Super Admin > Admin permissions
2. **Activity Logging**: All actions logged with user identification
3. **Secure Sessions**: Automatic logout after inactivity
4. **Data Protection**: Admin cannot access certain sensitive customer data
5. **Modification Rights**: Only super admins can modify completed bookings

## Integration Requirements

### 1. External Systems
- **Excel Export**: Generate reports in Excel format
- **Email Notifications**: Send booking confirmations (future scope)
- **SMS Integration**: Customer notifications (future scope)
- **Backup Systems**: Regular data backup to cloud storage

### 2. Future Integrations
- **Payment Gateways**: Online payment processing
- **GPS Tracking**: Vehicle location tracking
- **Mobile App**: Customer-facing mobile application
- **Third-party APIs**: Weather, traffic, mapping services

## Compliance & Legal

### 1. Data Privacy
- **GDPR Compliance**: Customer data protection (if applicable)
- **Data Retention**: Policies for data storage and deletion
- **Customer Consent**: Proper consent for data collection
- **Data Access**: Customer right to access their data

### 2. Business Compliance
- **Tax Compliance**: Proper recording for tax purposes
- **Insurance Records**: Link with vehicle insurance data
- **Legal Documentation**: Maintain records as per local laws
- **Audit Requirements**: Support for business audits

## Success Criteria

### Phase 1 (MVP)
- Basic vehicle and customer management
- Simple booking system with manual confirmation
- Payment tracking functionality
- Admin dashboard with basic reporting

### Phase 2 (Enhanced)
- Advanced reporting and analytics
- Mobile-responsive interface
- Enhanced search and filtering
- Bulk operations support

### Phase 3 (Advanced)
- Customer-facing portal
- Automated notifications
- Advanced analytics and insights
- Integration with external systems

This comprehensive requirement specification ensures the car rental application meets all business needs while maintaining simplicity for manual operations.
