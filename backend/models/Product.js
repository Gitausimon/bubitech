const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, enum: ['Smartphone', 'Accessory', 'Part'], default: 'Smartphone', required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  condition: { type: String, enum: ['New', 'Refurbished', 'Used'], default: 'New' },
  compatibility: [{ type: String }],
  imageUrl: { type: String },
  hardwareSpecs: { type: mongoose.Schema.Types.Mixed }, // To store deep specifications natively
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
