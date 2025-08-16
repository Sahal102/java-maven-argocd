const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// Simple query helper
async function query(text, params) {
  return pool.query(text, params);
}

// Run migrations from migrate.sql
async function migrate(client) {
  const sql = fs.readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8');
  await client.query(sql);
}

module.exports = { pool, query, migrate };
