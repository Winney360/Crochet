const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    full_name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    pickup_location: { type: String, default: 'JKUAT Gate B (kindly check the map)' },
    notes: { type: String, default: '' }
  },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  payment_method: {
    type: String,
    enum: ['paystack', 'mpesa', 'whatsapp'],
    default: 'paystack'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  checkout_request_id: {
    type: String,
    default: ''
  },
  mpesa_receipt: {
    type: String,
    default: ''
  },
  paystack_reference: {
    type: String,
    default: ''
  },
  transaction_date: {
    type: String,
    default: ''
  },
  result_code: {
    type: String,
    default: ''
  },
  result_desc: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);