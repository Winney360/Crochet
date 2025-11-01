import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Add useNavigate
import { FaShoppingBag, FaBars, FaTimes, FaUser, FaMapMarkerAlt, FaEnvelope, FaWhatsapp, FaChevronDown } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook
  const { getCartCount } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Shop Detail', path: '/shop-detail' },
    { name: 'Contact', path: '/contact' },
    { 
      name: 'Pages', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'About Us', path: '/about' },
        { name: 'FAQs', path: '/faqs' }
      ]
    },
  ];

  const isActive = (path) => location.pathname === path;

  // Add this function to handle user icon click
  const handleUserClick = () => {
    navigate('/admin'); // Navigate to admin dashboard
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Pink top bar - hidden on mobile, visible on medium screens and up */}
      <div className="bg-pink-400 text-white py-3 rounded-full mr-4 ml-4 md:mr-20 md:ml-20 hidden md:flex">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <p>⭐ 5-Star Rated by Customers</p>
          <div className="flex gap-6 items-center text-white text-sm">
            <a
              href="mailto:shikukucrochet@gmail.com"
              className="flex items-center gap-1 hover:text-cyan-200 transition-colors"
            >
              <FaEnvelope />
             shikukucrochet@gmail.com
            </a>

            <a
              href="https://wa.me/254791995578"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-cyan-200 transition-colors"
            >
              <FaWhatsapp />
              0791995578
            </a>

            <a
              href="https://www.google.com/maps?q=-1.0961958292920777,37.01854679622558"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-cyan-200 transition-colors"
            >
              <FaMapMarkerAlt />
              <span>Gate B JKUAT, Gachororo Road, Juja, Kenya</span>
            </a>
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-14 h-14 bg-pink-400 rounded-full flex items-center justify-center ml-4 md:ml-15">
              <span className="text-cyan-400 text-5xl font-bold">S</span>
            </div>
            <span className="text-3xl md:text-5xl font-bold text-pink-400">ShikuStitch</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsPagesOpen(!isPagesOpen)}
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        isActive(link.path) || link.dropdownItems.some(item => isActive(item.path))
                          ? 'text-cyan-500'
                          : 'text-gray-700 hover:text-cyan-500'
                      }`}
                    >
                      {link.name}
                      <FaChevronDown className={`text-xs transition-transform ${isPagesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isPagesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-400 transition-colors"
                            onClick={() => setIsPagesOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`font-medium transition-colors ${
                      isActive(link.path)
                        ? 'text-cyan-500'
                        : 'text-gray-700 hover:text-cyan-500'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Icons - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-8">
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

            {/* Updated User Icon with click handler */}
            <button 
              onClick={handleUserClick} // Add click handler
              className="p-2 hover:bg-cyan-400 rounded-full transition-colors"
            >
              <FaUser className="text-pink-400 text-2xl" />
            </button>
          </div>

          {/* Mobile menu button - always visible on mobile */}
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

        {/* Close dropdown when clicking outside */}
        {isPagesOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsPagesOpen(false)}
          />
        )}

        {/* Mobile Menu - includes navigation links AND icons */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            {/* Navigation Links */}
            <div className="flex flex-col gap-2 mb-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <div className="flex flex-col">
                      <button
                        onClick={() => setIsPagesOpen(!isPagesOpen)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors text-left flex items-center justify-between ${
                          isActive(link.path) || link.dropdownItems.some(item => isActive(item.path))
                            ? 'bg-pink-400 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {link.name}
                        <FaChevronDown className={`text-xs transition-transform ${isPagesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isPagesOpen && (
                        <div className="ml-4 mt-2 flex flex-col gap-1">
                          {link.dropdownItems.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsPagesOpen(false);
                              }}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                isActive(item.path)
                                  ? 'bg-cyan-400 text-white'
                                  : 'text-gray-700 hover:bg-cyan-50'
                              }`}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
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
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Icons - shown in menu */}
            <div className="flex items-center gap-6 border-t pt-4">
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-cyan-500 transition-colors"
              >
                <div className="relative">
                  <FaShoppingBag className="text-2xl" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </div>
                <span>Cart ({getCartCount()})</span>
              </Link>

              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-pink-400 hover:text-cyan-400 transition-colors"
              >
                <FaUser className="text-2xl" />
                <span>Admin Account</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;