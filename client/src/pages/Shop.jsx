import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';


const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*');
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*');

    if (selectedCategory !== 'all') {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', selectedCategory)
        .single();

      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    query = query.order(sortBy, { ascending: sortBy === 'price' });

    const { data } = await query;
    setProducts(data || []);
    setLoading(false);
  };

  const handleCategoryChange = (categorySlug) => {
    if (categorySlug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categorySlug });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-400 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Shop</h1>
          <p className="text-xl">Fresh Organic Products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-pink-400 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.slug)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.slug
                          ? 'bg-pink-400 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="name">Name</option>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Rating</option>
                  <option value="created_at">Newest</option>
                </select>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Special Offer</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Get 20% off on your first order!
                </p>
                <button className="w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {products.length} products
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
