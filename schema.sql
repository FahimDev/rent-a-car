-- Car Rental App Database Schema for D1

-- Admins table
CREATE TABLE IF NOT EXISTS "admins" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS "vehicles" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "pricePerDay" REAL NOT NULL,
    "description" TEXT,
    "features" TEXT,
    "isAvailable" INTEGER NOT NULL DEFAULT 1,
    "adminId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Vehicle photos table
CREATE TABLE IF NOT EXISTS "vehicle_photos" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isPrimary" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Passengers table
CREATE TABLE IF NOT EXISTS "passengers" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "phone" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "email" TEXT,
    "isVerified" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS "bookings" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "passengerId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "bookingDate" DATETIME NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "tripType" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "dropoffLocation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("passengerId") REFERENCES "passengers"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Company info table
CREATE TABLE IF NOT EXISTS "company_info" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "services" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "bookingId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_vehicles_type" ON "vehicles"("type");
CREATE INDEX IF NOT EXISTS "idx_vehicles_available" ON "vehicles"("isAvailable");
CREATE INDEX IF NOT EXISTS "idx_bookings_status" ON "bookings"("status");
CREATE INDEX IF NOT EXISTS "idx_bookings_date" ON "bookings"("bookingDate");
CREATE INDEX IF NOT EXISTS "idx_passengers_phone" ON "passengers"("phone");
