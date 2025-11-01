// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { hardcodedProducts } from '../data/hardcodedProducts';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Get or create session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  // Load cart from localStorage on initial render
  useEffect(() => {
    const initializeCart = async () => {
      try {
        setLoading(true);
        
        // Load hardcoded items from localStorage immediately
        const savedCart = localStorage.getItem('hardcoded_cart');
        const hardcodedItems = savedCart ? JSON.parse(savedCart) : [];
        
        // Set hardcoded items immediately for better UX
        setCartItems(hardcodedItems);
        
        // Then fetch backend items
        await fetchBackendCart();
        
      } catch (error) {
        console.error('Error initializing cart:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeCart();
  }, []);

  // Save hardcoded cart items to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      const hardcodedItems = cartItems.filter(item => item.isHardcoded);
      if (hardcodedItems.length > 0) {
        localStorage.setItem('hardcoded_cart', JSON.stringify(hardcodedItems));
      } else {
        localStorage.removeItem('hardcoded_cart');
      }
    }
  }, [cartItems, initialized]);

  // SIMPLIFIED: Find product - use existing endpoints
  const findProduct = async (productId) => {
    console.log('🔍 Finding product:', productId);
    
    // First check hardcoded products
    const hardcodedProduct = hardcodedProducts.find(p => p._id === productId);
    if (hardcodedProduct) {
      console.log('✅ Found in hardcoded products');
      return hardcodedProduct;
    }

    // If not found in hardcoded, check backend using existing endpoints
    try {
      console.log('🔄 Checking backend for product:', productId);
      // Try by ID first (your existing endpoint)
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      console.log('✅ Found in backend via ID endpoint');
      return response.data;
    } catch (idError) {
      console.log('❌ Not found by ID, trying slug endpoint...');
      
      // If ID endpoint fails, it might be a slug - try slug endpoint
      try {
        const slugResponse = await axios.get(`${API_BASE_URL}/products/slug/${productId}`);
        console.log('✅ Found in backend via slug endpoint');
        return slugResponse.data;
      } catch (slugError) {
        console.log('❌ Product not found in backend:', productId);
        return null;
      }
    }
  };

  // SIMPLIFIED: Add item to cart - Frontend only for now
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      
      console.log('🛒 Adding to cart - Product ID:', productId, 'Quantity:', quantity);

      // Find the product
      const product = await findProduct(productId);
      if (!product) {
        console.error('❌ Product not found:', productId);
        throw new Error('Product not found');
      }

      console.log('✅ Product found:', product.name);

      // Check if product is hardcoded or from API
      const isHardcoded = hardcodedProducts.some(p => p._id === productId);
      
      setCartItems(prev => {
        const existingItem = prev.find(item => 
          item.productId === productId && item.isHardcoded === isHardcoded
        );
        
        if (existingItem) {
          // Update quantity if item exists
          console.log('📈 Updating existing item quantity');
          return prev.map(item =>
            item.productId === productId && item.isHardcoded === isHardcoded
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          console.log('➕ Adding new item to cart');
          const newItem = {
            id: Date.now().toString(), // Unique ID for cart item
            productId: productId,
            quantity: quantity,
            isHardcoded: isHardcoded,
            product: product, // Store product data directly
            addedAt: new Date().toISOString()
          };
          return [...prev, newItem];
        }
      });
      
      console.log('✅ Successfully added to cart');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // SIMPLIFIED: Remove backend cart integration for now
  const fetchBackendCart = async () => {
    console.log('🔄 Skipping backend cart fetch - using frontend only');
    // We'll implement this later once basic cart works
  };

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    try {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Get product data for cart items
  const getCartItemsWithProducts = () => {
    return cartItems.map(cartItem => {
      // If we already have product data stored, use it
      if (cartItem.product) {
        return cartItem;
      }
      
      // Otherwise, find the product
      let product;
      if (cartItem.isHardcoded) {
        product = hardcodedProducts.find(p => p._id === cartItem.productId);
      }
      
      return {
        ...cartItem,
        product: product || {
          name: 'Product not found',
          price: 0,
          image_url: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
          slug: 'not-found'
        }
      };
    });
  };

  const getCartTotal = () => {
    const itemsWithProducts = getCartItemsWithProducts();
    return itemsWithProducts.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      localStorage.removeItem('hardcoded_cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cartItems: getCartItemsWithProducts(),
    loading,
    initialized,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    refreshCart: fetchBackendCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};