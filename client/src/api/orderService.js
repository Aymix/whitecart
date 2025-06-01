import axiosInstance from './axios';

const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      // Ensure the order data has a shippingAddress field
      const processedOrderData = {
        ...orderData,
        // Make sure shippingAddress exists, using different possible sources
        shippingAddress: orderData.shippingAddress || 
                         orderData.deliveryAddress ||
                         (orderData.selectedAddress && orderData.selectedAddress.address) ||
                         'Default Shipping Address' // Fallback if all else fails
      };
      
      console.log('Sending order data:', processedOrderData); // Debug log
      
      const response = await axiosInstance.post('/orders', processedOrderData);
      return response.data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  // Get all orders for the current user
  getMyOrders: async () => {
    try {
      const response = await axiosInstance.get('/orders/myorders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get a single order by ID
  getOrder: async (id) => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order' };
    }
  }
};

export default orderService;
