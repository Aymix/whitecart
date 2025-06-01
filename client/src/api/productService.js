import axiosInstance from './axios';

const productService = {
  // Get all products
  getProducts: async () => {
    try {
      const response = await axiosInstance.get('/products');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await axiosInstance.get('/products');
      // Filter products by category on the client side
      if (response.data.success) {
        const filteredProducts = response.data.data.filter(
          product => product.category.toLowerCase() === category.toLowerCase()
        );
        return { success: true, data: filteredProducts };
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products by category' };
    }
  },

  // Get a single product by ID
  getProduct: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },

  // Create a new product (seller only)
  createProduct: async (productData) => {
    try {
      // productData should already be FormData at this point
      if (!(productData instanceof FormData)) {
        throw new Error('Product data must be FormData');
      }
      
      // Get the token directly to ensure it's included
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in as a seller.');
      }
      
      // Direct axios call with explicit headers
      const response = await axiosInstance.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Product creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      // Enhanced error reporting
      if (error.response?.data) {
        console.error('Server error details:', error.response.data);
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message };
      } else {
        throw { message: 'Failed to create product' };
      }
    }
  },

  // Update a product (seller only)
  updateProduct: async (id, productData) => {
    try {
      // productData should already be FormData at this point
      if (!(productData instanceof FormData)) {
        throw new Error('Product data must be FormData');
      }
      
      // Get the token directly to ensure it's included
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in as a seller.');
      }
      
      // Direct axios call with explicit headers
      const response = await axiosInstance.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Product update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      // Enhanced error reporting
      if (error.response?.data) {
        console.error('Server error details:', error.response.data);
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message };
      } else {
        throw { message: 'Failed to update product' };
      }
    }
  },

  // Delete a product (seller only)
  deleteProduct: async (id) => {
    try {
      // Get the token directly to ensure it's included
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in as a seller.');
      }
      
      // Direct axios call with explicit headers
      const response = await axiosInstance.delete(`/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Product deletion response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      // Enhanced error reporting
      if (error.response?.data) {
        console.error('Server error details:', error.response.data);
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message };
      } else {
        throw { message: 'Failed to delete product' };
      }
    }
  }
};

export default productService;
