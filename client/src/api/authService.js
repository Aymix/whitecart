import axiosInstance from './axios';

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Invalid credentials' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await axiosInstance.get('/auth/logout');
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during logout' };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  }
};

export default authService;
