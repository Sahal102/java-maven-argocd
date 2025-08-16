const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const { pool, migrate } = require('./db'); // ✅ Correct destructuring import

dotenv.config();

const app = express();

// View engine + static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));

app.get('/', (req, res) => res.redirect('/products'));

// Function to run migrations
async function runMigrations() {
  const client = await pool.connect();
  try {
    await migrate(client);
    console.log('✅ Database migrations applied');
  } finally {
    client.release();
  }
}

// Handle "--migrate" argument (only run migrations, no server)
if (process.argv.includes('--migrate')) {
  (async () => {
    try {
      await runMigrations();
      process.exit(0); // exit after migrations
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
