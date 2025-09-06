const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ecommerce',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const createTables = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(20),
        country VARCHAR(100),
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        image_url VARCHAR(500),
        stock_quantity INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cart table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        billing_address TEXT NOT NULL,
        stripe_payment_intent_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample categories
    await pool.query(`
      INSERT INTO categories (name, description) VALUES
      ('Electronics', 'Electronic devices and accessories'),
      ('Clothing', 'Fashion and apparel'),
      ('Books', 'Books and educational materials'),
      ('Home & Garden', 'Home improvement and garden supplies')
      ON CONFLICT DO NOTHING
    `);

    // Insert sample products
    await pool.query(`
      INSERT INTO products (name, description, price, category_id, stock_quantity, image_url) VALUES
      ('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 199.99, 1, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
      ('Smartphone', 'Latest model smartphone with advanced features', 899.99, 1, 25, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'),
      ('Laptop', 'High-performance laptop for work and gaming', 1299.99, 1, 15, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'),
      ('Cotton T-Shirt', 'Comfortable cotton t-shirt in various colors', 29.99, 2, 100, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'),
      ('Jeans', 'Classic blue jeans with modern fit', 79.99, 2, 75, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'),
      ('Programming Book', 'Comprehensive guide to modern programming', 49.99, 3, 30, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'),
      ('Garden Tools Set', 'Complete set of gardening tools', 89.99, 4, 20, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500')
      ON CONFLICT DO NOTHING
    `);

    console.log('Database tables created successfully!');
    console.log('Sample data inserted successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await pool.end();
  }
};

createTables();
