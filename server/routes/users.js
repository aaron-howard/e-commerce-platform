const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(auth);

// Update user profile
router.put('/profile', [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('zipCode').optional().trim(),
  body('country').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, phone, address, city, state, zipCode, country } = req.body;

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    if (firstName !== undefined) {
      paramCount++;
      updateFields.push(`first_name = $${paramCount}`);
      values.push(firstName);
    }
    if (lastName !== undefined) {
      paramCount++;
      updateFields.push(`last_name = $${paramCount}`);
      values.push(lastName);
    }
    if (phone !== undefined) {
      paramCount++;
      updateFields.push(`phone = $${paramCount}`);
      values.push(phone);
    }
    if (address !== undefined) {
      paramCount++;
      updateFields.push(`address = $${paramCount}`);
      values.push(address);
    }
    if (city !== undefined) {
      paramCount++;
      updateFields.push(`city = $${paramCount}`);
      values.push(city);
    }
    if (state !== undefined) {
      paramCount++;
      updateFields.push(`state = $${paramCount}`);
      values.push(state);
    }
    if (zipCode !== undefined) {
      paramCount++;
      updateFields.push(`zip_code = $${paramCount}`);
      values.push(zipCode);
    }
    if (country !== undefined) {
      paramCount++;
      updateFields.push(`country = $${paramCount}`);
      values.push(country);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.user.userId);

    const result = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING id, email, first_name, last_name, phone, address, city, state, zip_code, country, is_admin`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zipCode: user.zip_code,
      country: user.country,
      isAdmin: user.is_admin
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const result = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, req.user.userId]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/all', async (req, res) => {
  try {
    // Check if user is admin
    const userResult = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied. Admin required.' });
    }

    const { page = 1, limit = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT id, email, first_name, last_name, phone, is_admin, created_at
      FROM users
    `;
    const queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` WHERE (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users';
    const countParams = [];
    let countParamCount = 0;

    if (search) {
      countParamCount++;
      countQuery += ` WHERE (first_name ILIKE $${countParamCount} OR last_name ILIKE $${countParamCount} OR email ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: offset + parseInt(limit) < totalCount,
        hasPrev: offset > 0
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (Admin only)
router.put('/:id/role', [
  body('isAdmin').isBoolean()
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
    const { isAdmin } = req.body;

    // Prevent user from changing their own admin status
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ message: 'Cannot change your own admin status' });
    }

    const result = await pool.query(
      'UPDATE users SET is_admin = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, first_name, last_name, is_admin',
      [isAdmin, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
