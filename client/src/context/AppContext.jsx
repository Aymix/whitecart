import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyAddress } from "../assets/img/assets";
import toast from "react-hot-toast";
import { authService, productService, orderService } from "../api";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [orders, setOrders] = useState(() => {
    const storedOrders = localStorage.getItem('orders');
    return storedOrders ? JSON.parse(storedOrders) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products');
      console.error('Error fetching products:', error);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        // Fetch user profile after successful login
        const userProfile = await authService.getCurrentUser();
        if (userProfile.success) {
          const userData = userProfile.data;
          setUser(userData);
          setIsSeller(userData.role === 'seller');
          localStorage.setItem('user', JSON.stringify(userData));
          toast.success(`Welcome back, ${userData.name}!`);
          return true;
        }
      }
      return false;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsSeller(false);
      localStorage.removeItem('user');
      toast.success("You've been logged out");
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Logout failed');
      console.error('Logout error:', error);
    }
  };

  // Add product to cart 
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  // Update cart item quantity 
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  // Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      delete cartData[itemId];
      setCartItems(cartData);
      toast.success("Removed from Cart");
    }
  };

  // Get total count of items in cart
  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  // Get total amount of items in cart
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // Add a new order
  const addOrder = async (orderData) => {
    try {
      // Prepare order data for API
      const apiOrderData = {
        items: Object.entries(cartItems).map(([productId, quantity]) => {
          const product = products.find(p => p._id === productId);
          return {
            product: productId,
            quantity,
            price: product.offerPrice
          };
        }),
        totalAmount: getCartAmount(),
        shippingAddress: orderData.shippingAddress || orderData.deliveryAddress
      };

      // Create order via API
      const response = await orderService.createOrder(apiOrderData);
      
      if (response.success) {
        // Update local orders state
        const newOrder = response.data;
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        
        // Clear cart after placing order
        setCartItems({});
        
        toast.success("Order placed successfully!");
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
      console.error('Order creation error:', error);
      return false;
    }
  };

  // Get orders for current user
  const getUserOrders = async () => {
    if (!user) return [];
    
    try {
      const response = await orderService.getMyOrders();
      if (response.success) {
        setOrders(response.data);
        return response.data;
      }
      return [];
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', error);
      return [];
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    login,
    logout,
    setIsSeller,
    isSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    addOrder,
    orders,
    getUserOrders,
    addresses: dummyAddress
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};