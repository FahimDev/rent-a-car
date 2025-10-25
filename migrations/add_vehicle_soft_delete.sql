-- Add deletedAt column to vehicles table for soft delete functionality
-- This migration adds the deletedAt column to support soft delete for vehicles

ALTER TABLE vehicles ADD COLUMN deletedAt TEXT;

-- Create index for better performance on soft delete queries
CREATE INDEX idx_vehicles_deleted_at ON vehicles(deletedAt);

-- Update existing records to have NULL deletedAt (not deleted)
UPDATE vehicles SET deletedAt = NULL WHERE deletedAt IS NULL;
