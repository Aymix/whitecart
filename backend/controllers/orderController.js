const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return next(new ErrorResponse('No order items', 400));
  }

  let orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${item.product}`, 404));
    }

    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Not enough stock for ${product.name}`, 400));
    }

    orderItems.push({
      product: item.product,
      name: product.name,
      quantity: item.quantity,
      price: product.offerPrice,
      image: product.image
    });

    totalAmount += product.offerPrice * item.quantity;

    // Update stock
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user is order owner or admin
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 401));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});