const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  description: {
    type: [String],
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  offerPrice: {
    type: Number,
    required: [true, 'Please add an offer price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Beverages']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);