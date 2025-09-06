import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import Button from '../common/Button';
import SearchModal from '../common/SearchModal';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  );

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">E-Shop</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/products">Products</NavLink>
              
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <Link to="/orders" className="text-gray-700 hover:text-primary-600">
                    Orders
                  </Link>
                  {user?.isAdmin && (
                    <Link to="/admin" className="text-gray-700 hover:text-primary-600">
                      Admin
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-primary-600 p-2 rounded-md"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-primary-600 p-2 rounded-md"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-primary-600 p-2 rounded-md"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
              <NavLink to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</NavLink>
              
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</NavLink>
                  <NavLink to="/orders" onClick={() => setIsMobileMenuOpen(false)}>Orders</NavLink>
                  {user?.isAdmin && (
                    <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</NavLink>
                  <NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
