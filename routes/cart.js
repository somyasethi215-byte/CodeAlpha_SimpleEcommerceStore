// routes/cart.js
const express = require('express');
const db = require('../db/database');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
router.use(requireAuth); // every cart route requires login

// GET /api/cart - current user's cart, joined with product info
router.get('/', (req, res) => {
  const items = db
    .prepare(
      `SELECT ci.id AS cart_item_id, ci.quantity, p.*
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`
    )
    .all(req.session.userId);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items, total });
});

// POST /api/cart - add a product (or increase quantity if already in cart)
router.post('/', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  const existing = db
    .prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?')
    .get(req.session.userId, productId);

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(
      quantity,
      existing.id
    );
  } else {
    db.prepare(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)'
    ).run(req.session.userId, productId, quantity);
  }

  res.status(201).json({ message: 'Added to cart.' });
});

// PUT /api/cart/:cartItemId - set an exact quantity
router.put('/:cartItemId', (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1.' });

  const result = db
    .prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?')
    .run(quantity, req.params.cartItemId, req.session.userId);

  if (result.changes === 0) return res.status(404).json({ error: 'Cart item not found.' });
  res.json({ message: 'Quantity updated.' });
});

// DELETE /api/cart/:cartItemId - remove one item from the cart
router.delete('/:cartItemId', (req, res) => {
  const result = db
    .prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?')
    .run(req.params.cartItemId, req.session.userId);

  if (result.changes === 0) return res.status(404).json({ error: 'Cart item not found.' });
  res.json({ message: 'Removed from cart.' });
});

module.exports = router;
