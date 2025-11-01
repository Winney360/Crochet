import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm.jsx';
import ProductList from '../components/ProductList.jsx';
import { hardcodedProducts } from '../data/hardcodedProducts';
import api from '../api/axios'; 
import { 
  FaBox, 
  FaStar, 
  FaDollarSign,
  FaPlus,
  FaSync,
  FaPalette,
  FaTags
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { logout, admin } = useAuth();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    totalValue: 0,
    categories: 0
  });

  useEffect(() => {
    // Scroll to top when component mounts (page refresh/load)
    window.scrollTo(0, 0);
    
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [products]);

  // Function to get the primary image from a product
  const getPrimaryImage = (product) => {
    // If product has multiple images array, use the first one
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    
    // If product has single image_url
    if (product.image_url) {
      return product.image_url;
    }
    
    // Try other possible image fields
    if (product.image) {
      return product.image;
    }
    
    if (product.imageUrl) {
      return product.imageUrl;
    }
    
    if (product.photo) {
      return product.photo;
    }
    
    // Fallback placeholder
    return '/api/placeholder/80/80';
  };

  // Function to normalize all products to have consistent structure
  const normalizeProduct = (product) => {
    return {
      ...product,
      // Ensure we have a primary image for display
      primaryImage: getPrimaryImage(product),
      // Keep the original images array if it exists
      images: product.images || [getPrimaryImage(product)].filter(Boolean)
    };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      
      let productData = [];
      if (Array.isArray(res.data)) {
        productData = res.data.map(normalizeProduct);
      }
      
      // Normalize hardcoded products too
      const normalizedHardcodedProducts = hardcodedProducts.map(normalizeProduct);
      
      // COMBINE WITH HARDCODED PRODUCTS
      const allProducts = [...productData, ...normalizedHardcodedProducts.filter(hardcoded => 
        !productData.some(apiProduct => apiProduct._id === hardcoded._id)
      )];
      
      setProducts(allProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      // Normalize hardcoded products even on error
      const normalizedHardcodedProducts = hardcodedProducts.map(normalizeProduct);
      setProducts(normalizedHardcodedProducts);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const featuredProducts = products.filter(product => product.is_featured).length;
    const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);
    const categories = [...new Set(products.map(product => product.category))].length;
    
    setStats({
      totalProducts,
      featuredProducts,
      totalValue,
      categories
    });
  };

  const addProduct = async (productData) => {
    try {
      const res = await api.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Normalize the new product
      const normalizedProduct = normalizeProduct(res.data);
      
      setProducts([normalizedProduct, ...products]);
      setShowForm(false);
      showNotification('✅ Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      showNotification('❌ ' + (err.response?.data?.message || 'Error adding product'));
    }
  };

  const updateProduct = async (productData) => {
    try {
      const res = await api.put(`/products/${editingProduct._id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Normalize the updated product
      const normalizedProduct = normalizeProduct({
        ...res.data,
        // Preserve the images array if it exists in the original product
        images: res.data.images || editingProduct.images
      });
      
      setProducts(products.map(p => p._id === editingProduct._id ? normalizedProduct : p));
      setEditingProduct(null);
      setShowForm(false);
      showNotification('✅ Product updated successfully!');
    } catch (err) {
      console.error('Error updating product:', err);
      showNotification('❌ ' + (err.response?.data?.message || 'Error updating product'));
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
        showNotification('✅ Product deleted successfully!');
      } catch (err) {
        showNotification('❌ ' + (err.response?.data?.message || 'Error deleting product'));
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const refreshData = () => {
    fetchProducts();
    showNotification('🔄 Products refreshed!');
    // Scroll to top when refreshing data
    window.scrollTo(0, 0);
  };

  const showNotification = (message) => {
    alert(message);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-cyan-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg font-medium">Loading Your Products...</p>
          <p className="text-slate-400 text-sm mt-2">Getting your crochet collection ready</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Clean Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaPalette className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Product Manager
                </h1>
                <p className="text-slate-500 text-sm">Manage your crochet collection</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-slate-600 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaBox className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaStar className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Featured</p>
                <p className="text-2xl font-bold text-slate-800">{stats.featuredProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaDollarSign className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Inventory Value</p>
                <p className="text-2xl font-bold text-slate-800">Ksh. {stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaTags className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold text-slate-800">{stats.categories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Clean & Simple */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          {/* Header with Actions */}
          <div className="border-b border-slate-200 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Your Products
                </h2>
                <p className="text-slate-500 mt-1">
                  Manage your crochet creations {stats.totalProducts > 0 && `(${stats.totalProducts} items)`}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={refreshData}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg transition-colors font-medium"
                >
                  <FaSync />
                  Refresh
                </button>
                
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                >
                  <FaPlus />
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Product Form Modal */}
          {showForm && (
            <ProductForm
              product={editingProduct}
              onSubmit={editingProduct ? updateProduct : addProduct}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          )}

          {/* Products List */}
          <div className="p-8">
            <ProductList
              products={products}
              onEdit={(product) => {
                setEditingProduct(product);
                setShowForm(true);
              }}
              onDelete={deleteProduct}
            />
          </div>
        </div>

        {/* Simple Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-400 text-sm">
            ShikuStitch Crochet • Product Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;