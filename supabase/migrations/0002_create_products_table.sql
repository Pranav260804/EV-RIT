-- Migration File: Create the products affiliate database

-- Generate Native Products Table
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  brand text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  affiliate_link text NOT NULL,
  regional_prices jsonb NOT NULL DEFAULT '{}'::jsonb,
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  rating float DEFAULT 5.0,
  tag text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Mock Values mapping localized regional prices and specs correctly
INSERT INTO products (title, brand, description, image_url, affiliate_link, regional_prices, specs, rating, tag)
VALUES 
(
  'Level 2 Fast Home Charger (7.2kW)', 
  'EV-RIT Energy', 
  'Smart WiFi-enabled 32A charging station perfect for domestic overnight high-speed grid rendering.', 
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800', 
  'https://amazon.com', 
  '{"IN": 41500, "US": 499.00, "AU": 770.00}', 
  '{"Amperage": "32A", "Network Interface": "WiFi/Bluetooth", "Cable Length": "25 Ft", "IP Rating": "IP65 Weatherproof"}', 
  4.8, 
  'Best Seller'
),
(
  'Universal RFID Charging Card', 
  'EV-RIT Connect', 
  'One-tap hardware access to across 15,000+ terrestrial nodes organically tied into the EV-RIT backend.', 
  'https://images.unsplash.com/photo-1563200985-0556ea0ee054?auto=format&fit=crop&q=80&w=800', 
  'https://amazon.com', 
  '{"IN": 2500, "US": 29.99, "AU": 45.00}', 
  '{"Network Compatibility": "ChargePoint, EVgo, Universal", "Security": "AES-128 Encryption", "Material": "Recycled PVC"}', 
  4.9, 
  'Essential'
),
(
  'Premium EV Cable Organizer', 
  'Apex Gear', 
  'Military-grade aluminum locking bracket keeping your high-voltage connectors pristine and safely mounted.', 
  'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=800', 
  'https://amazon.com', 
  '{"IN": 7100, "US": 85.00, "AU": 130.00}', 
  '{"Material": "Aerospace Aluminum Alloy", "Mounting System": "Wall Stud (Hardware Included)", "Weight Capacity": "50 lbs"}', 
  4.7, 
  'Accessory'
);
