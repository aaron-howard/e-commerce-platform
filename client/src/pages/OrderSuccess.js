import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import Button from '../components/common/Button';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-600">Order confirmation sent to your email</span>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-600">You'll receive tracking information soon</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-600">Expected delivery: 3-5 business days</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link to="/orders" className="block">
              <Button className="w-full" size="lg">
                View My Orders
              </Button>
            </Link>
            
            <Link to="/" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
