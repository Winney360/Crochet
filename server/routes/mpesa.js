const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { stkPush, queryStatus, normalizePhone } = require('../utils/mpesa');

function generateOrderNumber() {
  return 'SHIKU' + Date.now().toString().slice(-6);
}

function parseMetadataItems(metadata) {
  const fields = {};
  if (metadata && Array.isArray(metadata.Item)) {
    for (const item of metadata.Item) {
      fields[item.Name] = item.Value;
    }
  }
  return fields;
}

// POST /api/mpesa/stkpush - Initiate Lipa Na M-Pesa (STK push)
router.post('/stkpush', async (req, res) => {
  try {
    const { phone, fullName, email, pickupLocation, notes, items, total } = req.body;

    if (!phone || !fullName || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!Number.isFinite(Number(total)) || Number(total) <= 0) {
      return res.status(400).json({ message: 'Invalid order total' });
    }

    const order = new Order({
      order_number: generateOrderNumber(),
      customer: {
        full_name: fullName,
        phone: normalizePhone(phone),
        email: email || '',
        pickup_location: pickupLocation || 'JKUAT Gate B (kindly check the map)',
        notes: notes || ''
      },
      items: items.map((item) => {
        const entry = {
          name: item.name || 'Item',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1
        };
        const pid = item.productId || (item.product && item.product._id);
        if (pid && /^[0-9a-fA-F]{24}$/.test(String(pid))) {
          entry.product_id = pid;
        }
        return entry;
      }),
      total: Number(total),
      payment_method: 'mpesa',
      payment_status: 'pending'
    });

    const stk = await stkPush({
      amount: order.total,
      phone: order.customer.phone,
      accountReference: order.order_number,
      transactionDesc: 'Crochet order payment'
    });

    order.checkout_request_id = stk.CheckoutRequestID || '';
    await order.save();

    res.status(201).json({
      orderNumber: order.order_number,
      checkoutRequestID: order.checkout_request_id,
      responseCode: stk.ResponseCode,
      responseDescription: stk.ResponseDescription
    });
  } catch (error) {
    console.error('M-Pesa stkpush error:', error.message);
    res.status(502).json({ message: error.message });
  }
});

// POST /api/mpesa/callback - Safaricom pushes the STK result here
router.post('/callback', async (req, res) => {
  try {
    const stkCallback = req.body && req.body.Body && req.body.Body.stkCallback;

    if (!stkCallback || !stkCallback.CheckoutRequestID) {
      return res.json({ ResultCode: 1, ResultDesc: 'No callback data' });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    const order = await Order.findOne({ checkout_request_id: CheckoutRequestID });
    if (!order) {
      return res.json({ ResultCode: 1, ResultDesc: 'Order not found' });
    }

    if (ResultCode === 0) {
      const meta = parseMetadataItems(CallbackMetadata);
      order.payment_status = 'completed';
      order.mpesa_receipt = meta.MpesaReceiptNumber || '';
      order.transaction_date = meta.TransactionDate ? String(meta.TransactionDate) : '';
      order.result_code = '0';
      order.result_desc = ResultDesc || 'The service request is processed successfully';
    } else {
      order.payment_status = 'failed';
      order.result_code = String(ResultCode);
      order.result_desc = ResultDesc || 'Payment failed';
    }
    await order.save();

    res.json({ ResultCode: 0 });
  } catch (error) {
    console.error('M-Pesa callback error:', error.message);
    res.json({ ResultCode: 0 });
  }
});

// POST /api/mpesa/query - Query transaction status (used for polling)
router.post('/query', async (req, res) => {
  try {
    const { checkoutRequestID } = req.body;
    if (!checkoutRequestID) {
      return res.status(400).json({ message: 'checkoutRequestID is required' });
    }

    const result = await queryStatus(checkoutRequestID);
    const resultCodeString = String(result.ResultCode === undefined ? '' : result.ResultCode);

    let status = 'pending';
    const permanentFailures = ['1', '1032', '1037', '2001'];

    if (result.ResultCode === 0 || result.ResultCode === '0') {
      status = 'completed';
    } else if (result.errorCode === '500.001.1001') {
      // Transaction not yet registered by Safaricom — keep polling
      status = 'pending';
    } else if (permanentFailures.includes(resultCodeString)) {
      status = 'failed';
    }

    const order = await Order.findOne({ checkout_request_id: checkoutRequestID });

    if (order && status === 'completed') {
      const meta = parseMetadataItems(result.CallbackMetadata);
      order.payment_status = 'completed';
      order.mpesa_receipt = meta.MpesaReceiptNumber || '';
      order.transaction_date = meta.TransactionDate ? String(meta.TransactionDate) : '';
      order.result_code = resultCodeString;
      order.result_desc = result.ResultDesc || 'Success';
      await order.save();
    } else if (order && status === 'failed' && order.payment_status === 'pending') {
      order.payment_status = 'failed';
      order.result_code = resultCodeString;
      order.result_desc = result.ResultDesc || 'Payment failed';
      await order.save();
    }

    res.json({
      status,
      resultCode: resultCodeString,
      resultDesc: result.ResultDesc || '',
      orderNumber: order ? order.order_number : null,
      mpesaReceipt: order ? order.mpesa_receipt : ''
    });
  } catch (error) {
    console.error('M-Pesa query error:', error.message);
    res.status(502).json({ message: error.message });
  }
});

module.exports = router;