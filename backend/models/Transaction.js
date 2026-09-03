const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'MPesa', 'Card', 'Credit'], required: true },
  mpesaReceiptNumber: { type: String },
  customerName: { type: String },
  customerPhone: { type: String },
  deliveryLocation: { type: String },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
