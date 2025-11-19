import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, FaBars, FaTimes, FaUser, FaMapMarkerAlt, 
  FaEnvelope, FaWhatsapp, FaChevronDown,FaRocket, FaTag
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleUserClick = () => {
    navigate('/admin');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Pink top bar */}
      <div className="bg-pink-400 text-white py-3 rounded-full mx-4 md:mx-20 hidden md:flex">
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
            <div className="w-14 h-14 bg-pink-400 rounded-full flex items-center justify-center ml-4">
              <span className="text-cyan-400 text-5xl font-bold">S</span>
            </div>
            <span className="text-3xl md:text-5xl font-bold text-pink-400">ShikuStitch</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsPagesOpen(!isPagesOpen)}
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        link.dropdownItems.some(item => isActive(item.path))
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

          {/* Desktop Icons */}
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

            <button 
              onClick={handleUserClick}
              className="p-2 hover:bg-cyan-400 rounded-full transition-colors"
            >
              <FaUser className="text-pink-400 text-2xl" />
            </button>
          </div>
{/* Mobile Menu Button */}
<button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="lg:hidden p-3 rounded-2xl bg-linear-to-r from-pink-400 to-cyan-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse"
>
  {isMenuOpen ? (
    <FaTimes className="text-xl animate-spin" />
  ) : (
    <FaBars className="text-xl animate-bounce" />
  )}
</button>
</div>

