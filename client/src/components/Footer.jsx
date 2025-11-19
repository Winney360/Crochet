import { Link } from 'react-router-dom';
import { FaWhatsapp, FaPhoneAlt, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage('Newsletter feature removed');
    setTimeout(() => setMessage(''), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handlePhoneClick = () => {
    window.open('tel:+254720951221');
  };

  const handleWhatsAppClick = () => {
    const message = "Hello! I'm interested in your crochet products. Can you help me?";
    const whatsappUrl = `https://wa.me/254791995578?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* First Part - Brand with Phone, WhatsApp */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">🎀</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  Crochet Creation
                </span>
                <p className="text-pink-200 text-sm mt-1">Handmade with Love</p>
              </div>
            </div>
            <p className="text-cyan-100 mb-6 leading-relaxed">
              Creating beautiful, handmade crochet pieces with passion and care for every stitch.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handlePhoneClick}
                className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-full flex items-center justify-center hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:scale-110 cursor-pointer"
                title="Call +254 720 951 221"
              >
                <FaPhoneAlt />
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:scale-110 cursor-pointer"
                title="Chat on WhatsApp +254 791 995 578"
              >
                <FaWhatsapp />
              </button>
            </div>
          </div>

          {/* Second Part - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-cyan-300 border-b border-cyan-500/30 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['Home', 'Shop', 'Contact', 'Shopping Cart'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item === 'Home' ? '' : item.toLowerCase().replace(' ', '-')}`}
                    onClick={scrollToTop}
                    className="text-cyan-100 hover:text-pink-300 transition-all duration-300 hover:translate-x-2 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Third Part - Shop Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-cyan-300 border-b border-cyan-500/30 pb-2">
              Shop Info
            </h3>
            <ul className="space-y-3">
              {['About Us', 'FAQs', 'Shipping Info', 'Return Policy'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    onClick={scrollToTop}
                    className="text-cyan-100 hover:text-pink-300 transition-all duration-300 hover:translate-x-2 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fourth Part - Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-cyan-300 border-b border-cyan-500/30 pb-2">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={handlePhoneClick}>
                <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-full flex items-center justify-center group-hover:bg-cyan-500/30 group-hover:scale-110 transition-all">
                  <FaPhoneAlt className="text-sm" />
                </div>
                <div>
                  <p className="text-cyan-100 text-sm">Call Us</p>
                  <p className="text-white font-medium">+254 720 951 221</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 group cursor-pointer" onClick={handleWhatsAppClick}>
                <div className="w-10 h-10 bg-green-500/20 border border-green-400/50 text-green-300 rounded-full flex items-center justify-center group-hover:bg-green-500/30 group-hover:scale-110 transition-all">
                  <FaWhatsapp className="text-sm" />
                </div>
                <div>
                  <p className="text-cyan-100 text-sm">WhatsApp</p>
                  <p className="text-white font-medium">+254 791 995 578</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-pink-500/20 border border-pink-400/50 text-pink-300 rounded-full flex items-center justify-center group-hover:bg-pink-500/30 group-hover:scale-110 transition-all mt-1">
                  <span className="text-xs font-bold">@</span>
                </div>
                <div>
                  <p className="text-cyan-100 text-sm">Email</p>
                  <p className="text-white font-medium">shikukucrochet@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-cyan-500/30 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cyan-200 text-sm mb-4 md:mb-0">
              © 2025 <span className="text-pink-300 font-semibold">ShikuStitch Crochet</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-pink-300">
              <span>Made with</span>
              <FaHeart className="text-pink-400 animate-pulse" />
              <span>for the crochet community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;