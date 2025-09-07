-- filepath: /home/bs01532/car-rental-app/docs/technical/database-schema.md

# Database Schema Design

## Overview
This document defines the database schema for the Car Rental Application. The schema is designed for manual admin operations with offline payment processing and focuses on simplicity while maintaining data integrity.

## Core Business Rules

### Mobile Number Rules
- One mobile number = One passenger record
- Country code required
- Mobile number cannot be changed in bookings
- Manual verification by admin calls

### Booking Rules
- No real-time availability checking
- Manual confirmation by admin
- Only super admins can modify bookings
- All modifications logged with history

### Payment Rules
- Offline payment processing only
- Manual entry by admin
- Multiple payment methods supported
- Excel export capability for accounting

## Database Tables

### 1. Vehicle Types
**Table:** `vehicle_types`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Type name (Hatchback, Sedan, SUV, etc.) |
| description | TEXT | | Type description |
| base_capacity | INT | NOT NULL | Base seating capacity |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | |

**Sample Data:**
- Hatchback (4 seats)
- Sedan (4 seats)
- SUV (7 seats)
- Premium (4 seats)
- Tempo Traveller (12 seats)

### 2. Vehicles
**Table:** `vehicles`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| vehicle_type_id | INT | NOT NULL, FK | Reference to vehicle_types |
| make | VARCHAR(100) | NOT NULL | Vehicle manufacturer |
| model | VARCHAR(100) | NOT NULL | Vehicle model |
| year | YEAR | NOT NULL | Manufacturing year |
| license_plate | VARCHAR(20) | NOT NULL, UNIQUE | License plate (admin only) |
| color | VARCHAR(50) | | Vehicle color |
| fuel_type | ENUM | NOT NULL | petrol, diesel, electric, hybrid |
| seating_capacity | INT | NOT NULL | Actual seating capacity |
| transmission | ENUM | NOT NULL | manual, automatic |
| is_active | BOOLEAN | DEFAULT TRUE | Vehicle availability |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | |

**Indexes:**
- idx_license_plate (license_plate)
- idx_vehicle_type (vehicle_type_id)
- idx_active (is_active)

### 3. Passengers
**Table:** `passengers`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| mobile_number | VARCHAR(20) | NOT NULL, UNIQUE | Mobile with country code |
| country_code | VARCHAR(5) | NOT NULL | Country code (+91, etc.) |
| name | VARCHAR(255) | NOT NULL | Passenger name |
| email | VARCHAR(255) | | Email address |
| address | TEXT | | Physical address |
| is_verified | BOOLEAN | DEFAULT FALSE | Manual verification status |
| verification_notes | TEXT | | Admin verification notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | |

**Business Rules:**
- One mobile number = One passenger record
- Mobile number cannot be modified
- Manual verification through phone calls

**Indexes:**
- idx_mobile (mobile_number)
- idx_verified (is_verified)

### 4. Bookings
**Table:** `bookings`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| booking_reference | VARCHAR(20) | NOT NULL, UNIQUE | Auto-generated reference |
| passenger_id | INT | NOT NULL, FK | Reference to passengers |
| vehicle_id | INT | NOT NULL, FK | Reference to vehicles |
| pickup_location | VARCHAR(500) | NOT NULL | Pickup address |
| drop_location | VARCHAR(500) | NOT NULL | Drop address |
| pickup_datetime | DATETIME | NOT NULL | Pickup date and time |
| drop_datetime | DATETIME | | Drop date and time |
| trip_type | ENUM | NOT NULL | one-way, round-trip |
| status | ENUM | DEFAULT 'pending' | pending, confirmed, in-progress, completed, cancelled |
| admin_notes | TEXT | | Admin notes |
| cancellation_reason | TEXT | | Reason for cancellation |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| confirmed_at | TIMESTAMP | NULL | Confirmation timestamp |
| confirmed_by | VARCHAR(100) | | Admin username |

**Business Rules:**
- No real-time availability checking
- Manual confirmation required
- Only super admins can modify
- All changes logged in booking_modifications

**Indexes:**
- idx_booking_ref (booking_reference)
- idx_passenger (passenger_id)
- idx_vehicle (vehicle_id)
- idx_status (status)
- idx_pickup_date (pickup_datetime)

### 5. Booking Modifications
**Table:** `booking_modifications`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| booking_id | INT | NOT NULL, FK | Reference to bookings |
| field_name | VARCHAR(100) | NOT NULL | Modified field name |
| old_value | TEXT | | Previous value |
| new_value | TEXT | | New value |
| modified_by | VARCHAR(100) | NOT NULL | Admin username |
| modification_reason | TEXT | | Reason for change |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Purpose:** Complete audit trail for all booking changes

