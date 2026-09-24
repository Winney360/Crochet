import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paystack');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    pickupLocation: 'JKUAT Gate B (kindly check the map)',
    notes: ''
  });

  const pickupLocations = [
    'JKUAT Gate B (kindly check the map)',
    'Other location in Juja (specify in notes)'
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'cancelled') {
      addToast('Payment was cancelled. You can try again.', 'warning');
    }
  }, [location.search, addToast]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveOrderLocal = (orderNumber, paymentMethodLabel) => {
    const order = {
      orderNumber,
      ...formData,
      items: cartItems,
      total: getCartTotal(),
      paymentMethod: paymentMethodLabel,
      orderDate: new Date().toISOString()
    };
    const existingOrders = JSON.parse(localStorage.getItem('shikustitch_orders') || '[]');
    localStorage.setItem('shikustitch_orders', JSON.stringify([...existingOrders, order]));
  };

  const navigateToSuccess = (orderNumber, extras = {}) => {
    navigate('/order-success', {
      state: {
        orderNumber,
        customerName: formData.fullName,
        total: getCartTotal(),
        pickupLocation: formData.pickupLocation,
        ...extras
      }
    });
  };

  const handlePaystackSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.email) {
      addToast('❌ Please enter your email for the payment receipt.', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/paystack/initialize', {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        pickupLocation: formData.pickupLocation,
        notes: formData.notes,
        items: cartItems.map(i => ({
          productId: i.productId || i.product?._id,
          name: i.product?.name,
          price: i.product?.price,
          quantity: i.quantity
        })),
        total: getCartTotal(),
        callbackUrl: `${window.location.origin}/order-success`,
        cancelUrl: `${window.location.origin}/checkout?payment=cancelled`
      }, { timeout: 20000 });

      const { authorizationUrl } = res.data;
      if (!authorizationUrl) {
        throw new Error('No authorization URL returned');
      }

      window.location.href = authorizationUrl;
    } catch (error) {
      console.error('Paystack init error:', error);
      setLoading(false);
      const message = error.response?.data?.message || 'Could not start Paystack payment. Please try again.';
      addToast(`❌ ${message}`, 'error');
    }
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderNumber = 'SHIKU-' + Date.now();

      const whatsappMessage = `
🛍️ *NEW CROCHET ORDER - ShikuStitch*

*Order Number:* ${orderNumber}
*Customer:* ${formData.fullName}
*Phone:* ${formData.phone}
${formData.email ? `*Email:* ${formData.email}` : ''}
*Pickup Location:* ${formData.pickupLocation}
${formData.notes ? `*Notes:* ${formData.notes}` : ''}

*ITEMS ORDERED:*
${cartItems.map(item =>
  `• ${item.product?.name} x ${item.quantity} = Ksh. ${(item.product?.price * item.quantity).toFixed(2)}`
).join('\n')}

*TOTAL: Ksh. ${getCartTotal().toFixed(2)}*

_Order Date: ${new Date().toLocaleDateString('en-KE', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}_
      `.trim();

      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/254791995578?text=${encodedMessage}`, '_blank');

      saveOrderLocal(orderNumber, 'WhatsApp (pay on pickup)');

      api.post('/orders', {
        orderNumber,
        customer: {
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email || '',
          pickup_location: formData.pickupLocation,
          notes: formData.notes
        },
        items: cartItems.map(i => ({
          product_id: i.productId || i.product?._id,
          name: i.product?.name,
          price: i.product?.price,
          quantity: i.quantity
        })),
        total: getCartTotal()
      }).catch(err => {
        console.error('Error saving WhatsApp order:', err);
        addToast('⚠️ Order sent, but we could not log it online. Keep your order number.', 'warning');
      });

      clearCart();
      addToast('✅ Order sent to WhatsApp! We will contact you to confirm pickup.', 'success');
      navigateToSuccess(orderNumber, {
        paymentMethod: 'whatsapp',
        paymentStatus: 'pending'
      });

    } catch (error) {
      console.error('Error creating order:', error);
      addToast('❌ Failed to send order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'paystack') {
      handlePaystackSubmit(e);
    } else {
      handleWhatsAppSubmit(e);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/shop')}
            className="bg-pink-400 text-white px-6 py-3 rounded-lg hover:bg-pink-500 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-400 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Order Checkout</h1>
          <p className="text-xl">Pickup Only - Juja, Kenya</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Pickup Information</h2>

                {/* Important Notice */}
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-yellow-600 text-lg mr-2">📍</span>
                    <div>
                      <h3 className="font-semibold text-yellow-800">Pickup Only</h3>
                      <p className="text-yellow-700 text-sm mt-1">
                        All orders are for pickup only. We do not offer delivery services.
                        You will collect your items from our location in Juja.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 0712 345 678"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        This is how we will contact you about your order.
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email {paymentMethod === 'paystack' ? '*' : '(Optional)'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required={paymentMethod === 'paystack'}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                      {paymentMethod === 'paystack' && (
                        <p className="text-sm text-gray-500 mt-2">
                          Your payment receipt will be sent to this email.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Preferred Pickup Location *
                    </label>
                    <select
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                      {pickupLocations.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      You are encouraged to pick up at our physical shop location. We'll provide exact details after order confirmation.
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Preferred pickup times, or any special requests..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                </div>

                {/* Pickup Process Info */}
                <div className="mt-8 bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyan-800 mb-3">📦 How Pickup Works</h3>
                  <ol className="text-sm text-cyan-700 space-y-2">
                    <li>1. Place your order with pickup location</li>
                    <li>2. Pay online via Paystack or choose to pay when you pick up</li>
                    <li>3. We'll contact you within 24 hours to confirm</li>
                    <li>4. Collect your beautiful crochet creations! 🧶</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id || item._id} className="flex justify-between text-sm border-b pb-3">
                      <div>
                        <span className="font-semibold text-gray-800 block">
                          {item.product?.name}
                        </span>
                        <span className="text-gray-600 text-xs">
                          Qty: {item.quantity}
                        </span>
                        {item.product?.yarn_type && (
                          <span className="text-gray-500 text-xs block">
                            Yarn: {item.product.yarn_type}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-pink-400">
                        Ksh. {(item.product?.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Ksh. {getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span className="text-pink-400">Ksh. {getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Payment Method</h3>
                  <div className="space-y-3">
                    <label className={`flex items-start gap-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'paystack' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paystack"
                        checked={paymentMethod === 'paystack'}
                        onChange={() => setPaymentMethod('paystack')}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-semibold text-gray-800 block">Paystack (Pay Online)</span>
                        <span className="text-sm text-gray-600">Secure card or M-Pesa checkout</span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'whatsapp' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={paymentMethod === 'whatsapp'}
                        onChange={() => setPaymentMethod('whatsapp')}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-semibold text-gray-800 block">WhatsApp Order</span>
                        <span className="text-sm text-gray-600">Send order, pay when you pick up</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-400 text-white py-3 rounded-lg font-semibold hover:bg-pink-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {paymentMethod === 'paystack' ? 'Redirecting to Paystack...' : 'Sending to WhatsApp...'}
                    </div>
                  ) : (
                    paymentMethod === 'paystack' ? 'Pay with Paystack' : 'Send Order via WhatsApp'
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    {paymentMethod === 'paystack'
                      ? '🔒 You will be redirected to Paystack to complete your payment securely'
                      : '💰 Pay online or when you pick up'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📞 We'll contact you within 24 hours
                  </p>
                  <p className="text-xs text-pink-500 font-semibold mt-1">
                    📍 Pickup only - No delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;