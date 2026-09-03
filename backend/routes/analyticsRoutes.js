const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Repair = require('../models/Repair');

let mockAnalytics = {
  todaysSales: 84500,
  ordersCount: 32,
  repairsCount: 11,
  estimatedProfit: 27400,
  weeklySalesChart: [
    { day: 'Mon', value: 45000 },
    { day: 'Tue', value: 62000 },
    { day: 'Wed', value: 38000 },
    { day: 'Thu', value: 84500 },
    { day: 'Fri', value: 91000 }
  ]
};

// GET /api/analytics
router.get('/', async (req, res) => {
  try {
    if (process.env.MONGO_URI) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysSalesAggr = await Transaction.aggregate([
        { $match: { createdAt: { $gte: today }, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      const todaysSales = todaysSalesAggr.length > 0 ? todaysSalesAggr[0].total : 0;
      
      const ordersCount = await Transaction.countDocuments({ createdAt: { $gte: today } });
      const repairsCount = await Repair.countDocuments({ createdAt: { $gte: today } });
      const estimatedProfit = Math.round(todaysSales * 0.30); // simplistic 30% margin

      const past7Days = new Date();
      past7Days.setDate(past7Days.getDate() - 6);
      past7Days.setHours(0, 0, 0, 0);
      
      const weeklySalesData = await Transaction.aggregate([
        { $match: { createdAt: { $gte: past7Days }, status: 'Completed' } },
        { $group: { _id: { $dayOfWeek: "$createdAt" }, total: { $sum: '$totalAmount' } } }
      ]);

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let weeklySalesChart = [];
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayIdx = d.getDay();
        const stat = weeklySalesData.find(s => s._id === dayIdx + 1);
        weeklySalesChart.push({
          day: daysOfWeek[dayIdx],
          value: stat ? stat.total : 0
        });
      }

      res.json({ 
        success: true, 
        data: { todaysSales, ordersCount, repairsCount, estimatedProfit, weeklySalesChart } 
      });
    } else {
      res.json({ success: true, data: mockAnalytics });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
