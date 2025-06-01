const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const upload = require('../middleware/upload');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find().populate('seller', 'name');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name');

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Seller
exports.createProduct = [
  upload.single('image'),
  asyncHandler(async (req, res, next) => {
    try {
      // Log incoming request data for debugging
      console.log('Create product request body:', req.body);
      console.log('Create product file:', req.file);
      
      // Add user to req.body
      req.body.seller = req.user.id;

      // Check for image file
      if (req.file) {
        // Create a URL for the uploaded file
        req.body.image = `/uploads/${req.file.filename}`;
      } else {
        return next(new ErrorResponse('Please upload an image', 400));
      }

      // Prepare the product data
      const productData = { ...req.body };
      
      // Handle description field - ensure it's an array
      if (productData.description && !Array.isArray(productData.description)) {
        // If description is sent as a string from form data, convert it to an array
        if (typeof productData.description === 'string') {
          productData.description = [productData.description];
        }
      }
      
      // Ensure numeric fields are properly converted
      if (productData.price) productData.price = Number(productData.price);
      if (productData.offerPrice) productData.offerPrice = Number(productData.offerPrice);
      if (productData.stock) productData.stock = Number(productData.stock);

      // Log the final product data
      console.log('Final product data:', productData);

      // Create the product
      const product = await Product.create(productData);

      return res.status(201).json({
        success: true,
        data: product
      });
    } catch (err) {
      console.error('Error creating product:', err);
      return next(new ErrorResponse(`Error creating product: ${err.message}`, 500));
    }
  })
];

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Seller
exports.updateProduct = [
  upload.single('image'),
  asyncHandler(async (req, res, next) => {
    try {
      // Log incoming request data for debugging
      console.log('Update product request body:', req.body);
      console.log('Update product file:', req.file);
      console.log('User ID from token:', req.user.id);
      
      // First find the product to verify ownership
      let product = await Product.findById(req.params.id);

      if (!product) {
        return next(
          new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
      }

      console.log('Found product:', product);
      console.log('Product seller:', product.seller);
      console.log('User ID:', req.user.id);

      // Make sure user is product owner
      if (product.seller.toString() !== req.user.id) {
        return next(
          new ErrorResponse(
            `User ${req.user.id} is not authorized to update this product`,
            401
          )
        );
      }

      // Prepare the update data with proper type conversions
      const updateData = {};
      
      // Copy simple text fields
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.category) updateData.category = req.body.category;
      
      // Convert numeric fields
      if (req.body.price) updateData.price = Number(req.body.price);
      if (req.body.offerPrice) updateData.offerPrice = Number(req.body.offerPrice);
      if (req.body.stock) updateData.stock = Number(req.body.stock);

      // If there's a new image, update the image URL
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }
      
      // Handle description field specially
      // Look for description[0], description[1], etc. in the form data
      const descriptions = [];
      for (let i = 0; i < 10; i++) { // Check up to 10 description entries
        const key = `description[${i}]`;
        if (req.body[key]) {
          descriptions.push(req.body[key]);
        }
      }
      
      // If we found any descriptions, update the field
      if (descriptions.length > 0) {
        updateData.description = descriptions;
      } else if (req.body.description) {
        // Fallback: if description is sent as a single value
        updateData.description = [req.body.description];
      }

      // Log the final update data
      console.log('Final update data:', updateData);

      // Update the product
      product = await Product.findByIdAndUpdate(
        req.params.id, 
        updateData, 
        {
          new: true, // Return the updated document
          runValidators: true // Run schema validators
        }
      );

      if (!product) {
        return next(new ErrorResponse('Failed to update product', 500));
      }

      console.log('Updated product:', product);

      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (err) {
      console.error('Error updating product:', err);
      return next(new ErrorResponse(`Error updating product: ${err.message}`, 500));
    }
  })
];

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Seller
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    console.log('Delete request for product ID:', req.params.id);
    console.log('Current user ID:', req.user.id);
    
    // First, find the product to check ownership
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    // Log the found product for debugging
    console.log('Found product:', product);
    console.log('Product seller ID:', product.seller);
    
    // Make sure user is product owner
    if (product.seller.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this product`,
          401
        )
      );
    }

    // Use findByIdAndDelete instead of deprecated remove()
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted:', deletedProduct);
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    return next(new ErrorResponse(`Error deleting product: ${err.message}`, 500));
  }
});