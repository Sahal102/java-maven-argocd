const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM orders');
  res.render('checkout', { orders: result.rows });
});

module.exports = router;
