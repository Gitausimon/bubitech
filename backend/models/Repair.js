const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contact: { type: String, required: true },
  deviceModel: { type: String, required: true },
  imei: { type: String }, // Optional, recorded on intake
  issueDescription: { type: String, required: true },
  dropoffMethod: { type: String, enum: ['Walk-in', 'Courier'], default: 'Walk-in' },
  preferredDate: { type: String },
  
  // Internal Tech Fields
  status: { 
    type: String, 
    enum: ['Received', 'Diagnosing', 'Quote Sent', 'Customer Approved', 'Repairing', 'Testing', 'Ready for Pickup', 'Completed'],
    default: 'Received' 
  },
  diagnostics: { type: String, default: '' },
  partsCost: { type: Number, default: 0 },
  labourCost: { type: Number, default: 0 },
  assignedTech: { type: String, default: 'Unassigned' },
  repairNotes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Repair', repairSchema);
