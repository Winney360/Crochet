import { Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              to="/shop"
              className="inline-block bg-pink-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
          <p className="text-xl">{cartItems.length} items in your cart</p>
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

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b items-center"
                >
                  <div className="md:col-span-6 flex items-center gap-4">
                    <img
                      src={item.products?.image_url || 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'}
                      alt={item.products?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <Link
                        to={`/product/${item.products?.id}`}
                        className="font-semibold text-gray-800 hover:text-cyan-500"
                      >
                        {item.products?.name}
                      </Link>
                      <p className="text-sm text-gray-600">Fresh Organic</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center">
                    <span className="text-gray-800 font-semibold">
                      ${item.products?.price}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="w-12 text-center font-semibold">
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
                    <span className="text-cyan-500 font-bold text-lg">
                      ${(item.products?.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="md:ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Link
                to="/shop"
                className="text-cyan-500 hover:text-green-700 font-semibold"
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
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-cyan-500">Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-cyan-500">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-pink-400 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-800">Special Offer</h3>
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $99!
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
