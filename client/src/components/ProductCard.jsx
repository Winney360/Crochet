import { FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
// ✅ Import your image optimizer
import { optimizeCloudinaryUrl, optimizeAllCloudinaryUrls } from '../utils/imageOptimizer';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const handleProductClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      navigate(`/product/${product.slug}`);
    }, 100);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);
    try {
      await addToCart(product._id, 1);
      addToast(`${product.name} added to cart 🛍️`, 'success');
    } catch (error) {
      addToast('Failed to add to cart ❌', 'error');
    }
    setIsAddingToCart(false);
  };

  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) * 100
      )
    : 0;

  // ✅ OPTIMIZE IMAGES HERE
  const images = (
    product.images && product.images.length > 0
      ? optimizeAllCloudinaryUrls(product.images) // Optimize all images in array
      : [optimizeCloudinaryUrl(
          product.image_url || 'https://images.pexels.com/photos/3945638/pexels-photo-3945638.jpeg'
        )] // Optimize single image or fallback
  );

  useEffect(() => {
    if (images.length <= 1) return;

    const startSliding = () => {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    };

    const stopSliding = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!isHovering) startSliding();
    else stopSliding();

    return () => stopSliding();
  }, [images.length, isHovering]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleTouchStart = () => setIsHovering(true);
  const handleTouchEnd = () => setIsHovering(false);

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-cyan-400">
      {/* Product Image Section */}
      <div
        className="relative overflow-hidden cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleProductClick}
      >
        {/* ✅ This image now uses optimized URL */}
        <img
          src={images[currentImageIndex]}
          alt={product.name}
          className="w-full h-64 object-cover transition-opacity duration-500"
          loading="lazy"
          width="500"
          height="500" // ✅ Add explicit dimensions for better performance
        />

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {product.is_featured && (
          <div className="absolute top-4 right-4 bg-pink-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute top-12 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {images.length} images
          </div>
        )}

        {images.length > 1 && isHovering && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            Paused
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-white font-semibold text-lg bg-black/50 px-4 py-2 rounded-lg">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Info Section - unchanged */}
      <div className="p-4">
        <h3
          className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-cyan-500 transition-colors cursor-pointer"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>

        <p
          className="text-sm text-gray-600 mb-3 line-clamp-2 cursor-pointer"
          onClick={handleProductClick}
        >
          {product.description}
        </p>

        {(product.yarn_type || product.skill_level) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {product.yarn_type && (
              <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                {product.yarn_type}
              </span>
            )}
            {product.skill_level && (
              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded capitalize">
                {product.skill_level}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-5 mb-4">
          {product.original_price && (
            <>
              <span className="text-sm text-gray-400 line-through">
                Ksh. {product.original_price}
              </span>
              <span className="text-xs text-red-500 font-semibold">
                -{discount}%
              </span>
            </>
          )}
          <span className="text-2xl font-bold text-cyan-500">
            Ksh. {product.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="flex items-center justify-center gap-2 border-2 border-cyan-400 text-cyan-400 bg-white hover:bg-cyan-400 hover:text-white disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400 transition-all duration-300 rounded-full py-2 px-4 font-semibold text-sm w-full disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <FaShoppingBag className="text-lg" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <div className="flex gap-2 mt-3 md:hidden">
          <button
            onClick={handleProductClick}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;