import { Link } from 'react-router-dom';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    // Remove newsletter functionality since you don't want it
    setMessage('Newsletter feature removed');
    setTimeout(() => setMessage(''), 3000);
  };

  // Scroll to top function for all navigation
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // Phone number functionality
  const handlePhoneClick = () => {
    window.open('tel:+254720951221');
  };

  // WhatsApp functionality
  const handleWhatsAppClick = () => {
    // You can customize the message that appears when they click WhatsApp
    const message = "Hello! I'm interested in your crochet products. Can you help me?";
    const whatsappUrl = `https://wa.me/254791995578?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-[#4c0d4761] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* First Part - Brand with Phone, WhatsApp */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <span className="text-2xl font-bold text-cyan-400">Crochet Creation</span>
            </div>
            <p className="text-gray-200 mb-4">
              Handmade with Love & Care
            </p>
            <div className="flex gap-3">
              <button
                onClick={handlePhoneClick}
                className="w-10 h-10 border text-bold border-cyan-400 text-cyan-400 rounded-full flex items-center justify-center hover:bg-cyan-400 hover:text-white transition-colors cursor-pointer"
                title="Call +254 720 951 221"
              >
                <FaPhoneAlt />
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="w-10 h-10 border text-bold border-cyan-400 text-cyan-400 rounded-full flex items-center justify-center hover:bg-cyan-400 hover:text-white transition-colors cursor-pointer"
                title="Chat on WhatsApp +254 791 995 578"
              >
                <FaWhatsapp />
              </button>
            </div>
          </div>

          {/* Second Part - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-cyan-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-cyan-400 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-cyan-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-cyan-400 transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Third Part - Shop Info (replaced Account) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop Info</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-cyan-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/faqs" 
                  onClick={scrollToTop}
                  className="text-gray-200 hover:text-cyan-400 transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Fourth Part - Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 text-bold border border-cyan-400 text-cyan-400 rounded-full flex items-center justify-center">
                  <FaPhoneAlt className="text-sm" />
                </div>
                <span className="text-gray-200">+254 720 951 221</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 text-bold border border-cyan-400 text-cyan-400 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-sm" />
                </div>
                <span className="text-gray-200">+254 791 995 578</span>
              </div>
              
              <div className="flex items-start gap-3 mt-2">
                <div className="w-8 h-8 text-bold border border-cyan-400 text-cyan-400 rounded-full flex items-center justify-center mt-1">
                  <span className="text-xs font-bold">@</span>
                </div>
                <span className="text-gray-200">shikukucrochet@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-cyan-400 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-200 text-sm">
              © 2025 <span className="text-pink-400"> ShikuStitch Crochet.</span> All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;