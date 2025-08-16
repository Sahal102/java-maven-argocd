const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Checkout page
router.get('/checkout', (req, res) => {
  res.render('checkout', { cart: req.session.cart });
});

// Place order
router.post('/place', async (req, res) => {
  const { customer_name, customer_email } = req.body;
  const cart = req.session.cart || [];
  if (cart.length === 0) return res.redirect('/cart');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const total = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const orderRes = await client.query(
      'INSERT INTO orders(customer_name, customer_email, total_price) VALUES ($1,$2,$3) RETURNING id',
      [customer_name, customer_email, total]
    );
    const orderId = orderRes.rows[0].id;

    for (let item of cart) {
      await client.query(
        'INSERT INTO order_items(order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    req.session.cart = [];
    res.send(`<h3>Order placed successfully!</h3><a href="/products">Back to Products</a>`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Failed to place order');
  } finally {
    client.release();
  }
});

module.exports = router;
