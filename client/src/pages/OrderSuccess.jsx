import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [verifying, setVerifying] = useState(false);
  const [paystackResult, setPaystackResult] = useState(null);
  const [verifyError, setVerifyError] = useState('');

  const clearCartRef = useRef(clearCart);
  clearCartRef.current = clearCart;

  const state = location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const paystackReference = searchParams.get('reference') || searchParams.get('trxref');
  const isPaystackFlow = Boolean(paystackReference) && !state.orderNumber;

  useEffect(() => {
    if (!state.orderNumber && !paystackReference) {
      navigate('/', { replace: true });
      return;
    }

    if (!isPaystackFlow) return;

    let cancelled = false;

    const saveOrderLocal = (order) => {
      const savedOrder = {
        orderNumber: order.order_number,
        items: order.items,
        total: order.total,
        paymentMethod: 'Paystack (paid online)',
        paymentStatus: 'completed',
        paystackReference,
        orderDate: new Date().toISOString()
      };
      const existingOrders = JSON.parse(localStorage.getItem('shikustitch_orders') || '[]');
      localStorage.setItem('shikustitch_orders', JSON.stringify([...existingOrders, savedOrder]));
    };

    const verifyPayment = async () => {
      setVerifying(true);
      try {
        const res = await api.post('/paystack/verify', { reference: paystackReference }, { timeout: 20000 });
        const data = res.data;
        if (cancelled) return;

        if (data.status === 'completed' && data.order) {
          saveOrderLocal(data.order);
          await clearCartRef.current();
          setPaystackResult({ status: 'completed', order: data.order, reference: data.paystackReference });
        } else if (data.status === 'failed') {
          setPaystackResult({ status: 'failed' });
        } else {
          setPaystackResult({ status: 'pending' });
        }
      } catch (error) {
        console.error('Paystack verify error:', error);
        setVerifyError(error.response?.data?.message || 'We could not confirm your payment yet.');
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };

    verifyPayment();
    return () => {
      cancelled = true;
    };
  }, [state.orderNumber, paystackReference, isPaystackFlow, navigate]);

  const {
    orderNumber,
    customerName,
    total,
    pickupLocation
  } = state;

  if (!state.orderNumber && !paystackReference) {
    return null;
  }

  const displayOrderNumber = paystackResult?.order?.order_number || orderNumber;
  const displayTotal = paystackResult?.order?.total || Number(total || 0);
  const displayPickup = paystackResult?.order?.customer?.pickup_location || pickupLocation;
  const customerFullName = paystackResult?.order?.customer?.full_name || customerName;
  const isPaystackCompleted = isPaystackFlow && paystackResult?.status === 'completed';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-12 text-center">

          {isPaystackFlow && verifying ? (
            <>
              <FaSpinner className="text-6xl text-cyan-500 mx-auto mb-6 animate-spin" />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Confirming Payment...</h1>
              <p className="text-xl text-gray-600 mb-6">
                Verifying your Paystack payment of{' '}
                <strong>Ksh. {Number(displayTotal || 0).toFixed(2)}</strong>. This takes a few seconds.
              </p>
            </>
          ) : isPaystackCompleted ? (
            <>
              <FaCheckCircle className="text-6xl text-cyan-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Received!</h1>
              <p className="text-xl text-gray-600 mb-6">
                Thank you{customerFullName ? `, ${customerFullName}` : ''}
              </p>

              <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">Your order number is</p>
                <p className="text-2xl font-bold text-cyan-500">{displayOrderNumber}</p>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-8 text-left">
                <p className="text-cyan-800">
                  <strong>Payment confirmed:</strong> We received your Paystack payment of{' '}
                  <strong>Ksh. {Number(displayTotal || 0).toFixed(2)}</strong>.
                </p>
                {paystackResult.reference && (
                  <p className="text-cyan-700 text-sm mt-2">
                    Paystack Reference: <strong>{paystackResult.reference}</strong>
                  </p>
                )}
                <p className="text-cyan-700 text-sm mt-2">
                  We will contact you within 24 hours to confirm pickup{displayPickup ? ` at ${displayPickup}` : ''}.
                </p>
              </div>
            </>
          ) : isPaystackFlow && paystackResult?.status === 'failed' ? (
            <>
              <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Not Completed</h1>
              <p className="text-xl text-gray-600 mb-6">
                Your payment was not completed. No money has been charged.
              </p>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-pink-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Back to Checkout
              </button>
            </>
          ) : isPaystackFlow && paystackResult?.status === 'pending' ? (
            <>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">We're Still Checking...</h1>
              <p className="text-xl text-gray-600 mb-6">
                We could not confirm your payment yet. Check your email for the Paystack receipt or try again from the
                checkout page.
              </p>
              {verifyError && (
                <p className="text-red-500 mb-6">{verifyError}</p>
              )}
              <button
                onClick={() => navigate('/checkout')}
                className="bg-pink-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Back to Checkout
              </button>
            </>
          ) : (
            <>
              <FaCheckCircle className="text-6xl text-cyan-500 mx-auto mb-6" />

              <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>

              <p className="text-xl text-gray-600 mb-6">
                {customerName ? `Thank you, ${customerName}` : 'Thank you for your purchase'}
              </p>

              <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">Your order number is</p>
                <p className="text-2xl font-bold text-cyan-500">{displayOrderNumber}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
                <p className="text-yellow-800">
                  <strong>Order sent:</strong> We received your order via WhatsApp.
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  You will pay <strong>Ksh. {Number(displayTotal || 0).toFixed(2)}</strong> when you pick up. We will
                  contact you within 24 hours to confirm{displayPickup ? ` at ${displayPickup}` : ''}.
                </p>
              </div>
            </>
          )}

          {!isPaystackFlow && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/shop')}
                className="bg-pink-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/')}
                className="border-2 border-green-600 text-cyan-500 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Go to Home
              </button>
            </div>
          )}

          {isPaystackCompleted && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/shop')}
                className="bg-pink-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/')}
                className="border-2 border-green-600 text-cyan-500 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Go to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;