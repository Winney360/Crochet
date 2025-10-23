import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    category: 'Baby Collection', // Default to match homepage
    rating: 4.5,
    is_featured: false
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price || '',
        image_url: product.image_url,
        category: product.category,
        rating: product.rating,
        is_featured: product.is_featured
      });
    }
  }, [product]);

  const { name, description, price, original_price, image_url, category, rating, is_featured } = formData;

  const onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : undefined,
      rating: parseFloat(rating)
    };
    onSubmit(submitData);
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form">
        <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              required
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($):</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={onChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Original Price ($):</label>
              <input
                type="number"
                name="original_price"
                value={original_price}
                onChange={onChange}
                step="0.01"
                min="0"
                placeholder="Leave empty for no discount"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              name="image_url"
              value={image_url}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category:</label>
              <select name="category" value={category} onChange={onChange}>
                <option value="Baby Collection">Baby Collection</option>
                <option value="Adult Clothing">Adult Clothing</option>
                <option value="Bags">Bags</option>
              </select>
            </div>

            <div className="form-group">
              <label>Rating (0-5):</label>
              <input
                type="number"
                name="rating"
                value={rating}
                onChange={onChange}
                step="0.1"
                min="0"
                max="5"
                required
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_featured"
                checked={is_featured}
                onChange={onChange}
              />
              Featured Product
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {product ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;