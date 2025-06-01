import React from 'react';
import Navbar from './components/nvbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/home';
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import Products from './pages/products';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import Contact from './pages/Contact';
import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import SellerDashboard from './pages/SellerDashboard';

const App = () => {
    const location = useLocation();
    const isSellerPath = location.pathname.includes("seller");
    const { showUserLogin } = useAppContext(); 
    
    return (
        <div>
            {isSellerPath ? null : <Navbar />}
            {showUserLogin ? <Login /> : null}
            <Toaster />
            <div className={isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/products' element={<Products />} />
                    <Route path='/products/:category' element={<ProductCategory />} />
                    <Route path='/products/:category/:id' element={<ProductDetails />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/my-orders' element={<MyOrders />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/seller-login' element={<SellerLogin />} />
                    <Route path='/seller-register' element={<SellerRegister />} />
                    <Route path='/seller-dashboard' element={<SellerDashboard />} />
                </Routes>
            </div>
            {isSellerPath ? null : <Footer />}
        </div>
    );
}

export default App;