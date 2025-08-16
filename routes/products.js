const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM products');
  res.render('products', { products: result.rows });
});

module.exports = router;
