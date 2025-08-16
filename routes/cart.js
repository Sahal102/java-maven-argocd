const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM cart');
  res.render('cart', { items: result.rows });
});

module.exports = router;
