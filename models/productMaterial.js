const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  product_category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  customer_name: {
    type: String,
    required: true
  },
  associated_recipe: {
    type: String,
    required: true
  },
  pricing: {
    type: Number,
    required: true
  },
});

const Productmaterial = mongoose.model('ProductMaterial', productSchema);

module.exports = Productmaterial;