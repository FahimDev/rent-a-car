-- Seed data for Car Rental App

-- Insert admin user (password is hashed version of 'admin123')
INSERT INTO "admins" ("id", "username", "password", "email", "phone", "role") VALUES 
('admin-1', 'admin', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'admin@rentacar.com', '+8801234567890', 'admin');

-- Insert company info
INSERT INTO "company_info" ("id", "name", "tagline", "description", "address", "phone", "email", "whatsapp", "latitude", "longitude", "services") VALUES 
('company-1', 'Rent-A-Car Bangladesh', 'আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন | Reliable Transportation for Your Journey', 'We provide premium car rental services across Bangladesh with professional drivers and well-maintained vehicles.', 'Dhaka, Bangladesh', '+8801234567890', 'info@rentacar.com', '+8801234567890', 23.8103, 90.4125, '["Airport Transfer", "City Tour", "Long Distance Travel", "Corporate Transportation", "Wedding & Event Services"]');

-- Insert sample vehicles
INSERT INTO "vehicles" ("id", "name", "type", "capacity", "pricePerDay", "description", "features", "isAvailable", "adminId") VALUES 
('vehicle-1', 'Toyota Corolla', 'sedan', 4, 2500, 'Comfortable sedan perfect for city travel and short trips.', '["AC", "Music System", "Comfortable Seats", "Professional Driver"]', 1, 'admin-1'),
('vehicle-2', 'Toyota Noah', 'noah', 7, 3500, 'Spacious 7-seater perfect for family trips and group travel.', '["AC", "Music System", "Spacious Interior", "Professional Driver", "Child Safety Features"]', 1, 'admin-1'),
('vehicle-3', 'Toyota Hiace', 'hiace', 12, 4500, 'Large capacity vehicle ideal for corporate events and large groups.', '["AC", "Music System", "Large Capacity", "Professional Driver", "Luggage Space"]', 1, 'admin-1');

-- Insert sample vehicle photos
INSERT INTO "vehicle_photos" ("id", "vehicleId", "url", "alt", "isPrimary", "order") VALUES 
('photo-1', 'vehicle-1', '/images/vehicles/sedan-1.jpg', 'Toyota Corolla - Photo 1', 1, 0),
('photo-2', 'vehicle-1', '/images/vehicles/sedan-2.jpg', 'Toyota Corolla - Photo 2', 0, 1),
('photo-3', 'vehicle-1', '/images/vehicles/sedan-3.jpg', 'Toyota Corolla - Photo 3', 0, 2),
('photo-4', 'vehicle-2', '/images/vehicles/noah-1.jpg', 'Toyota Noah - Photo 1', 1, 0),
('photo-5', 'vehicle-2', '/images/vehicles/noah-2.jpg', 'Toyota Noah - Photo 2', 0, 1),
('photo-6', 'vehicle-2', '/images/vehicles/noah-3.jpg', 'Toyota Noah - Photo 3', 0, 2),
('photo-7', 'vehicle-3', '/images/vehicles/hiace-1.jpg', 'Toyota Hiace - Photo 1', 1, 0),
('photo-8', 'vehicle-3', '/images/vehicles/hiace-2.jpg', 'Toyota Hiace - Photo 2', 0, 1),
('photo-9', 'vehicle-3', '/images/vehicles/hiace-3.jpg', 'Toyota Hiace - Photo 3', 0, 2);
