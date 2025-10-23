import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useState } from 'react';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (error) throw error;

      setMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('This email is already subscribed or invalid.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">F</span>
              </div>
              <span className="text-2xl font-bold text-green-400">Fruitables</span>
            </div>
            <p className="text-gray-400 mb-4">
              Fresh Exotic Fruits
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-green-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-green-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  My Account
                </a>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-green-400 transition-colors">
                  Shop Details
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-green-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Wishlist
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter and get 10% off your first purchase
            </p>
            <form onSubmit={handleSubscribe}>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-600"
                  required
                />
                <button
                  type="submit"
                  className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              {message && (
                <p className="mt-2 text-sm text-green-400">{message}</p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Fruitables. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
