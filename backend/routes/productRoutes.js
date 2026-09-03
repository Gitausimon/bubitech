const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET - List products strictly from DB (no more mocks)
router.get('/', async (req, res) => {
  try {
    if (process.env.MONGO_URI) {
      const products = await Product.find({});
      res.json({ success: true, data: products });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Append new phone natively to DB
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      brand: req.body.brand || "Generic",
      price: req.body.price || 0,
      condition: req.body.condition || "New",
      imageUrl: req.body.imageUrl || "",
      hardwareSpecs: req.body.hardwareSpecs || {},
      stock: 1
    });
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
