import { FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

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
    <Link to={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <div 
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Image with Smooth Transition */}
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full h-64 object-cover transition-opacity duration-500"
          />

          {/* Image Navigation Dots (if multiple images) */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{discount}%
            </div>
          )}

          {/* Featured Badge */}
          {product.is_featured && (
            <div className="absolute top-4 right-4 bg-pink-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}

          {/* Multiple Images Indicator */}
          {images.length > 1 && (
            <div className="absolute top-12 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {images.length} views
            </div>
          )}

          {/* Pause/Play Indicator (optional) */}
          {images.length > 1 && isHovering && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              Paused
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-cyan-500 transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              {product.original_price && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  ${product.original_price}
                </span>
              )}
              <span className="text-xl font-bold text-cyan-500">
                ${product.price}
              </span>
              <span className="text-sm text-gray-500"> / kg</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-pink-400 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
            >
              <FaShoppingBag />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;