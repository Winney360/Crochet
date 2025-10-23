import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = location.state?.orderNumber;

  if (!orderNumber) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-12 text-center">
          <FaCheckCircle className="text-6xl text-cyan-500 mx-auto mb-6" />

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            Thank you for your purchase
          </p>

          <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Your order number is</p>
            <p className="text-2xl font-bold text-cyan-500">{orderNumber}</p>
          </div>

          <p className="text-gray-600 mb-8">
            We've sent a confirmation email with order details. You can track your order status anytime.
          </p>

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
