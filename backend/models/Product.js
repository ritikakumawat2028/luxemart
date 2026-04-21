const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  newArrival: { type: Boolean, default: false },
  discount: { type: Number },
  tags: [{ type: String }],
  features: [{ type: String }],
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
