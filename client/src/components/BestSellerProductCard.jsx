import { FaStar, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const BestsellerProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  // Add scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    await addToCart(product._id, 1);
  };

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Use images array if available, otherwise fallback to image_url
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url || 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'];

  // Auto-slide only if there are multiple images
  useEffect(() => {
    if (images.length <= 1) return; // No sliding for single images
    
    const startSliding = () => {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000); // Change image every 3 seconds
    };

    const stopSliding = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!isHovering) {
      startSliding();
    } else {
      stopSliding();
    }

    // Cleanup on unmount
    return () => stopSliding();
  }, [images.length, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <Link 
      to={`/product/${product.slug}`} 
      className="group"
      onClick={scrollToTop} // ADDED: Scroll to top when link is clicked
    >
      <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow flex h-60">
        {/* Left Side - Round Image */}
        <div className="relative shrink-0 w-48 h-48 m-4 mt-10">
          <div 
            className="relative w-full h-full rounded-full overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Round Image */}
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-500"
            />

            {/* Image Navigation Dots (if multiple images) */}
            {images.length > 1 && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}                      
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* Product Name */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4 group-hover:text-cyan-500 transition-colors">
              {product.name}
            </h3>

            {/* Rating Section */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                ({product.rating || 0})
              </span>
            </div>

            {/* Price Section */}
            <div className="mb-3">
              <span className="text-xl font-bold text-cyan-500">
                Ksh. {product.price}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2  text-pink-500 hover:bg-cyan-400 border border-cyan-400 transition-all duration-300 rounded-full py-2 px-4 font-semibold text-sm w-full mt-auto"
          >
            <FaShoppingBag className="text-lg" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BestsellerProductCard;