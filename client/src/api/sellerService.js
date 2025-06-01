import axiosInstance from './axios';

const sellerService = {
  // Register a new seller
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/sellers/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('sellerToken', response.data.token);
        localStorage.setItem('sellerInfo', JSON.stringify(response.data.data));
      }
      
      return {
        success: true,
        token: response.data.token,
        data: response.data.data
      };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to register seller account' };
    }
  },

  // Login seller
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/sellers/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('sellerToken', response.data.token);
        localStorage.setItem('sellerInfo', JSON.stringify(response.data.data));
      }
      
      return {
        success: true,
        token: response.data.token,
        data: response.data.data
      };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to login' };
    }
  },

  // Logout seller
  logout: async () => {
    try {
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('sellerInfo');
      return { success: true };
    } catch (error) {
      throw { message: 'Failed to logout' };
    }
  },

  // Get seller profile
  getSellerProfile: async () => {
    try {
      const response = await axiosInstance.get('/sellers/me');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch seller profile' };
    }
  },

  // Check if seller is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem('sellerToken');
    return !!token;
  },

  // Get seller info from localStorage
  getSellerInfo: () => {
    const sellerInfo = localStorage.getItem('sellerInfo');
    return sellerInfo ? JSON.parse(sellerInfo) : null;
  }
};

export default sellerService;
