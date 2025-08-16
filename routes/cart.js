const express = require('express');
const router = express.Router();
const db = require('../db');

// Initialize cart in session
function initCart(req) {
  if (!req.session.cart) req.session.cart = [];
}

// Add to cart
router.post('/add/:id', async (req, res) => {
  initCart(req);
  const productId = Number(req.params.id);
  const quantity = Number(req.body.quantity || 1);

  const { rows } = await db.query('SELECT id, name, price FROM products WHERE id=$1', [productId]);
  const product = rows[0];
  if (!product) return res.status(404).send('Product not found');

  const existing = req.session.cart.find(p => p.id === productId);
  if (existing) existing.quantity += quantity;
  else req.session.cart.push({ ...product, quantity });

  res.redirect('/cart');
});

// Remove from cart
router.post('/remove/:id', (req, res) => {
  initCart(req);
  req.session.cart = req.session.cart.filter(item => item.id != req.params.id);
  res.redirect('/cart');
});

// Show cart
router.get('/', (req, res) => {
  initCart(req);
  res.render('cart', { cart: req.session.cart });
});

module.exports = router;
