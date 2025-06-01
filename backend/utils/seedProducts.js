const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

// Load env variables
dotenv.config({ path: './.env' });

// Sample product data by category
const productSeed = {
  Fruits: [
    {
      name: 'Organic Apples',
      description: ['Fresh organic apples', 'Rich in antioxidants', 'Perfect for snacking or baking'],
      price: 4.99,
      offerPrice: 3.99,
      stock: 100,
      image: '/uploads/apple.jpg',
    },
    {
      name: 'Bananas',
      description: ['Ripe yellow bananas', 'Rich in potassium', 'Great for smoothies'],
      price: 2.99,
      offerPrice: 2.49,
      stock: 150,
      image: '/uploads/banana.jpg',
    },
    {
      name: 'Strawberries',
      description: ['Sweet juicy strawberries', 'Locally grown', 'Perfect for desserts'],
      price: 5.99,
      offerPrice: 4.99,
      stock: 80,
      image: '/uploads/strawberry.jpg',
    }
  ],
  Vegetables: [
    {
      name: 'Fresh Spinach',
      description: ['Organic spinach leaves', 'Rich in iron', 'Great for salads and cooking'],
      price: 3.99,
      offerPrice: 3.49,
      stock: 90,
      image: '/uploads/spinach.jpg',
    },
    {
      name: 'Carrots',
      description: ['Organic carrots', 'High in beta-carotene', 'Sweet and crunchy'],
      price: 2.49,
      offerPrice: 1.99,
      stock: 120,
      image: '/uploads/carrot.jpg',
    },
    {
      name: 'Bell Peppers',
      description: ['Mixed color bell peppers', 'Sweet and crunchy', 'Perfect for stir-fries'],
      price: 4.49,
      offerPrice: 3.79,
      stock: 75,
      image: '/uploads/bellpepper.jpg',
    }
  ],
  Dairy: [
    {
      name: 'Organic Milk',
      description: ['Fresh organic whole milk', 'Hormone-free', 'Rich and creamy'],
      price: 4.99,
      offerPrice: 4.49,
      stock: 60,
      image: '/uploads/milk.jpg',
    },
    {
      name: 'Greek Yogurt',
      description: ['Creamy Greek yogurt', 'High in protein', 'Perfect for breakfast or snacking'],
      price: 5.99,
      offerPrice: 5.29,
      stock: 85,
      image: '/uploads/yogurt.jpg',
    },
    {
      name: 'Cheddar Cheese',
      description: ['Aged cheddar cheese', 'Rich and sharp flavor', 'Great for sandwiches and cooking'],
      price: 6.99,
      offerPrice: 5.99,
      stock: 70,
      image: '/uploads/cheese.jpg',
    }
  ],
  Meat: [
    {
      name: 'Grass-fed Beef',
      description: ['Premium grass-fed beef', 'Hormone-free', 'Lean and flavorful'],
      price: 12.99,
      offerPrice: 11.49,
      stock: 50,
      image: '/uploads/beef.jpg',
    },
    {
      name: 'Organic Chicken Breast',
      description: ['Free-range chicken breast', 'Hormone-free', 'High in protein'],
      price: 9.99,
      offerPrice: 8.99,
      stock: 65,
      image: '/uploads/chicken.jpg',
    },
    {
      name: 'Wild Salmon',
      description: ['Wild-caught salmon fillets', 'Rich in omega-3', 'Sustainably sourced'],
      price: 15.99,
      offerPrice: 13.99,
      stock: 40,
      image: '/uploads/salmon.jpg',
    }
  ],
  Bakery: [
    {
      name: 'Sourdough Bread',
      description: ['Artisan sourdough bread', 'Freshly baked daily', 'No preservatives'],
      price: 5.99,
      offerPrice: 4.99,
      stock: 30,
      image: '/uploads/sourdough.jpg',
    },
    {
      name: 'Chocolate Croissants',
      description: ['Buttery chocolate croissants', 'Freshly baked', 'Perfect with coffee'],
      price: 7.99,
      offerPrice: 6.99,
      stock: 45,
      image: '/uploads/croissant.jpg',
    },
    {
      name: 'Whole Grain Muffins',
      description: ['Healthy whole grain muffins', 'Low sugar', 'Great for breakfast'],
      price: 6.49,
      offerPrice: 5.49,
      stock: 55,
      image: '/uploads/muffin.jpg',
    }
  ],
  Beverages: [
    {
      name: 'Cold Brew Coffee',
      description: ['Smooth cold brew coffee', 'Low acidity', 'Rich flavor'],
      price: 4.99,
      offerPrice: 4.29,
      stock: 40,
      image: '/uploads/coldbrew.jpg',
    },
    {
      name: 'Fresh Orange Juice',
      description: ['Freshly squeezed orange juice', 'No added sugar', 'Rich in vitamin C'],
      price: 5.99,
      offerPrice: 4.99,
      stock: 35,
      image: '/uploads/orangejuice.jpg',
    },
    {
      name: 'Sparkling Water',
      description: ['Refreshing sparkling water', 'Zero calories', 'No artificial flavors'],
      price: 2.99,
      offerPrice: 2.49,
      stock: 90,
      image: '/uploads/sparklingwater.jpg',
    }
  ]
};

// Create sample product images
const createDummyImages = async () => {
  // This is a simplified example to create the uploads directory and dummy image placeholders
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(__dirname, '../uploads');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  // Create dummy image placeholders if they don't exist
  const imageFiles = [
    'apple.jpg', 'banana.jpg', 'strawberry.jpg',
    'spinach.jpg', 'carrot.jpg', 'bellpepper.jpg',
    'milk.jpg', 'yogurt.jpg', 'cheese.jpg',
    'beef.jpg', 'chicken.jpg', 'salmon.jpg',
    'sourdough.jpg', 'croissant.jpg', 'muffin.jpg',
    'coldbrew.jpg', 'orangejuice.jpg', 'sparklingwater.jpg'
  ];
  
  for (const file of imageFiles) {
    const filePath = path.join(uploadsDir, file);
    if (!fs.existsSync(filePath)) {
      // Create an empty file as a placeholder
      fs.writeFileSync(filePath, '');
      console.log(`Created placeholder for ${file}`);
    }
  }
};

// Seed database with products
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Create dummy images
    await createDummyImages();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Find or create a seller user
    let seller = await User.findOne({ role: 'seller' });
    
    if (!seller) {
      seller = await User.create({
        name: 'Demo Seller',
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller'
      });
      console.log('Created demo seller account');
    }
    
    // Add products for each category
    for (const category in productSeed) {
      for (const product of productSeed[category]) {
        await Product.create({
          ...product,
          category,
          seller: seller._id
        });
      }
      console.log(`Added ${productSeed[category].length} products to ${category} category`);
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
