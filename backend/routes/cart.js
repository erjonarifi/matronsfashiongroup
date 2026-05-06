const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/cart — get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ci.id, ci.quantity, ci.added_at,
              p.id as product_id, p.name, p.price, p.image_url, p.stock, p.category
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.added_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/cart — add item to cart
router.post('/', authenticateToken, async (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  if (!product_id) return res.status(400).json({ message: 'Product ID is required.' });

  try {
    // Check product exists and has enough stock
    const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [product_id]);
    if (productResult.rows.length === 0) return res.status(404).json({ message: 'Product not found.' });

    const product = productResult.rows[0];
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} items left in stock.` });
    }

    // Upsert — if already in cart, increase quantity
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3
       RETURNING *`,
      [req.user.id, product_id, quantity]
    );

    res.status(201).json({ message: 'Added to cart.', item: result.rows[0] });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/cart/:id — update quantity
router.put('/:id', authenticateToken, async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1.' });

  try {
    const result = await pool.query(
      `UPDATE cart_items SET quantity = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Cart item not found.' });
    res.json({ message: 'Cart updated.', item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/cart/:id — remove item from cart
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Cart item not found.' });
    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/cart — clear entire cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
