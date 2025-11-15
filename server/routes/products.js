const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for MEMORY storage (no disk storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'crochet-products',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

// Create product with Cloudinary
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    console.log('=== PRODUCT CREATION START ===');
    console.log('Request body:', req.body);
    console.log('Uploaded files count:', req.files ? req.files.length : 0);
    
    const { name, description, price, original_price, category, rating, is_featured, existing_images } = req.body;
    
    // Check if we have the required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missing: { name: !name, description: !description, price: !price, category: !category }
      });
    }
    
    let uploadedImages = [];
    
    // Upload new images to Cloudinary
    if (req.files && req.files.length > 0) {
      console.log('Uploading files to Cloudinary...');
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer);
          uploadedImages.push(result.secure_url); // This is the HTTPS URL
          console.log('✅ Uploaded to Cloudinary:', result.secure_url);
        } catch (uploadError) {
          console.error('❌ Cloudinary upload failed:', uploadError);
          return res.status(500).json({ message: 'Image upload failed' });
        }
      }
    }
    
    // Handle existing images (could be Cloudinary URLs or other URLs)
    const existingImagesArray = existing_images ? (Array.isArray(existing_images) ? existing_images : [existing_images]) : [];
    const allImages = [...existingImagesArray, ...uploadedImages];
    
    if (allImages.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }
    
    // Generate slug from name
    const slug = generateSlug(name);

    console.log('Final product data:', {
      name, description, price, original_price, category, rating, is_featured, 
      images: allImages, 
      image_url: allImages[0],
      slug
    });

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : undefined,
      category,
      rating: parseFloat(rating),
      is_featured: is_featured === 'true',
      images: allImages,
      image_url: allImages[0], // First image for backward compatibility
      slug
    });

    await product.save();
    console.log('=== PRODUCT CREATION SUCCESS ===');
    res.status(201).json(product);
  } catch (error) {
    console.log('=== PRODUCT CREATION ERROR ===');
    console.error('Error details:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update product with Cloudinary
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, price, original_price, category, rating, is_featured, existing_images } = req.body;
    
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : undefined,
      category,
      rating: parseFloat(rating),
      is_featured: is_featured === 'true'
    };

    // If name changed, update slug
    if (name) {
      updateData.slug = generateSlug(name);
    }

    let uploadedImages = [];
    
    // Upload new images to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer);
          uploadedImages.push(result.secure_url);
        } catch (uploadError) {
          console.error('Cloudinary upload failed:', uploadError);
          return res.status(500).json({ message: 'Image upload failed' });
        }
      }
    }

    // Handle existing images
    const existingImagesArray = existing_images ? (Array.isArray(existing_images) ? existing_images : [existing_images]) : [];
    const allImages = [...existingImagesArray, ...uploadedImages];
    
    if (allImages.length > 0) {
      updateData.images = allImages;
      updateData.image_url = allImages[0];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ALL GET ROUTES REMAIN THE SAME (no changes needed)
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let filter = {};
    
    if (category) {
      filter.category = new RegExp(category, 'i');
    }
    
    if (featured === 'true') {
      filter.is_featured = true;
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ 
      category: new RegExp(category, 'i') 
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;