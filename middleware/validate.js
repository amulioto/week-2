const { ValidationError } = require('../utils/errors');

function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
    return next(new ValidationError('Invalid product data'));
  }
  next();
}

module.exports = { validateProduct };