{/* Mobile Menu Overlay */}
{isMenuOpen && (
  <div className="lg:hidden fixed inset-0 z-50 animate-fadeIn">
    {/* Animated Background */}
    <div className="absolute inset-0 bg-linear-to-br from-pink-100/20 via-cyan-100/20 to-white backdrop-blur-lg animate-gradientShift"></div>
    
    {/* Menu Container */}
    <div className="absolute top-0 right-0 h-full w-80 bg-white/95 shadow-2xl border-l border-pink-200/50 transform transition-all duration-700 animate-slideInRight">
      {/* Header with Curved Bottom */}
      <div className="relative p-6 bg-linear-to-br from-pink-400 via-purple-400 to-cyan-400 text-white rounded-br-3xl shadow-lg animate-pulse-glow">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold drop-shadow-md animate-bounce">🌸 Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300 transform hover:rotate-180 animate-ping-slow"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
        {/* Animated Decorative Dots */}
        <div className="flex gap-1 mt-3">
          <div className="w-2 h-2 rounded-full bg-white/60 animate-ping"></div>
          <div className="w-2 h-2 rounded-full bg-white/40 animate-ping" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 rounded-full bg-white/20 animate-ping" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="h-full overflow-y-auto pb-24 bg-linear-to-b from-white to-pink-50/30 animate-fadeInUp">
        {/* Navigation Links */}
        <div className="p-4 space-y-3">
          {navLinks.map((link, index) => (
            <div 
              key={link.name} 
              className="group animate-fadeInUp"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {link.hasDropdown ? (
                <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-100 hover:border-cyan-200 transition-all duration-500 shadow-sm hover:shadow-md animate-float">
                  <button
                    onClick={() => setIsPagesOpen(!isPagesOpen)}
                    className={`w-full px-4 py-4 rounded-2xl font-semibold transition-all duration-500 flex items-center justify-between group ${
                      link.dropdownItems.some(item => isActive(item.path))
                        ? 'bg-linear-to-r from-pink-400/10 to-cyan-400/10 text-pink-600 border-r-4 border-cyan-400 animate-pulse-slow'
                        : 'text-gray-700 hover:text-pink-500 hover:bg-white/50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {link.icon && <link.icon className="text-lg text-cyan-500 group-hover:scale-110 transition-transform animate-wiggle" />}
                      <span className="bg-linear-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent animate-textShine">
                        {link.name}
                      </span>
                    </span>
                    <FaChevronDown 
                      className={`text-xs transition-all duration-500 animate-bounce ${
                        isPagesOpen ? 'rotate-180 text-cyan-500' : 'text-pink-400 group-hover:text-cyan-400'
                      }`} 
                    />
                  </button>

                  {/* Dropdown Items with Animation */}
                  <div className={`overflow-hidden transition-all duration-700 ${
                    isPagesOpen ? 'max-h-96 opacity-100 animate-slideDown' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="p-3 space-y-2 bg-white/50 rounded-b-2xl">
                      {link.dropdownItems.map((item, itemIndex) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            navigate(item.path);
                            setIsMenuOpen(false);
                            setIsPagesOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-500 flex items-center gap-3 group animate-slideInRight ${
                            isActive(item.path)
                              ? 'bg-linear-to-r from-cyan-400 to-pink-400 text-white shadow-lg transform scale-105 animate-pulse-glow'
                              : 'text-gray-600 hover:bg-white hover:text-cyan-600 hover:translate-x-3 hover:shadow-md'
                          }`}
                          style={{animationDelay: `${itemIndex * 0.05}s`}}
                        >
                          {item.icon && <item.icon className={`text-sm ${isActive(item.path) ? 'text-white' : 'text-pink-400 group-hover:text-cyan-400'} transition-colors animate-spin-slow`} />}
                          <span className="flex-1 animate-typewriter">{item.name}</span>
                          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            isActive(item.path) ? 'bg-white scale-125 animate-ping' : 'bg-cyan-300/0 group-hover:bg-cyan-300'
                          }`}></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold transition-all duration-500 group border border-transparent hover:border-pink-200 animate-float ${
                    isActive(link.path)
                      ? 'bg-linear-to-r from-pink-400/20 to-cyan-400/20 text-pink-600 shadow-inner border-r-4 border-cyan-400 animate-pulse-slow'
                      : 'text-gray-700 hover:bg-white/80 hover:shadow-md'
                  }`}
                >
                  {link.icon && <link.icon className="text-lg text-cyan-500 group-hover:scale-110 transition-transform animate-wiggle" />}
                  <span className="bg-linear-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent animate-textShine">
                    {link.name}
                  </span>
                  <div className="ml-auto w-1 h-6 bg-linear-to-b from-pink-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Animated Separator */}
        <div className="px-4 my-6 animate-fadeIn" style={{animationDelay: '0.6s'}}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-200/50 animate-expandWidth"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-cyan-400 animate-spin">✨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Section with Curved Top */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-pink-100 rounded-t-3xl shadow-2xl p-4 animate-slideUp">
        {/* Cart & Account Buttons */}
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* Cart Button */}
          <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="flex-1 flex items-center gap-3 px-4 py-3 bg-linear-to-r from-pink-400 to-cyan-400 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 group animate-pulse-glow"
          >
            <div className="relative">
              <FaShoppingBag className="text-xl group-hover:rotate-12 transition-transform animate-bounce" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-pink-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-ping">
                  {getCartCount()}
                </span>
              )}
            </div>
            <span className="font-semibold animate-pulse">Cart</span>
          </Link>

          {/* Account Button */}
          <Link
            to="/admin"
            onClick={() => setIsMenuOpen(false)}
            className="flex-1 flex items-center gap-3 px-4 py-3 bg-linear-to-r from-cyan-50 to-pink-50 text-gray-700 rounded-2xl border border-cyan-200 hover:border-cyan-300 shadow-sm hover:shadow-md transition-all duration-500 transform hover:scale-105 group animate-float"
          >
            <FaUser className="text-xl text-cyan-400 group-hover:scale-110 transition-transform animate-wiggle" />
            <span className="font-semibold">Account</span>
          </Link>
        </div>

        {/* Contact Info with Sparkle */}
        <div className="text-center bg-linear-to-r from-pink-50 to-cyan-50 rounded-2xl p-3 border border-pink-100/50 animate-pulse-slow">
          <p className="text-xs text-gray-600">
            Need help? <span className="font-semibold bg-linear-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent animate-textShine">Contact Us ✨</span>
          </p>
        </div>
      </div>
    </div>
  </div>
)}
      </nav>
    </header>
  );
};

export default Header;
