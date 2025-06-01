import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get the token, looking in multiple possible locations
    let token = localStorage.getItem('token') || localStorage.getItem('sellerToken');
    
    if (token) {
      // Ensure Authorization header exists regardless of Content-Type
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
      
      // For debugging purposes, log the token and headers
      console.log('Using auth token:', token);
      console.log('Request headers:', config.headers);
    } else {
      console.log('No auth token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
