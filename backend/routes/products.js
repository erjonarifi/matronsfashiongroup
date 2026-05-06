const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/products — public, all products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];

    if (category && search) {
      query += ' WHERE category ILIKE $1 AND (name ILIKE $2 OR description ILIKE $2)';
      params.push(`%${category}%`, `%${search}%`);
    } else if (category) {
      query += ' WHERE category ILIKE $1';
      params.push(`%${category}%`);
    } else if (search) {
      query += ' WHERE name ILIKE $1 OR description ILIKE $1';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/products/:id — public, single product
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/products — admin only
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, description, price, category, image_url, stock } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, image_url, stock)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, parseFloat(price), category, image_url, parseInt(stock) || 0]
    );
    res.status(201).json({ message: 'Product added successfully.', product: result.rows[0] });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { name, description, price, category, image_url, stock } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, category = $4,
           image_url = $5, stock = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, description, parseFloat(price), category, image_url, parseInt(stock) || 0, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product updated successfully.', product: result.rows[0] });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/products/:id/stock — admin only, update stock only
router.patch('/:id/stock', authenticateToken, requireAdmin, async (req, res) => {
  const { stock } = req.body;
  if (stock === undefined || stock < 0) {
    return res.status(400).json({ message: 'Valid stock quantity required.' });
  }

  try {
    const result = await pool.query(
      'UPDATE products SET stock = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [parseInt(stock), req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Stock updated.', product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
