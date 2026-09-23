import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    orderNumber,
    customerName,
    total,
    pickupLocation,
    paymentMethod,
    paymentStatus,
    mpesaReceipt
  } = location.state || {};

  useEffect(() => {
    if (!orderNumber) {
      navigate('/', { replace: true });
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) {
    return null;
  }

  const isMpesaPaid = paymentMethod === 'mpesa' && paymentStatus === 'completed';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-12 text-center">
          <FaCheckCircle className="text-6xl text-cyan-500 mx-auto mb-6" />

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {isMpesaPaid ? 'Payment Received!' : 'Order Placed Successfully!'}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {customerName ? `Thank you${customerName ? `, ${customerName}` : ''}` : 'Thank you for your purchase'}
          </p>

          <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Your order number is</p>
            <p className="text-2xl font-bold text-cyan-500">{orderNumber}</p>
          </div>

          {isMpesaPaid ? (
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-8 text-left">
              <p className="text-cyan-800">
                <strong>Payment confirmed:</strong> We received your M-Pesa payment of{' '}
                <strong>Ksh. {Number(total || 0).toFixed(2)}</strong>.
              </p>
              {mpesaReceipt && (
                <p className="text-cyan-700 text-sm mt-2">
                  M-Pesa Receipt: <strong>{mpesaReceipt}</strong>
                </p>
              )}
              <p className="text-cyan-700 text-sm mt-2">
                We will contact you within 24 hours to confirm pickup{pickupLocation ? ` at ${pickupLocation}` : ''}.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
              <p className="text-yellow-800">
                <strong>Order sent:</strong> We received your order via WhatsApp.
              </p>
              <p className="text-yellow-700 text-sm mt-2">
                You will pay <strong>Ksh. {Number(total || 0).toFixed(2)}</strong> when you pick up. We will
                contact you within 24 hours to confirm{pickupLocation ? ` at ${pickupLocation}` : ''}.
              </p>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;