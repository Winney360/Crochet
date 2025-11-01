import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft, FaExpand } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { hardcodedProducts } from '../data/hardcodedProducts';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart } = useCart();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    
    try {
      let foundProduct = null;
      let allProducts = [...hardcodedProducts];

      console.log('🔍 Searching for product with slug/ID:', slug);

      // FIRST: Try API by slug endpoint
      try {
        console.log('🔄 Trying API by slug:', slug);
        const slugResponse = await axios.get(`${API_BASE_URL}/api/products/slug/${slug}`);
        if (slugResponse.data) {
          foundProduct = slugResponse.data;
          console.log('✅ Product found via slug endpoint:', foundProduct.name);
          allProducts.push(foundProduct);
        }
      } catch (slugError) {
        console.log('❌ Product not found via slug endpoint');
      }

      // SECOND: If slug endpoint fails, try hardcoded products
      if (!foundProduct) {
        foundProduct = hardcodedProducts.find(p => p.slug === slug);
        if (foundProduct) {
          console.log('✅ Product found in hardcoded by slug:', foundProduct.name);
        }
      }

      // THIRD: If still not found, try API by ID (only if it looks like MongoDB ID)
      if (!foundProduct && /^[0-9a-fA-F]{24}$/.test(slug)) {
        try {
          console.log('🆔 Trying API by ID:', slug);
          const response = await axios.get(`${API_BASE_URL}/api/products/${slug}`);
          if (response.data) {
            foundProduct = response.data;
            console.log('✅ Product found via ID:', foundProduct.name);
            allProducts.push(foundProduct);
          }
        } catch (idError) {
          console.log('❌ Product not found by ID');
        }
      }

      if (foundProduct) {
        // Fix image URL for API products
        const productWithFixedImage = {
          ...foundProduct,
          // Ensure image_url is complete for API products
          image_url: foundProduct.image_url?.startsWith('http') 
            ? foundProduct.image_url 
            : `${API_BASE_URL}${foundProduct.image_url}`
        };
        
        setProduct(productWithFixedImage);

        // Find related products
        const related = allProducts
          .filter(p => {
            if (p._id === foundProduct._id) return false;
            return p.category?.toLowerCase() === foundProduct.category?.toLowerCase();
          })
          .slice(0, 4);
        
        console.log('📦 Found related products:', related.length);
        setRelatedProducts(related);
      } else {
        console.log('❌ Product not found anywhere');
        setProduct(null);
      }
    } catch (error) {
      console.error('💥 Error fetching product:', error);
      console.error('Error response:', error.response?.data);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product._id, quantity);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, newQuantity));
  };

  // Fix image URLs for display
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg';
    
    if (imagePath.startsWith('http')) {
      return imagePath; // External URL
    } else if (imagePath.startsWith('/uploads')) {
      return `${API_BASE_URL}${imagePath}`; // Local uploads
    } else {
      return imagePath; // Fallback
    }
  };

  // Use images array if available, otherwise fallback to image_url
  const images = product?.images && product.images.length > 0 
    ? product.images.map(img => getImageUrl(img))
    : [getImageUrl(product?.image_url)];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-pink-400 text-white px-6 py-3 rounded-lg hover:bg-pink-500 transition-colors"
          >
            <FaArrowLeft />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-400 text-white py-8">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/" className="hover:underline opacity-90">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:underline opacity-90">Shop</Link>
            <span>/</span>
            <span className="opacity-90">{product.name}</span>
          </nav>
          <h1 className="text-3xl font-bold">{product.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Product Main Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image Container */}
              <div className="relative bg-white rounded-lg border border-gray-200">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-auto max-h-[500px] object-contain"
                  onError={(e) => {
                    console.log('❌ Image failed to load:', images[currentImageIndex]);
                    e.target.src = 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg';
                  }}
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                
                {/* Zoom Button */}
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all"
                  title="Zoom image"
                >
                  <FaExpand />
                </button>
                
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discount}%
                  </div>
                )}
                
                {/* Featured Badge */}
                {product.is_featured && (
                  <div className="absolute top-14 left-4 bg-pink-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Featured
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden bg-white ${
                        currentImageIndex === index ? 'border-pink-400' : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          console.log('❌ Thumbnail failed to load:', image);
                          e.target.src = 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
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
                  </div>
                  <span className="text-gray-600 text-sm">({product.rating || 0} rating)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-2">
                  {product.original_price && (
                    <span className="text-xl text-gray-400 line-through">
                      Ksh. {product.original_price}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-pink-400">
                    Ksh. {product.price}
                  </span>
                  {discount > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">
                      Save {discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'Beautiful handmade crochet product crafted with care and attention to detail.'}
                </p>
              </div>

              {/* Category Info */}
              <div className="text-sm">
                <span className="font-semibold text-gray-700">Category: </span>
                <span className="text-gray-600">{product.category}</span>
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-gray-700 font-semibold">Quantity:</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaMinus className="text-sm" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-x-2 border-gray-300 py-2 focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-pink-400 text-white px-8 py-4 rounded-lg font-semibold hover:bg-pink-500 transition-colors flex items-center justify-center gap-3 text-lg"
                >
                  <FaShoppingCart />
                  Add to Cart - Ksh. {(product.price * quantity).toFixed(2)}
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Product Features:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Handmade with Love
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Premium Quality Materials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Unique Design
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Care Instructions Included
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">You Might Also Like</h2>
              <Link 
                to="/shop" 
                className="text-pink-400 hover:text-pink-600 font-semibold transition-colors"
              >
                View All Products →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;