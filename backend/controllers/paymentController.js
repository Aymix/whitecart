const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.totalAmount * 100, // Convert to cents
    currency: 'usd',
    metadata: { integration_check: 'accept_a_payment', orderId: orderId.toString() }
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});

// @desc    Confirm payment
// @route   POST /api/payment/confirm
// @access  Private
exports.confirmPayment = asyncHandler(async (req, res, next) => {
  const { orderId, paymentId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: paymentId,
    status: 'completed',
    update_time: Date.now()
  };

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});