import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const AdminDashboard = ({ setAuth }) => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth(false);
  };

  const addProduct = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/products', productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts([res.data, ...products]);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding product');
    }
  };

  const updateProduct = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/products/${editingProduct._id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.map(p => p._id === editingProduct._id ? res.data : p));
      setEditingProduct(null);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating product');
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.filter(p => p._id !== productId));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-actions">
        <button 
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }} 
          className="btn-primary"
        >
          Add New Product
        </button>
      </div>

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

      <ProductList
        products={products}
        onEdit={(product) => {
          setEditingProduct(product);
          setShowForm(true);
        }}
        onDelete={deleteProduct}
      />
    </div>
  );
};

export default AdminDashboard;