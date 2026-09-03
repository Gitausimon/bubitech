const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  productsSupplied: [{ type: String }],
  balanceOwed: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
