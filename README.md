# WhiteCart

WhiteCart is a full-stack e-commerce platform with a modern React frontend and Node.js/Express backend. The application allows users to browse products, make purchases, and track orders, while also providing a seller dashboard for merchants to manage their products and sales.

## Project Structure

The project is organized into two main directories:

### Backend (`/backend`)
- **Node.js/Express** REST API
- **MongoDB** database with Mongoose ORM
- JWT authentication and authorization
- Stripe payment integration
- File uploads with Multer and Cloudinary
- Structured with MVC pattern:
  - `/controllers` - Request handlers
  - `/models` - Database schemas
  - `/routes` - API endpoints
  - `/middleware` - Custom middleware
  - `/config` - Configuration files
  - `/utils` - Helper functions

### Frontend (`/client`)
- **React 19** with hooks and context API
- **React Router** for navigation
- **TailwindCSS** for styling
- **Vite** as the build tool
- Organized by feature:
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/context` - React context providers
  - `/api` - API service functions
  - `/assets` - Static assets

## Features

- User authentication (login, register)
- Product browsing and filtering
- Shopping cart functionality
- Order processing and history
- Secure payment integration with Stripe
- Seller dashboard for merchants
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd whitecart
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Configure environment variables
   Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRE=30d
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. Install frontend dependencies
   ```
   cd ../client
   npm install
   ```

5. Set up frontend environment
   Create a `.env` file in the client directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run server
   ```

2. Start the frontend development server
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create a new product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### Orders
- `GET /api/orders` - Get all orders (for current user)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update order status (seller only)

### Payments
- `POST /api/payment/create-payment-intent` - Create payment intent with Stripe

### Sellers
- `POST /api/sellers/register` - Register as a seller
- `POST /api/sellers/login` - Login as a seller
- `GET /api/sellers/products` - Get seller's products
- `GET /api/sellers/orders` - Get orders for seller's products

## Technologies Used

### Backend
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt.js
- Stripe API
- Cloudinary
- Multer

### Frontend
- React 19
- React Router Dom 7
- Axios
- TailwindCSS 4
- React Hot Toast
- Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Stripe](https://stripe.com/)
- [Cloudinary](https://cloudinary.com/)