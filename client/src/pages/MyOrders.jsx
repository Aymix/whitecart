import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../api';
import toast from 'react-hot-toast';
import Cart from './Cart';

const MyOrders = () => {
  const navigate = useNavigate();
  const { orders, addOrder, user, logout } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Fetch orders from API - only run once when component mounts if user exists
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Skip if user doesn't exist
        if (!user || !user._id) {
          setLoading(false);
          return;
        }
        
        setLoading(true);
        const response = await orderService.getMyOrders();
        console.log('Fetched orders:', response);
        
        // Handle different response formats
        let ordersData = [];
        if (response.data) {
          ordersData = response.data;
        } else if (Array.isArray(response)) {
          ordersData = response;
        }
        
        console.log('Processed orders data:', ordersData);
        setFilteredOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load your orders');
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch orders once when the component mounts
    fetchOrders();
    
    // Empty dependency array to prevent repeated fetching
  }, []);

  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your order history.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GreenCart</h1>
            <p className="mt-1 text-sm text-gray-600">Fresh groceries delivered to your door</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Home
            </button>
            <button 
              onClick={logout}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Hello, {user.name}! Here's your order history</p>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </button>
        </div>

        {/* Order History */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-2xl font-bold mt-4 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">Your order history will appear here once you make a purchase</p>
              <button 
                onClick={() => navigate('/products')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Order #{order._id}</h3>
                      <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-end mt-2 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-xl font-bold mt-2">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 my-4 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Payment Method:</span>
                      <span className="text-sm font-medium">{order.paymentMethod || 'Cash On Delivery'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Shipping Address:</span>
                      <span className="text-sm font-medium text-right max-w-xs">{order.shippingAddress}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-md font-medium text-gray-900 mb-3">Items:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items && order.items.map((item) => {
                      // Handle different item data structures
                      const productId = item.product || item.productId || item._id;
                      const productName = item.name || (item.product && item.product.name) || 'Product';
                      const productPrice = item.price || (item.product && item.product.price) || 0;
                      const productImage = item.image || `/uploads/products/${productId}.jpg`;
                      
                      return (
                        <div key={productId} className="flex items-center border border-gray-200 rounded-lg p-3">
                          <img 
                            src={productImage || '/img/placeholder-image.jpg'}
                            alt={productName} 
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.src = '/img/placeholder-image.jpg';
                            }}
                          />
                          <div className="ml-4">
                            <h5 className="font-medium">{productName}</h5>
                            <p className="text-sm text-gray-600">₹{Number(productPrice).toFixed(2)} × {item.quantity}</p>
                            <p className="font-medium text-indigo-600">₹{(Number(productPrice) * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button 
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => {
                        // Logic to reorder would go here
                        toast.success(`Reordering items from order #${order._id.substring(0, 8)}...`);
                        // Add reorder logic here
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="mx-auto bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-indigo-600">{filteredOrders.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delivered</h3>
            <p className="text-3xl font-bold text-green-600">
              {filteredOrders.filter(order => order.status === 'Delivered').length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {filteredOrders.filter(order => order.status !== 'Delivered').length}
            </p>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default MyOrders;