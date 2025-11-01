import React from 'react';

const ProductList = ({ products, onEdit, onDelete }) => {
  const productList = Array.isArray(products) ? products : [];

  // Function to get the display image from a product
  const getDisplayImage = (product) => {
    // Use primaryImage if available (from normalized product)
    if (product.primaryImage) {
      return product.primaryImage;
    }
    
    // Fallback to first image in images array
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    
    // Fallback to single image fields
    if (product.image_url) {
      return product.image_url;
    }
    
    if (product.image) {
      return product.image;
    }
    
    // Final fallback
    return '/api/placeholder/80/80';
  };

  // Fallback image for errors
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxNkMyMC42ODYzIDE2IDE4IDE4LjY4NjMgMTggMjJDMiAyNS4zMTM3IDIwLjY4NjMgMjggMjQgMjhDMjcuMzEzNyAyOCAzMCAyNS4zMTM3IDMwIDIyQzMwIDE4LjY4NjMgMjcuMzEzNyAxNiAyNCAxNloiIGZpbGw9IiNEOEQ5REIiLz4KPHBhdGggZD0iTTMyLjUgMTcuNUwzMi41MDQ5IDE3LjUiIGZpbGw9IiNEOEQ5REIiLz4KPHBhdGggZD0iTTMyLjUgMTcuNUwzMi41MDQ5IDE3LjUiIHN0cm9rZT0iIzk5QUFCQyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
    e.target.onerror = null; // Prevent infinite loop
  };

  return (
    <div className="product-list bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Management</h2>
      
      {productList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No products found.</p>
          <p className="text-gray-400 mt-2">Add your first product to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Images
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productList.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          src={getDisplayImage(product)}
                          alt={product.name}
                          onError={handleImageError}
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-semibold">Ksh. {product.price}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-xs text-gray-500 line-through">
                          Ksh. {product.original_price}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (product.images && product.images.length > 1) 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.images && product.images.length > 1 
                          ? `${product.images.length} images` 
                          : '1 image'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.is_featured 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.is_featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product._id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;