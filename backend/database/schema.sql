-- Matrons Fashion Group Database Schema
-- Run this file in your PostgreSQL database

CREATE DATABASE matronsfashion;

\c matronsfashion;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Seed default admin account
-- Password: admin123 (change this immediately in production)
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin',
  'admin@matronsfashion.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
);

-- Seed sample products
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
('Silk Evening Gown', 'Luxurious silk evening gown with intricate embroidery details. Perfect for formal events.', 349.99, 'Dresses', 'https://images.unsplash.com/photo-1566479179817-e1b05f47c3c1?w=500', 12),
('Tailored Blazer', 'Classic tailored blazer in premium wool blend. A wardrobe essential.', 189.99, 'Blazers', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', 25),
('Leather Handbag', 'Genuine leather structured handbag with gold hardware. Timeless elegance.', 275.00, 'Accessories', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', 18),
('Cashmere Turtleneck', 'Ultra-soft cashmere turtleneck in a range of sophisticated colors.', 145.00, 'Tops', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', 30),
('Wide-Leg Trousers', 'High-waisted wide-leg trousers in premium crepe fabric. Effortlessly chic.', 129.99, 'Bottoms', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 20),
('Strappy Heels', 'Elegant strappy heels with block heel for all-day comfort. Gold tone hardware.', 219.00, 'Shoes', 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=500', 15);

RAISE NOTICE 'Database setup complete!';
