const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

function generateOrderNumber() {
  return 'SHIKU' + Date.now().toString().slice(-6);
}

// POST /api/orders - create a WhatsApp (pay on pickup) order
router.post('/', async (req, res) => {
  try {
    const { orderNumber, customer, items, total } = req.body;

    if (!customer || !customer.full_name || !customer.phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!Number.isFinite(Number(total)) || Number(total) <= 0) {
      return res.status(400).json({ message: 'Invalid order total' });
    }

    const order = new Order({
      order_number: orderNumber || generateOrderNumber(),
      customer: {
        full_name: customer.full_name,
        phone: customer.phone,
        email: customer.email || '',
        pickup_location: customer.pickup_location || 'JKUAT Gate B (kindly check the map)',
        notes: customer.notes || ''
      },
      items: items.map((item) => {
        const entry = {
          name: item.name || 'Item',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1
        };
        const pid = item.product_id || item.productId || (item.product && item.product._id);
        if (pid && /^[0-9a-fA-F]{24}$/.test(String(pid))) {
          entry.product_id = pid;
        }
        return entry;
      }),
      total: Number(total),
      payment_method: 'whatsapp',
      payment_status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// GET /api/orders - admin order list (newest first)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
