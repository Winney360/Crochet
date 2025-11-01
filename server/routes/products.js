const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Configure multer for product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

// Create product with MULTIPLE image uploads
router.post('/', upload.array('images', 10), async (req, res) => { // CHANGED: single -> array, max 10 images
  try {
    console.log('=== PRODUCT CREATION START ===');
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files); // CHANGED: req.file -> req.files
    console.log('Request headers:', req.headers);
    
    const { name, description, price, original_price, category, rating, is_featured, existing_images } = req.body;
    
    // Check if we have the required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missing: { name: !name, description: !description, price: !price, category: !category }
      });
    }
    
    // Check if files were uploaded OR existing images provided
    const uploadedImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
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
      image_url: allImages[0], // For backward compatibility
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
      images: allImages, // Store all images
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

// Update product with MULTIPLE image uploads
router.put('/:id', upload.array('images', 10), async (req, res) => { // CHANGED: single -> array
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

    // Handle images: combine existing and new images
    const uploadedImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const existingImagesArray = existing_images ? (Array.isArray(existing_images) ? existing_images : [existing_images]) : [];
    
    const allImages = [...existingImagesArray, ...uploadedImages];
    
    if (allImages.length > 0) {
      updateData.images = allImages;
      updateData.image_url = allImages[0]; // First image for backward compatibility
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

// Get all products - UPDATED to handle images array
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
    
    // Ensure image URLs are complete and handle both single image_url and images array
    const productsWithFullUrls = products.map(product => {
      const productData = product._doc;
      
      // Handle images array
      if (productData.images && Array.isArray(productData.images)) {
        productData.images = productData.images.map(img => 
          img.startsWith('http') ? img : `${req.protocol}://${req.get('host')}${img}`
        );
      }
      
      // Handle single image_url for backward compatibility
      if (productData.image_url && !productData.image_url.startsWith('http')) {
        productData.image_url = `${req.protocol}://${req.get('host')}${productData.image_url}`;
      }
      
      return productData;
    });
    
    res.json(productsWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Keep all other routes the same...
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ 
      category: new RegExp(category, 'i') 
    }).sort({ createdAt: -1 });
    
    // Update image URLs
    const productsWithFullUrls = products.map(product => {
      const productData = product._doc;
      if (productData.images && Array.isArray(productData.images)) {
        productData.images = productData.images.map(img => 
          img.startsWith('http') ? img : `${req.protocol}://${req.get('host')}${img}`
        );
      }
      if (productData.image_url && !productData.image_url.startsWith('http')) {
        productData.image_url = `${req.protocol}://${req.get('host')}${productData.image_url}`;
      }
      return productData;
    });
    
    res.json(productsWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update image URLs
    const productData = product._doc;
    if (productData.images && Array.isArray(productData.images)) {
      productData.images = productData.images.map(img => 
        img.startsWith('http') ? img : `${req.protocol}://${req.get('host')}${img}`
      );
    }
    if (productData.image_url && !productData.image_url.startsWith('http')) {
      productData.image_url = `${req.protocol}://${req.get('host')}${productData.image_url}`;
    }
    
    res.json(productData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update image URLs
    const productData = product._doc;
    if (productData.images && Array.isArray(productData.images)) {
      productData.images = productData.images.map(img => 
        img.startsWith('http') ? img : `${req.protocol}://${req.get('host')}${img}`
      );
    }
    if (productData.image_url && !productData.image_url.startsWith('http')) {
      productData.image_url = `${req.protocol}://${req.get('host')}${productData.image_url}`;
    }
    
    res.json(productData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (unchanged)
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