const express = require('express');
const { 
  registerSeller, 
  loginSeller, 
  getSellerProfile, 
  getSellers 
} = require('../controllers/sellerController');

// Import middleware
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerSeller);
router.post('/login', loginSeller);
router.get('/', getSellers);

// Protected routes
router.get('/me', protect, getSellerProfile);

module.exports = router;
