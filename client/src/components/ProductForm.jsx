import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: 'Baby Collection',
    rating: 4.5,
    is_featured: false
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Baby Collection',
    'Adult Clothing', 
    'Bags Collection'
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        original_price: product.original_price || '',
        category: product.category || 'Baby Collection',
        rating: product.rating || 4.5,
        is_featured: product.is_featured || false
      });
      
      // Handle existing images for editing
      if (product.images && Array.isArray(product.images)) {
        setImagePreviews(product.images);
      } else if (product.image_url) {
        setImagePreviews([product.image_url]);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Check total images limit
    if (imageFiles.length + imagePreviews.length + files.length > 10) {
      alert('Maximum 10 images allowed per product');
      return;
    }

    const newImageFiles = [];
    const newImagePreviews = [];

    files.forEach(file => {
      if (file) {
        // Basic client-side validation
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          alert(`Image ${file.name} is too large (max 10MB)`);
          return;
        }

        newImageFiles.push(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          newImagePreviews.push(reader.result);
          if (newImagePreviews.length === files.length) {
            setImagePreviews(prev => [...prev, ...newImagePreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setImageFiles(prev => [...prev, ...newImageFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate that at least one image is selected for new products
      if (!product && imageFiles.length === 0 && imagePreviews.length === 0) {
        alert('Please select at least one image to upload');
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      submitData.append('rating', formData.rating);
      submitData.append('is_featured', formData.is_featured);
      
      if (formData.original_price) {
        submitData.append('original_price', formData.original_price);
      }
      
      // Append multiple image files
      imageFiles.forEach((file, index) => {
        submitData.append('images', file);
      });

      // For editing, also send existing image URLs
      if (product && imagePreviews.length > 0) {
        imagePreviews.forEach((preview, index) => {
          if (preview.startsWith('http') || preview.startsWith('/')) {
            submitData.append('existing_images', preview);
          }
        });
      }
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index, isPreview = false) => {
    if (isPreview) {
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedPreviews = [...imagePreviews];
    const updatedFiles = [...imageFiles];
    
    const [movedPreview] = updatedPreviews.splice(fromIndex, 1);
    updatedPreviews.splice(toIndex, 0, movedPreview);
    
    if (fromIndex < updatedFiles.length) {
      const [movedFile] = updatedFiles.splice(fromIndex, 1);
      updatedFiles.splice(toIndex, 0, movedFile);
    }
    
    setImagePreviews(updatedPreviews);
    setImageFiles(updatedFiles);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-pink-500 to-cyan-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Image Optimization Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">Image Optimization Notice</p>
                <p className="text-xs text-blue-600 mt-1">
                  Images will be automatically optimized for fast loading. They will be resized and compressed for optimal web performance.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Multiple Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Product Images *
                <span className="text-xs text-gray-500 ml-2">
                  {imagePreviews.length}/10 images (First image will be used as main display)
                </span>
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                      loading="lazy" 
                      width="200"
                      height="128"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, index - 1)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                            title="Move left"
                            aria-label="Move image left"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}
                        {index < imagePreviews.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImage(index, index + 1)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                            title="Move right"
                            aria-label="Move image right"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index, preview.startsWith('http') || preview.startsWith('/'))}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                          title="Remove image"
                          aria-label="Remove image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Add Image Button */}
                {imagePreviews.length < 10 && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:border-pink-400 transition-colors h-32"
                    onClick={() => document.getElementById('image-upload').click()}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && document.getElementById('image-upload').click()}
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-sm text-gray-600 text-center">Add Images</p>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      {imagePreviews.length > 0 ? 'Add more' : 'Select images'}
                    </p>
                  </div>
                )}
              </div>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Supported formats: JPG, PNG, WebP</p>
                <p>• Maximum file size: 10MB per image</p>
                <p>• Images will be automatically optimized for web</p>
                {imagePreviews.length === 0 && !product && (
                  <p className="text-red-500 font-medium">* At least one image is required for new products</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="Describe your product..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Pricing & Additional Settings */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Price (Ksh) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          placeholder="1200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Price (Ksh)
                        </label>
                        <input
                          type="number"
                          name="original_price"
                          value={formData.original_price}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          placeholder="1500 (for discount)"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty if no discount</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating (0-5)
                        </label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleChange}
                          min="0"
                          max="5"
                          step="0.1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="is_featured"
                          checked={formData.is_featured}
                          onChange={handleChange}
                          className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                          id="is_featured"
                        />
                        <label htmlFor="is_featured" className="cursor-pointer">
                          <div className="text-sm font-medium text-gray-700">
                            Featured Product
                          </div>
                          <p className="text-xs text-gray-500">Show this product in featured section</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (imagePreviews.length === 0 && !product)}
                className="px-6 py-3 bg-linear-to-r from-pink-500 to-cyan-500 text-white rounded-lg hover:from-pink-600 hover:to-cyan-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{product ? 'Update Product' : 'Add Product'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;