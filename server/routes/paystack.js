const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { initializeTransaction, verifyTransaction, mapStatus } = require('../utils/paystack');

function generateOrderNumber() {
  return 'SHIKU' + Date.now().toString().slice(-6);
}

function generateReference() {
  return `SHIKU-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function mapItems(items) {
  return (items || []).map((item) => {
    const entry = {
      name: item.name || 'Item',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1
    };
    const pid = item.productId || item.product_id || (item.product && item.product._id);
    if (pid && /^[0-9a-fA-F]{24}$/.test(String(pid))) {
      entry.product_id = pid;
    }
    return entry;
  });
}

// POST /api/paystack/initialize - create order and start a Paystack transaction
router.post('/initialize', async (req, res) => {
  try {
    const { email, fullName, phone, pickupLocation, notes, items, total, callbackUrl, cancelUrl } = req.body;

    if (!email || !fullName || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!Number.isFinite(Number(total)) || Number(total) <= 0) {
      return res.status(400).json({ message: 'Invalid order total' });
    }

    const orderNumber = generateOrderNumber();
    const reference = generateReference();

    const order = new Order({
      order_number: orderNumber,
      customer: {
        full_name: fullName,
        phone,
        email,
        pickup_location: pickupLocation || 'JKUAT Gate B (kindly check the map)',
        notes: notes || ''
      },
      items: mapItems(items),
      total: Number(total),
      payment_method: 'paystack',
      payment_status: 'pending',
      paystack_reference: reference
    });
    await order.save();

    const result = await initializeTransaction({
      email,
      amount: order.total,
      reference,
      callbackUrl,
      cancelUrl,
      metadata: {
        custom_fields: [
          {
            display_name: 'Order Number',
            variable_name: 'order_number',
            value: order.order_number
          },
          {
            display_name: 'Full Name',
            variable_name: 'full_name',
            value: fullName
          },
          {
            display_name: 'Phone',
            variable_name: 'phone',
            value: phone
          }
        ]
      }
    });

    res.status(201).json({
      orderNumber: order.order_number,
      reference,
      authorizationUrl: result.authorization_url
    });
  } catch (error) {
    console.error('Paystack initialize error:', error.message);
    res.status(502).json({ message: error.message });
  }
});

// POST /api/paystack/verify - confirm a transaction when the customer returns
router.post('/verify', async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) {
      return res.status(400).json({ message: 'reference is required' });
    }

    const result = await verifyTransaction(reference);
    const status = mapStatus(result.status);

    const order = await Order.findOne({ paystack_reference: reference });

    if (order) {
      order.result_code = String(result.status || '');
      order.result_desc = result.gateway_response || result.status || '';
      if (status === 'completed') {
        order.payment_status = 'completed';
        order.transaction_date = result.paid_at ? String(result.paid_at) : '';
      } else if (status === 'failed' && order.payment_status === 'pending') {
        order.payment_status = 'failed';
      }
      await order.save();
    }

    res.json({
      status,
      paystackReference: result.reference || reference,
      resultCode: result.status || '',
      resultDesc: result.gateway_response || '',
      order
    });
  } catch (error) {
    console.error('Paystack verify error:', error.message);
    res.status(502).json({ message: error.message });
  }
});

module.exports = router;