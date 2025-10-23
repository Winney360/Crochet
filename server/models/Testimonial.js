const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
    trim: true
  },
  profession: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  image_url: {
    type: String,
    default: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);