import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import Button from '../common/Button';

const ProductCard = ({ product }) => {
  const { addToCart, isLoading } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 group">
      <Link to={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
          <img
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{product.category_name}</span>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">
                ${product.price}
              </span>
              {product.stock_quantity > 0 ? (
                <span className="text-sm text-green-600">
                  In Stock
                </span>
              ) : (
                <span className="text-sm text-red-600">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0 || isLoading}
          loading={isLoading}
          className="w-full flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
