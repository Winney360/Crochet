import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);

    const { data: productData } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .single();

    if (productData) {
      setProduct(productData);

      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', productData.category_id)
        .neq('id', productData.id)
        .limit(4);

      setRelatedProducts(related || []);
    }

    setLoading(false);
  };

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <Link to="/shop" className="text-cyan-500 hover:underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-400 text-white py-12">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:underline">Shop</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <img
                src={product.image_url || 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.rating || 0} ratings)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {product.original_price && (
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.original_price}
                  </span>
                )}
                <span className="text-4xl font-bold text-cyan-500">
                  ${product.price}
                </span>
                <span className="text-gray-600">/ kg</span>
              </div>

              {product.categories && (
                <p className="text-gray-600 mb-4">
                  Category:{' '}
                  <Link
                    to={`/shop?category=${product.categories.slug}`}
                    className="text-cyan-500 hover:underline"
                  >
                    {product.categories.name}
                  </Link>
                </p>
              )}

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description || 'Fresh organic product delivered straight to your door. High quality guaranteed.'}
              </p>

              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Availability:{' '}
                  <span className={product.stock > 0 ? 'text-cyan-500' : 'text-red-600'}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x-2 border-gray-300 py-2 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <FaPlus />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-pink-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Product Features:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ 100% Organic</li>
                  <li>✓ Fresh & Healthy</li>
                  <li>✓ Locally Sourced</li>
                  <li>✓ No Pesticides</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={relatedProduct.image_url || 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-cyan-500 font-bold">${relatedProduct.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
