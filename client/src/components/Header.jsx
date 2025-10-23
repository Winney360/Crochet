import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingBag, FaSearch, FaBars, FaTimes, FaUser, FaMapMarkerAlt, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Shop Detail', path: '/shop-detail' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="bg-pink-400 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <p>Free Shipping on all orders over $99</p>
         <div className="flex gap-4 items-center text-white text-sm">
            <a
                href="mailto:nkathawinnie94@gmail.com"
                className="flex items-center gap-1 hover:text-cyan-200 transition-colors"
            >
                <FaEnvelope />
                nkathawinnie94@gmail.com
            </a>

            <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-cyan-200 transition-colors"
            >
                <FaWhatsapp />
                0791995578
            </a>

            <a
                href="https://maps.app.goo.gl/vYRrnad4qeJXgUyKA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-cyan-200 transition-colors"
            >
                <FaMapMarkerAlt />
                Gate B JKUAT, Gachororo road
            </a>
            </div>
        </div>
      </div>

      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-14 h-14 bg-pink-400 rounded-full flex items-center justify-center">
              <span className="text-cyan-400 text-5xl font-bold">S</span>
            </div>
            <span className="text-5xl font-bold text-pink-400">ShikuStitch</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-cyan-500'
                    : 'text-gray-700 hover:text-cyan-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-cyan-400 rounded-full transition-colors border border-cyan-400"
            >
              <FaSearch className="text-pink-400 text-xl " />
            </button>

            <Link
              to="/cart"
              className="relative p-2 hover:bg-cyan-400 rounded-full transition-colors"
            >
              <FaShoppingBag className="text-pink-400 text-2xl" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <button className="p-2 hover:bg-cyan-400 rounded-full  ">
              <FaUser className="text-pink-400 text-2xl" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <FaTimes className="text-gray-700 text-xl" />
              ) : (
                <FaBars className="text-gray-700 text-xl" />
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-pink-400 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
