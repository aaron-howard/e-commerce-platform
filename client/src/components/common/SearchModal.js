import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search products
  const { data: searchResults, isLoading } = useQuery(
    ['search', debouncedSearchTerm],
    () => api.get(`/products?search=${encodeURIComponent(debouncedSearchTerm)}&limit=8`),
    {
      enabled: debouncedSearchTerm.length > 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleProductClick = (productId) => {
    onClose();
    window.location.href = `/products/${productId}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchResults?.data?.products?.length > 0) {
      handleProductClick(searchResults.data.products[0].id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className="mt-20">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        {searchTerm.length > 2 && (
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : searchResults?.data?.products?.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Search Results ({searchResults.data.products.length})
                </h3>
                {searchResults.data.products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {product.category_name}
                      </p>
                      <p className="text-sm font-medium text-primary-600">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : debouncedSearchTerm.length > 2 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found for "{debouncedSearchTerm}"</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Quick Search Suggestions */}
        {searchTerm.length <= 2 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSearchTerm(category)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
