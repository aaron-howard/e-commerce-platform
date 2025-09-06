import React from 'react';
import { useQuery } from 'react-query';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Plus,
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  // Fetch dashboard stats
  const { data: statsData, isLoading } = useQuery(
    'admin-stats',
    () => Promise.all([
      api.get('/users/all?limit=1'),
      api.get('/products?limit=1'),
      api.get('/orders?limit=1'),
      // Mock data for now - in real app, you'd have dedicated stats endpoints
      Promise.resolve({ data: { total: 1250 } }), // Total revenue
      Promise.resolve({ data: { total: 45 } }),   // New orders today
      Promise.resolve({ data: { total: 12 } })    // Low stock products
    ]),
    {
      select: (data) => ({
        totalUsers: data[0].data.pagination.totalCount,
        totalProducts: data[1].data.pagination.totalCount,
        totalOrders: data[2].data.pagination.totalCount,
        totalRevenue: data[3].data.total,
        newOrdersToday: data[4].data.total,
        lowStockProducts: data[5].data.total
      })
    }
  );

  // Fetch recent orders
  const { data: recentOrdersData } = useQuery(
    'recent-orders',
    () => api.get('/orders?limit=5'),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch recent products
  const { data: recentProductsData } = useQuery(
    'recent-products',
    () => api.get('/products?limit=5&sort=created_at&order=desc'),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const stats = statsData || {};
  const recentOrders = recentOrdersData?.data?.orders || [];
  const recentProducts = recentProductsData?.data?.products || [];

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-purple-500',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue || 0}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-yellow-500',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your e-commerce platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/products">
              <Button className="w-full flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Manage Products</span>
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View Orders</span>
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Manage Users</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total_amount}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            )}
          </div>

          {/* Recent Products */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
              <Link to="/admin/products">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            
            {recentProducts.length > 0 ? (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Stock: {product.stock_quantity}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock_quantity > 10 ? 'bg-green-100 text-green-800' :
                        product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_quantity > 10 ? 'In Stock' :
                         product.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent products</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
