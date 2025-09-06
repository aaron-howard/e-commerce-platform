const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, sort = 'created_at', order = 'desc' } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = true
    `;
    const queryParams = [];
    let paramCount = 0;

    // Add category filter
    if (category) {
      paramCount++;
      query += ` AND p.category_id = $${paramCount}`;
      queryParams.push(category);
    }

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Add sorting
    const validSortFields = ['name', 'price', 'created_at', 'stock_quantity'];
    const validOrders = ['asc', 'desc'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = validOrders.includes(order.toLowerCase()) ? order.toUpperCase() : 'DESC';
    
    query += ` ORDER BY p.${sortField} ${sortOrder}`;

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    queryParams.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM products p WHERE p.is_active = true';
    const countParams = [];
    let countParamCount = 0;

    if (category) {
      countParamCount++;
      countQuery += ` AND p.category_id = $${countParamCount}`;
      countParams.push(category);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (p.name ILIKE $${countParamCount} OR p.description ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      products: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: offset + parseInt(limit) < totalCount,
        hasPrev: offset > 0
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = $1 AND p.is_active = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes (require authentication and admin role)
router.use(auth);

// Create product (Admin only)
router.post('/', [
  body('name').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('categoryId').isInt({ min: 1 }),
  body('stockQuantity').isInt({ min: 0 })
], async (req, res) => {
  try {
    // Check if user is admin
    const userResult = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied. Admin required.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, categoryId, stockQuantity, imageUrl } = req.body;

    const result = await pool.query(
      'INSERT INTO products (name, description, price, category_id, stock_quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, categoryId, stockQuantity, imageUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', [
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('price').optional().isNumeric().isFloat({ min: 0 }),
  body('categoryId').optional().isInt({ min: 1 }),
  body('stockQuantity').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    // Check if user is admin
    const userResult = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied. Admin required.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, categoryId, stockQuantity, imageUrl, isActive } = req.body;

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      updateFields.push(`name = $${paramCount}`);
      values.push(name);
    }
    if (description !== undefined) {
      paramCount++;
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
    }
    if (price !== undefined) {
      paramCount++;
      updateFields.push(`price = $${paramCount}`);
      values.push(price);
    }
    if (categoryId !== undefined) {
      paramCount++;
      updateFields.push(`category_id = $${paramCount}`);
      values.push(categoryId);
    }
    if (stockQuantity !== undefined) {
      paramCount++;
      updateFields.push(`stock_quantity = $${paramCount}`);
      values.push(stockQuantity);
    }
    if (imageUrl !== undefined) {
      paramCount++;
      updateFields.push(`image_url = $${paramCount}`);
      values.push(imageUrl);
    }
    if (isActive !== undefined) {
      paramCount++;
      updateFields.push(`is_active = $${paramCount}`);
      values.push(isActive);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    // Check if user is admin
    const userResult = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied. Admin required.' });
    }

    const { id } = req.params;

    const result = await pool.query(
      'UPDATE products SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
