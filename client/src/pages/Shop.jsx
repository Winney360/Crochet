import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { hardcodedProducts } from '../data/hardcodedProducts';
import axios from 'axios';

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [allProducts, selectedCategory, sortBy, searchTerm, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let apiProducts = [];
      
      // Try to fetch from API
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        if (Array.isArray(response.data)) {
          apiProducts = response.data;
          console.log('✅ API products loaded:', apiProducts.length);
        }
      } catch (apiError) {
        console.log('❌ API not available, using hardcoded products only');
      }
      
      // Combine hardcoded and API products
      const combinedProducts = [...hardcodedProducts, ...apiProducts];
      console.log('📦 Total products:', combinedProducts.length);
      
      setAllProducts(combinedProducts);
      extractCategories(combinedProducts);
      
      // Calculate max price
      if (combinedProducts.length > 0) {
        const prices = combinedProducts.map(p => p.price || 0).filter(price => !isNaN(price));
        const actualMax = Math.ceil(Math.max(...prices, 5000));
        setMaxPrice(actualMax);
        setPriceRange([0, actualMax]);
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to hardcoded only
      setAllProducts(hardcodedProducts);
      extractCategories(hardcodedProducts);
    } finally {
      setLoading(false);
    }
  };

  const extractCategories = (products) => {
    // Get unique categories from all products
    const uniqueCategories = [...new Set(products
      .map(p => p.category)
      .filter(Boolean) // Remove null/undefined
    )];
    
    console.log('🏷️ Found categories:', uniqueCategories);
    
    // Create category objects with proper mapping
    const categoryObjects = uniqueCategories.map((category, index) => {
      // Create slug from category name
      const slug = category.toLowerCase().replace(/\s+/g, '-');
      return {
        _id: `cat-${index}`,
        name: category,
        slug: slug
      };
    });
    
    setCategories(categoryObjects);
  };

  const filterAndSortProducts = () => {
    let filtered = [...allProducts];

    // 1. Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        if (!product.category) return false;
        
        // Normalize category for comparison
        const productCategory = product.category.toLowerCase().replace(/\s+/g, '-');
        const selectedCategorySlug = selectedCategory.toLowerCase();
        
        return productCategory === selectedCategorySlug;
      });
    }

    // 2. Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      );
    }

    // 3. Apply price filter
    filtered = filtered.filter(product => 
      (product.price || 0) >= priceRange[0] && 
      (product.price || 0) <= priceRange[1]
    );

    // 4. Apply sorting
    filtered = sortProducts(filtered, sortBy);

    setFilteredProducts(filtered);
  };

  const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'name':
      default:
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
  };

  const handleCategoryChange = (categorySlug) => {
    if (categorySlug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categorySlug });
    }
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchTerm('');
    setSortBy('name');
    setPriceRange([0, maxPrice]);
  };

  // Debug info
  useEffect(() => {
    console.log('🔍 DEBUG INFO:');
    console.log('All products:', allProducts.length);
    console.log('Filtered products:', filteredProducts.length);
    console.log('Selected category:', selectedCategory);
    console.log('Categories available:', categories);
  }, [allProducts, filteredProducts, selectedCategory, categories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-pink-400 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Shop</h1>
          <p className="text-xl">Beautiful Handmade Crochet Products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-pink-400 hover:text-pink-600 transition-colors"
                >
                  Clear All
                </button>
              </div>

              

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-pink-400 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      All Products ({allProducts.length})
                    </button>
                  </li>
                  {categories.map((category) => {
                    const categoryCount = allProducts.filter(p => 
                      p.category?.toLowerCase().replace(/\s+/g, '-') === category.slug
                    ).length;
                    
                    return (
                      <li key={category._id}>
                        <button
                          onClick={() => handleCategoryChange(category.slug)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex justify-between items-center ${
                            selectedCategory === category.slug
                              ? 'bg-pink-400 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {categoryCount}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-pink-400"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ksh. 0</span>
                    <span>Ksh. {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Products Area */}
          <main className="lg:col-span-3">
            {/* Header with search and results */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory === 'all' 
                    ? 'All Products' 
                    : categories.find(c => c.slug === selectedCategory)?.name || selectedCategory
                  }
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing {filteredProducts.length} of {allProducts.length} products
                  {searchTerm && ` for "${searchTerm}"`}
                  {priceRange[1] < maxPrice && ` under Ksh. ${priceRange[1]}`}
                </p>
              </div>
              
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 min-w-64"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="bg-gray-300 h-64 w-full"></div>
                    <div className="p-4 space-y-3">
                      <div className="bg-gray-300 h-5 rounded w-3/4"></div>
                      <div className="bg-gray-300 h-3 rounded w-full"></div>
                      <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">🧶</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== 'all' || priceRange[1] < maxPrice
                    ? 'Try adjusting your filters or search term'
                    : 'No products available yet'
                  }
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
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