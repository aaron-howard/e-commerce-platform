const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(auth);

// Get user's cart
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, p.name, p.price, p.image_url, p.stock_quantity,
             (c.quantity * p.price) as total_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1 AND p.is_active = true
      ORDER BY c.created_at DESC
    `, [req.user.userId]);

    // Calculate cart totals
    const cartTotal = result.rows.reduce((total, item) => total + parseFloat(item.total_price), 0);
    const itemCount = result.rows.reduce((count, item) => count + item.quantity, 0);

    res.json({
      items: result.rows,
      total: cartTotal,
      itemCount
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', [
  body('productId').isInt({ min: 1 }),
  body('quantity').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    // Check if product exists and is active
    const productResult = await pool.query(
      'SELECT id, stock_quantity FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Check stock availability
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient stock',
        availableStock: product.stock_quantity
      });
    }

    // Check if item already exists in cart
    const existingItem = await pool.query(
      'SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2',
      [req.user.userId, productId]
    );

    if (existingItem.rows.length > 0) {
      // Update existing item quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({ 
          message: 'Insufficient stock for requested quantity',
          availableStock: product.stock_quantity,
          currentInCart: existingItem.rows[0].quantity
        });
      }

      await pool.query(
        'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newQuantity, existingItem.rows[0].id]
      );

      res.json({ message: 'Cart updated successfully' });
    } else {
      // Add new item to cart
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [req.user.userId, productId, quantity]
      );

      res.json({ message: 'Item added to cart successfully' });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/update', [
  body('productId').isInt({ min: 1 }),
  body('quantity').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    if (quantity === 0) {
      // Remove item from cart
      await pool.query(
        'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
        [req.user.userId, productId]
      );
      return res.json({ message: 'Item removed from cart' });
    }

    // Check stock availability
    const productResult = await pool.query(
      'SELECT stock_quantity FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (productResult.rows[0].stock_quantity < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient stock',
        availableStock: productResult.rows[0].stock_quantity
      });
    }

    // Update quantity
    const result = await pool.query(
      'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3',
      [quantity, req.user.userId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
      [req.user.userId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear entire cart
router.delete('/clear', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart WHERE user_id = $1',
      [req.user.userId]
    );

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
