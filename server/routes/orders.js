const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// All order routes require authentication
router.use(auth);

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await pool.query(`
      SELECT o.*, 
             COUNT(oi.id) as item_count,
             SUM(oi.quantity * oi.price) as total_amount
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.user.userId, parseInt(limit), offset]);

    // Get total count for pagination
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE user_id = $1',
      [req.user.userId]
    );
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      orders: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: offset + parseInt(limit) < totalCount,
        hasPrev: offset > 0
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order with items
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get order details
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get order items
    const itemsResult = await pool.query(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [id]);

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order and process payment
router.post('/create', [
  body('shippingAddress').notEmpty(),
  body('billingAddress').notEmpty(),
  body('paymentMethodId').notEmpty()
], async (req, res) => {
  const client = await pool.connect();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shippingAddress, billingAddress, paymentMethodId } = req.body;

    await client.query('BEGIN');

    // Get cart items
    const cartResult = await client.query(`
      SELECT c.*, p.name, p.price, p.stock_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1 AND p.is_active = true
    `, [req.user.userId]);

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartResult.rows) {
      if (item.stock_quantity < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.name}`,
          product: item.name,
          availableStock: item.stock_quantity,
          requestedQuantity: item.quantity
        });
      }

      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/order-success`,
    });

    if (paymentIntent.status !== 'succeeded') {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        message: 'Payment failed',
        status: paymentIntent.status
      });
    }

    // Create order
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, total_amount, shipping_address, billing_address, stripe_payment_intent_id, status)
      VALUES ($1, $2, $3, $4, $5, 'confirmed')
      RETURNING *
    `, [req.user.userId, totalAmount, JSON.stringify(shippingAddress), JSON.stringify(billingAddress), paymentIntent.id]);

    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of orderItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [order.id, item.productId, item.quantity, item.price]);

      // Update product stock
      await client.query(`
        UPDATE products 
        SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [item.quantity, item.productId]);
    }

    // Clear user's cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.userId]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at
      },
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ 
        message: 'Payment failed',
        error: error.message
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

// Create payment intent (for frontend to confirm payment)
router.post('/create-payment-intent', async (req, res) => {
  try {
    // Get cart total
    const cartResult = await pool.query(`
      SELECT SUM(c.quantity * p.price) as total
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1 AND p.is_active = true
    `, [req.user.userId]);

    const totalAmount = cartResult.rows[0].total || 0;

    if (totalAmount <= 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      metadata: {
        userId: req.user.userId.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      totalAmount
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
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
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
