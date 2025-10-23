const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET cart items for a session
router.get('/', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const cartItems = await Cart.find({ session_id })
      .populate('product_id', 'name price image_url stock slug')
      .sort({ createdAt: -1 });

    // Transform the data to match frontend expectations
    const transformedItems = cartItems.map(item => ({
      _id: item._id,
      session_id: item.session_id,
      product_id: item.product_id._id,
      quantity: item.quantity,
      product: {
        _id: item.product_id._id,
        id: item.product_id._id, // For compatibility with your existing frontend
        name: item.product_id.name,
        price: item.product_id.price,
        image_url: item.product_id.image_url,
        stock: item.product_id.stock,
        slug: item.product_id.slug
      }
    }));

    res.json(transformedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD item to cart
router.post('/', async (req, res) => {
  try {
    const { session_id, product_id, quantity = 1 } = req.body;

    // Validate required fields
    if (!session_id || !product_id) {
      return res.status(400).json({ message: 'Session ID and Product ID are required' });
    }

    // Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({
      session_id,
      product_id
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity if item exists
      existingCartItem.quantity += parseInt(quantity);
      cartItem = await existingCartItem.save();
    } else {
      // Create new cart item
      cartItem = new Cart({
        session_id,
        product_id,
        quantity: parseInt(quantity)
      });
      await cartItem.save();
    }

    // Populate the product data for response
    await cartItem.populate('product_id', 'name price image_url stock slug');

    res.status(201).json({
      _id: cartItem._id,
      session_id: cartItem.session_id,
      product_id: cartItem.product_id._id,
      quantity: cartItem.quantity,
      product: {
        _id: cartItem.product_id._id,
        id: cartItem.product_id._id,
        name: cartItem.product_id.name,
        price: cartItem.product_id.price,
        image_url: cartItem.product_id.image_url,
        stock: cartItem.product_id.stock,
        slug: cartItem.product_id.slug
      }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity: parseInt(quantity) },
      { new: true }
    ).populate('product_id', 'name price image_url stock slug');

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({
      _id: cartItem._id,
      session_id: cartItem.session_id,
      product_id: cartItem.product_id._id,
      quantity: cartItem.quantity,
      product: {
        _id: cartItem.product_id._id,
        id: cartItem.product_id._id,
        name: cartItem.product_id.name,
        price: cartItem.product_id.price,
        image_url: cartItem.product_id.image_url,
        stock: cartItem.product_id.stock,
        slug: cartItem.product_id.slug
      }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE cart item
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CLEAR entire cart for a session
router.delete('/', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    await Cart.deleteMany({ session_id });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;