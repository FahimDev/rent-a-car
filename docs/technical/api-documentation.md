# API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints in the Rent-A-Car application. All APIs follow RESTful conventions and include proper CORS handling.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.pages.dev`

## Authentication

Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## CORS Headers

All endpoints include CORS headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Public Endpoints

### 1. Get All Vehicles
**GET** `/api/vehicles`

Get all available vehicles with optional filtering.

#### Query Parameters
- `type` (optional): Filter by vehicle type (`sedan`, `noah`, `hiace`)

#### Example Request
```bash
GET /api/vehicles?type=sedan
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "vehicle-1",
        "name": "Honda City",
        "type": "sedan",
        "capacity": 4,
        "pricePerDay": 2200,
        "description": "Economical and fuel-efficient sedan",
        "features": ["AC", "Music System", "Fuel Efficient"],
        "isAvailable": true,
        "photos": [
          {
            "id": "photo-1",
            "url": "https://example.com/photo1.jpg",
            "alt": "Honda City front view",
            "isPrimary": true,
            "order": 1
          }
        ],
        "createdAt": "2025-09-12T09:31:34.000Z",
        "updatedAt": "2025-09-12T09:31:34.000Z"
      }
    ]
  },
  "count": 1
}
```

### 2. Get Company Information
**GET** `/api/company`

Get company information for the landing page.

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": "company-1",
    "name": "Rent-A-Car Bangladesh",
    "tagline": "আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন",
    "description": "We provide premium car rental services...",
    "phone": "+8801234567890",
    "email": "info@rentacar.com",
    "whatsapp": "+8801234567890",
    "address": "Dhaka, Bangladesh",
    "latitude": 23.8103,
    "longitude": 90.4125,
    "createdAt": "2025-09-12T04:24:27",
    "updatedAt": "2025-09-12T04:24:27"
  }
}
```

### 3. Get Vehicle by ID
**GET** `/api/vehicles/{id}`

Get a specific vehicle by its ID.

#### Path Parameters
- `id`: Vehicle ID

#### Example Request
```bash
GET /api/vehicles/vehicle-1
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": "vehicle-1",
    "name": "Honda City",
    "type": "sedan",
    "capacity": 4,
    "pricePerDay": 2200,
    "description": "Economical and fuel-efficient sedan",
    "features": ["AC", "Music System", "Fuel Efficient"],
    "isAvailable": true,
    "photos": [...],
    "createdAt": "2025-09-12T09:31:34.000Z",
    "updatedAt": "2025-09-12T09:31:34.000Z"
  }
}
```

## Admin Endpoints

### 1. Admin Login
**POST** `/api/admin/login`

Authenticate admin user and receive JWT token.

#### Request Body
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "admin-1",
      "username": "admin",
      "email": "admin@rentacar.com",
      "role": "admin"
    }
  }
}
```

### 2. Get All Bookings
**GET** `/api/admin/bookings`

Get all bookings with optional filtering.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Query Parameters
- `status` (optional): Filter by booking status
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

#### Example Response
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "booking-1",
        "passengerId": "passenger-1",
        "vehicleId": "vehicle-1",
        "bookingDate": "2025-09-15T00:00:00.000Z",
        "pickupTime": "09:00",
        "tripType": "single",
        "pickupLocation": "Dhaka Airport",
        "dropoffLocation": "Gulshan",
        "status": "confirmed",
        "notes": "Please call when arrived",
        "createdAt": "2025-09-12T10:30:00.000Z",
        "updatedAt": "2025-09-12T10:30:00.000Z",
        "passenger": {
          "id": "passenger-1",
          "name": "John Doe",
          "phone": "+8801234567890",
          "email": "john@example.com"
        },
        "vehicle": {
          "id": "vehicle-1",
          "name": "Honda City",
          "type": "sedan"
        }
      }
    ]
  },
  "count": 1
}
```

### 3. Get Booking by ID
**GET** `/api/admin/bookings/{id}`

Get a specific booking by its ID.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Path Parameters
- `id`: Booking ID

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": "booking-1",
    "passengerId": "passenger-1",
    "vehicleId": "vehicle-1",
    "bookingDate": "2025-09-15T00:00:00.000Z",
    "pickupTime": "09:00",
    "tripType": "single",
    "pickupLocation": "Dhaka Airport",
    "dropoffLocation": "Gulshan",
    "status": "confirmed",
    "notes": "Please call when arrived",
    "createdAt": "2025-09-12T10:30:00.000Z",
    "updatedAt": "2025-09-12T10:30:00.000Z",
    "passenger": { ... },
    "vehicle": { ... }
  }
}
```

### 4. Update Booking Status
**PUT** `/api/admin/bookings/{id}`

Update booking status and details.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Path Parameters
- `id`: Booking ID

#### Request Body
```json
{
  "status": "confirmed",
  "notes": "Updated notes"
}
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": "booking-1",
    "status": "confirmed",
    "notes": "Updated notes",
    "updatedAt": "2025-09-12T11:00:00.000Z"
  }
}
```

