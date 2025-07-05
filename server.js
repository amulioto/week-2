// =========================
// server.js
// =========================

// Import required modules
const express = require('express'); // Express framework
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const productRoutes = require('./routes/products'); // Product routes
const logger = require('./middleware/logger'); // Custom logger middleware
const auth = require('./middleware/auth'); // Custom authentication middleware
const errorHandler = require('./middleware/errorHandler'); // Global error handler

require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Create Express app
const PORT = process.env.PORT || 3000; // Set port from env or default to 3000

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Custom logger middleware logs each request
app.use(logger);

// Custom authentication middleware checks API key
app.use(auth);

// Root route for basic health check
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Mount product API routes under /api/products
app.use('/api/products', productRoutes);

// Global error handler for catching errors
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
