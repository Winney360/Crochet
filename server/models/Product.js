const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  original_price: {
    type: Number,
    min: 0
  },
  // CHANGE: Replace image_url with images array
  images: [{
    type: String,
    required: true
  }],
  // KEEP: For backward compatibility
  image_url: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Baby Collection', 'Adult Clothing', 'Bags Collection']
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // For backward compatibility: set image_url to first image if images array exists
  if (this.images && this.images.length > 0 && !this.image_url) {
    this.image_url = this.images[0];
  }
  
  next();
});

module.exports = mongoose.model('Product', productSchema);