### 5. Get All Passengers
**GET** `/api/admin/passengers`

Get all passengers with optional filtering.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Query Parameters
- `search` (optional): Search by name or phone
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

#### Example Response
```json
{
  "success": true,
  "data": {
    "passengers": [
      {
        "id": "passenger-1",
        "name": "John Doe",
        "phone": "+8801234567890",
        "email": "john@example.com",
        "isVerified": true,
        "createdAt": "2025-09-12T09:00:00.000Z",
        "updatedAt": "2025-09-12T09:00:00.000Z"
      }
    ]
  },
  "count": 1
}
```

### 6. Get All Vehicles (Admin)
**GET** `/api/admin/vehicles`

Get all vehicles for admin management.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "vehicle-1",
        "name": "Honda City",
        "type": "sedan",
        "capacity": 4,
        "pricePerDay": 2200,
        "description": "Economical and fuel-efficient sedan",
        "features": ["AC", "Music System", "Fuel Efficient"],
        "isAvailable": true,
        "adminId": "admin-1",
        "photos": [...],
        "createdAt": "2025-09-12T09:31:34.000Z",
        "updatedAt": "2025-09-12T09:31:34.000Z"
      }
    ]
  },
  "count": 1
}
```

### 7. Create Vehicle
**POST** `/api/admin/vehicles`

Create a new vehicle.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "name": "Toyota Corolla",
  "type": "sedan",
  "capacity": 4,
  "pricePerDay": 2500,
  "description": "Comfortable sedan for city travel",
  "features": ["AC", "Music System", "Power Steering"],
  "isAvailable": true
}
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": "vehicle-2",
    "name": "Toyota Corolla",
    "type": "sedan",
    "capacity": 4,
    "pricePerDay": 2500,
    "description": "Comfortable sedan for city travel",
    "features": ["AC", "Music System", "Power Steering"],
    "isAvailable": true,
    "adminId": "admin-1",
    "photos": [],
    "createdAt": "2025-09-12T12:00:00.000Z",
    "updatedAt": "2025-09-12T12:00:00.000Z"
  }
}
```

### 8. Update Vehicle
**PUT** `/api/admin/vehicles/{id}`

Update an existing vehicle.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Path Parameters
- `id`: Vehicle ID

#### Request Body
```json
{
  "name": "Toyota Corolla Updated",
  "pricePerDay": 2600,
  "isAvailable": false
}
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": "vehicle-2",
    "name": "Toyota Corolla Updated",
    "pricePerDay": 2600,
    "isAvailable": false,
    "updatedAt": "2025-09-12T12:30:00.000Z"
  }
}
```

### 9. Delete Vehicle
**DELETE** `/api/admin/vehicles/{id}`

Delete a vehicle.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Path Parameters
- `id`: Vehicle ID

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": "vehicle-2",
    "deleted": true
  }
}
```

### 10. Get Dashboard Statistics
**GET** `/api/admin/stats`

Get dashboard statistics for admin panel.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "totalBookings": 150,
    "pendingBookings": 5,
    "confirmedBookings": 120,
    "completedBookings": 25,
    "totalVehicles": 10,
    "availableVehicles": 8,
    "totalPassengers": 75,
    "recentBookings": [
      {
        "id": "booking-1",
        "passengerName": "John Doe",
        "vehicleName": "Honda City",
        "bookingDate": "2025-09-15T00:00:00.000Z",
        "status": "confirmed"
      }
    ]
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Rate Limiting

- **Public endpoints**: 100 requests per minute per IP
- **Admin endpoints**: 1000 requests per minute per authenticated user

## CORS Preflight

All endpoints support CORS preflight requests via the `OPTIONS` method.

## Examples

### Using cURL

```bash
# Get all vehicles
curl -X GET "https://your-domain.pages.dev/api/vehicles"

# Get vehicles by type
curl -X GET "https://your-domain.pages.dev/api/vehicles?type=sedan"

# Admin login
curl -X POST "https://your-domain.pages.dev/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Get bookings (with auth)
curl -X GET "https://your-domain.pages.dev/api/admin/bookings" \
  -H "Authorization: Bearer <jwt_token>"
```

### Using JavaScript

```javascript
// Get vehicles
const response = await fetch('/api/vehicles')
const data = await response.json()

// Admin login
const loginResponse = await fetch('/api/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})
const loginData = await loginResponse.json()

// Get bookings with auth
const bookingsResponse = await fetch('/api/admin/bookings', {
  headers: {
    'Authorization': `Bearer ${loginData.data.token}`
  }
})
const bookingsData = await bookingsResponse.json()
```

## Testing

Use the provided Postman collection or test endpoints directly:

```bash
# Test public endpoints
curl -X GET "http://localhost:3000/api/vehicles"
curl -X GET "http://localhost:3000/api/company"

# Test admin endpoints (after login)
curl -X GET "http://localhost:3000/api/admin/bookings" \
  -H "Authorization: Bearer <token>"
```
