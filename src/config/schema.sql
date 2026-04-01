-- Update users table to include image_url for profile images
ALTER TABLE users
ADD COLUMN image_url VARCHAR(255);

-- Update services table to include image_url for service images
ALTER TABLE services
ADD COLUMN image_url VARCHAR(255);