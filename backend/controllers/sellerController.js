const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const jwt = require("jsonwebtoken");

// @desc    Register seller
// @route   POST /api/sellers/register
// @access  Public
exports.registerSeller = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Create seller with role set to 'seller'
  const seller = await User.create({
    name,
    email,
    password,
    role: 'seller'
  });

  sendTokenResponse(seller, 201, res);
});

// @desc    Login seller
// @route   POST /api/sellers/login
// @access  Public
exports.loginSeller = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for seller
  const seller = await User.findOne({ email, role: 'seller' }).select("+password");

  if (!seller) {
    return next(new ErrorResponse("Invalid seller credentials", 401));
  }

  // Check if password matches
  const isMatch = await seller.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid seller credentials", 401));
  }

  sendTokenResponse(seller, 200, res);
});

// @desc    Get current logged in seller
// @route   GET /api/sellers/me
// @access  Private/Seller
exports.getSellerProfile = asyncHandler(async (req, res, next) => {
  // Check if user is a seller
  if (req.user.role !== 'seller') {
    return next(new ErrorResponse("Not authorized as a seller", 403));
  }

  const seller = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: seller
  });
});

// @desc    Get all sellers
// @route   GET /api/sellers
// @access  Public
exports.getSellers = asyncHandler(async (req, res, next) => {
  const sellers = await User.find({ role: 'seller' }).select('-password');

  res.status(200).json({
    success: true,
    count: sellers.length,
    data: sellers
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (seller, statusCode, res) => {
  // Create token
  const token = jwt.sign(
    { id: seller._id, role: seller.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    data: {
      id: seller._id,
      name: seller.name,
      email: seller.email,
      role: seller.role
    }
  });
};
