import axiosInstance from './axios';

const paymentService = {
  // Create a payment intent
  createPaymentIntent: async (paymentData) => {
    try {
      const response = await axiosInstance.post('/payment/create-payment-intent', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create payment intent' };
    }
  },

  // Confirm payment
  confirmPayment: async (paymentData) => {
    try {
      const response = await axiosInstance.post('/payment/confirm', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to confirm payment' };
    }
  }
};

export default paymentService;
