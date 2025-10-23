import { createContext, useContext, useState, useEffect } from 'react';
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

  // Use your backend URL directly
  const API_BASE_URL = 'http://localhost:5000/api';

  // Get or create session ID for guest users
  const getSessionId = () => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  // Fetch cart items from MongoDB
  const fetchCartItems = async () => {
    try {
      const sessionId = getSessionId();
      const response = await axios.get(`${API_BASE_URL}/cart?session_id=${sessionId}`);
      
      // Debug log to see what we're getting
      console.log('Cart API Response:', response.data);
      
      // Ensure we always have an array
      const items = Array.isArray(response.data) ? response.data : [];
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const sessionId = getSessionId();
      
      const response = await axios.post(`${API_BASE_URL}/cart`, {
        session_id: sessionId,
        product_id: productId,
        quantity: quantity
      });

      await fetchCartItems(); // Refresh cart
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      await axios.put(`${API_BASE_URL}/cart/${itemId}`, {
        quantity: quantity
      });

      await fetchCartItems(); // Refresh cart
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/${itemId}`);
      await fetchCartItems(); // Refresh cart
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const sessionId = getSessionId();
      await axios.delete(`${API_BASE_URL}/cart?session_id=${sessionId}`);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Calculate cart total - WITH SAFETY CHECKS
  const getCartTotal = () => {
    if (!Array.isArray(cartItems)) {
      console.warn('cartItems is not an array:', cartItems);
      return 0;
    }
    
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Get total number of items in cart - WITH SAFETY CHECKS
  const getCartCount = () => {
    if (!Array.isArray(cartItems)) {
      console.warn('cartItems is not an array:', cartItems);
      return 0;
    }
    
    return cartItems.reduce((count, item) => {
      return count + (item.quantity || 0);
    }, 0);
  };

  const value = {
    cartItems: Array.isArray(cartItems) ? cartItems : [], // Ensure it's always an array
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    refreshCart: fetchCartItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};