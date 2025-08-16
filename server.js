const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { pool, migrate } = require('./db');

dotenv.config();

const app = express();

// View engine + static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Session middleware (for cart)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 } // 1 hour
  })
);

// Routes
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));

app.get('/', (req, res) => res.redirect('/products'));

// Run migrations safely
async function runMigrations() {
  const client = await pool.connect();
  try {
    await migrate(client);
    console.log('✅ Database migrations applied');
  } finally {
    client.release();
  }
}

// Handle "--migrate" argument
if (process.argv.includes('--migrate')) {
  (async () => {
    try {
      await runMigrations();
      process.exit(0);
    } catch (e) {
      console.error('Migration failed', e);
      process.exit(1);
    }
  })();
} else {
  // Run migrations first, then start server
  (async () => {
    try {
      await runMigrations();
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () =>
        console.log(`Server running on port ${PORT}`)
      );
    } catch (e) {
      console.error('Startup failed', e);
      process.exit(1);
    }
  })();
}
