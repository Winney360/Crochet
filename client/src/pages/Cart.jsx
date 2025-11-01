import { Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();

  // Helper function to fix image URLs
  const getFixedImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg';
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a local upload path, prepend the API base URL
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    // Return as is for other cases
    return imagePath;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-pink-400 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Shopping Cart</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some beautiful crochet items to get started!</p>
            <Link
              to="/shop"
              className="inline-block bg-pink-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-500 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-400 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-xl">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 p-4 font-semibold text-gray-700">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              {cartItems.map((item) => {
                const fixedImageUrl = getFixedImageUrl(item.product?.image_url);
                
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="md:col-span-6 flex items-center gap-4">
                      <img
                        src={fixedImageUrl}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg';
                        }}
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.product?.slug || item.product?._id}`}
                          className="font-semibold text-gray-800 hover:text-pink-400 transition-colors text-lg"
                        >
                          {item.product?.name}
                        </Link>
                        {/* Product details - only show if available */}
                        <div className="mt-1 space-y-1">
                          {item.product?.yarn_type && (
                            <p className="text-sm text-gray-600">Material: {item.product.yarn_type}</p>
                          )}
                          {item.product?.skill_level && (
                            <p className="text-xs text-gray-500">Skill Level: {item.product.skill_level}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 text-center">
                      <span className="text-gray-800 font-semibold text-lg">
                        Ksh. {item.product?.price?.toLocaleString()}
                      </span>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus className="text-sm" />
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <FaPlus className="text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                      <span className="text-pink-400 font-bold text-lg">
                        Ksh. {((item.product?.price || 0) * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="md:ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-600 font-semibold transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>Ksh. {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-pink-400">Ksh. {getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-pink-400 text-white text-center py-3 rounded-lg font-semibold hover:bg-pink-500 transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg">
                <h3 className="font-semibold text-cyan-800 mb-2">📍 Pickup Only</h3>
                <p className="text-sm text-cyan-600">
                  All orders are for pickup at our Juja location
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;