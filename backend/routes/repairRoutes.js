const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let mockRepairs = [
  { _id: 'REP-101', customerName: 'John Doe', deviceModel: 'Samsung A54', issueDescription: 'Broken screen', status: 'Quote Sent', partsCost: 7500, labourCost: 1500, assignedTech: 'Brian' },
  { _id: 'REP-102', customerName: 'Jane Smith', deviceModel: 'iPhone 11', issueDescription: 'Battery dies fast', status: 'Diagnosing', partsCost: 0, labourCost: 0, assignedTech: 'Unassigned' }
];

router.post('/', async (req, res) => {
  try {
    if (process.env.MONGO_URI) {
      const Repair = require('../models/Repair');
      const newRepair = new Repair(req.body);
      await newRepair.save();
      res.status(201).json({ success: true, data: newRepair });
    } else {
       const newRepair = { _id: `REP-${Math.floor(Math.random() * 1000)}`, ...req.body, status: 'Received', partsCost: 0, labourCost: 0 };
       mockRepairs.push(newRepair);
       res.status(201).json({ success: true, data: newRepair });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    if (process.env.MONGO_URI) {
      const Repair = require('../models/Repair');
      const repairs = await Repair.find().sort({ createdAt: -1 });
      res.json({ success: true, data: repairs });
    } else {
      res.json({ success: true, data: mockRepairs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (process.env.MONGO_URI) {
      const Repair = require('../models/Repair');
      const updatedRepair = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if(req.body.status) console.log(`📢 SMS Notification Sent: "Your repair is now: ${req.body.status}"`);
      res.json({ success: true, data: updatedRepair });
    } else {
      mockRepairs = mockRepairs.map(rep => rep._id === req.params.id ? { ...rep, ...req.body } : rep);
      if(req.body.status) console.log(`📢 SMS Notification Sent: "Your repair is now: ${req.body.status}"`);
      res.json({ success: true, data: mockRepairs.find(r => r._id === req.params.id) });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