### 6. Payment Methods
**Table:** `payment_methods`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Method name |
| description | TEXT | | Method description |
| is_active | BOOLEAN | DEFAULT TRUE | Method availability |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Sample Data:**
- cash
- bank_transfer
- upi
- card
- cheque

### 7. Payments
**Table:** `payments`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| booking_id | INT | NOT NULL, FK | Reference to bookings |
| payment_method_id | INT | NOT NULL, FK | Reference to payment_methods |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| currency | VARCHAR(3) | DEFAULT 'INR' | Currency code |
| transaction_reference | VARCHAR(100) | | Bank ref, UPI ID, etc. |
| payment_date | DATE | NOT NULL | Payment date |
| payment_notes | TEXT | | Additional notes |
| entered_by | VARCHAR(100) | NOT NULL | Admin username |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | |

**Business Rules:**
- Manual entry only
- Offline payment processing
- Multiple payments per booking allowed

### 8. Admin Users
**Table:** `admin_users`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| username | VARCHAR(100) | NOT NULL, UNIQUE | Login username |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| full_name | VARCHAR(255) | NOT NULL | Full name |
| role | ENUM | DEFAULT 'admin' | admin, super_admin |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| last_login | TIMESTAMP | NULL | Last login time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | |

**Roles:**
- **admin**: Basic operations
- **super_admin**: Can modify bookings and all operations

### 9. Admin Activity Log
**Table:** `admin_activity_log`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| admin_user_id | INT | NOT NULL, FK | Reference to admin_users |
| action | VARCHAR(100) | NOT NULL | Action performed |
| entity_type | VARCHAR(50) | | Entity type (booking, passenger, etc.) |
| entity_id | INT | | Entity ID |
| details | JSON | | Additional action details |
| ip_address | VARCHAR(45) | | IP address |
| user_agent | TEXT | | Browser information |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

**Purpose:** Complete audit trail for admin activities

## Database Views

### 1. Booking Details View
```sql
CREATE VIEW booking_details AS
SELECT 
    b.*, p.name as passenger_name, p.mobile_number,
    v.make, v.model, v.license_plate, vt.name as vehicle_type
FROM bookings b
JOIN passengers p ON b.passenger_id = p.id
JOIN vehicles v ON b.vehicle_id = v.id
JOIN vehicle_types vt ON v.vehicle_type_id = vt.id;
```

### 2. Payment Summary View
```sql
CREATE VIEW payment_summary AS
SELECT 
    b.booking_reference, p.name as passenger_name,
    py.amount, py.payment_date, pm.name as payment_method
FROM bookings b
JOIN passengers p ON b.passenger_id = p.id
LEFT JOIN payments py ON b.id = py.booking_id
LEFT JOIN payment_methods pm ON py.payment_method_id = pm.id;
```

### 3. Vehicle Utilization View
```sql
CREATE VIEW vehicle_utilization AS
SELECT 
    v.make, v.model, v.license_plate,
    COUNT(b.id) as total_bookings,
    SUM(py.amount) as total_revenue
FROM vehicles v
LEFT JOIN bookings b ON v.id = b.vehicle_id
LEFT JOIN payments py ON b.id = py.booking_id
GROUP BY v.id;
```

## Key Features

### Data Integrity
- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate data
- Proper indexing for performance

### Audit Trail
- Complete modification history in booking_modifications
- Admin activity logging
- Timestamp tracking on all tables

### Security
- Password hashing for admin users
- Role-based access control
- Activity logging with IP tracking

### Reporting
- Pre-built views for common queries
- Payment tracking for accounting
- Vehicle utilization reports

## Performance Considerations

### Indexes
- Primary keys on all tables
- Foreign key indexes
- Search indexes on frequently queried fields
- Composite indexes for common query patterns

### Optimization
- Proper data types for storage efficiency
- Timestamp indexes for date-based queries
- Full-text search indexes for text fields

## Migration Strategy

### Initial Setup
1. Create tables in dependency order
2. Insert master data (vehicle_types, payment_methods)
3. Create initial admin user
4. Create views and indexes

### Data Migration
- Import existing customer data into passengers table
- Import vehicle inventory into vehicles table
- Historical bookings can be imported with appropriate status

This schema provides a solid foundation for the car rental application with room for future enhancements while maintaining simplicity for current manual operations.