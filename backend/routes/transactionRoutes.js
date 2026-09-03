const express = require('express');
const router = express.Router();

const Transaction = require('../models/Transaction');
const axios = require('axios');

// Middleware to get OAuth token
const getMpesaToken = async (req, res, next) => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  
  if(!consumerKey || !consumerSecret) {
    console.log("No M-Pesa credentials found, skipping actual STK Push");
    req.mpesaToken = null;
    return next();
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  try {
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    req.mpesaToken = response.data.access_token;
    next();
  } catch (error) {
    console.error("M-Pesa Token Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: "Failed to authenticate with M-Pesa" });
  }
};

// Mock M-Pesa Callback (Daraja API Stub)
router.post('/mpesa-callback', async (req, res) => {
  console.log("M-Pesa IPN Received: ", JSON.stringify(req.body, null, 2));
  
  const callbackData = req.body.Body?.stkCallback;
  if (callbackData && callbackData.ResultCode === 0) {
    const meta = callbackData.CallbackMetadata?.Item;
    const mpesaReceiptNumber = meta?.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
    
    try {
      const tx = await Transaction.findOne({ status: 'Pending', paymentMethod: 'MPesa' }).sort({ createdAt: -1 });
      if (tx) {
        tx.status = 'Completed';
        tx.mpesaReceiptNumber = mpesaReceiptNumber;
        await tx.save();
        console.log(`✅ Transaction ${tx._id} marked as completed with receipt ${mpesaReceiptNumber}`);
      }
    } catch(err) {
      console.error(err);
    }
  }

  res.status(200).send("Received");
});

// Submit a new POS transaction
router.post('/', getMpesaToken, async (req, res) => {
  const { cart, totalAmount, paymentMethod, phoneNumber, customerName, deliveryLocation } = req.body;
  
  try {
    const newTx = await Transaction.create({
      cart: cart || [],
      totalAmount,
      paymentMethod,
      customerPhone: phoneNumber,
      customerName,
      deliveryLocation,
      status: 'Pending'
    });

    if (paymentMethod === 'MPesa' && req.mpesaToken) {
      const shortCode = process.env.MPESA_SHORTCODE;
      const passkey = process.env.MPESA_PASSKEY;
      const d = new Date();
      const timestamp = d.toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHmmss
      const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
      
      const payload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(totalAmount),
        PartyA: phoneNumber || '254700000000',
        PartyB: shortCode,
        PhoneNumber: phoneNumber || '254700000000',
        CallBackURL: process.env.MPESA_CALLBACK_URL || "https://bubi-tech.vercel.app/api/transactions/mpesa-callback",
        AccountReference: `BubiTech-${newTx._id}`,
        TransactionDesc: "Payment for Bubi Tech"
      };

      try {
        await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
          headers: { Authorization: `Bearer ${req.mpesaToken}` }
        });
        console.log(`✅ Initiated M-Pesa push for KSh ${totalAmount} to ${payload.PhoneNumber}`);
      } catch (err) {
        console.error("M-Pesa STK Push Error:", err.response ? err.response.data : err.message);
      }
    } else if (paymentMethod !== 'MPesa') {
       newTx.status = 'Completed';
       await newTx.save();
    }

    res.json({ success: true, message: 'Transaction submitted', transactionId: newTx._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
