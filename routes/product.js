const express = require('express');
const router = express.Router();
const { validateProduct } = require('../middleware/validate');
const { NotFoundError } = require('../utils/errors');

// In-memory store
let products = [];

// GET all products with filtering, search, and pagination
router.get('/', (req, res) => {
  let { category, search, page = 1, limit = 5 } = req.query;
  let filtered = [...products];

  if (category) filtered = filtered.filter(p => p.category === category);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);

  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    total: filtered.length,
    data: filtered.slice(start, end)
  });
});

// GET product by ID
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
});

// POST create a new product
router.post('/', validateProduct, (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update a product
router.put('/:id', validateProduct, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  products[index] = { id: req.params.id, ...req.body };
  res.json(products[index]);
});

// DELETE a product
router.delete('/:id', (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
});

// Product stats route
router.get('/stats/summary', (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});

module.exports = router;