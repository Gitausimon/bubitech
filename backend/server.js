const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const repairRoutes = require('./routes/repairRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running correctly.' });
});

app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/analytics', analyticsRoutes);

// Database connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      console.log('✅ MongoDB securely connected');
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
} else {
  console.log('⚠️ No MONGO_URI provided in .env. Running with mock data only.');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
