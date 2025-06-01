import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { dummyAddress } from "../assets/img/assets";
import toast from "react-hot-toast";

const Cart = () => {
    const { 
        products, 
        currency, 
        cartItems, 
        removeFromCart, 
        updateCartItem, 
        navigate, 
        getCartCount,
        addOrder,
        user
    } = useAppContext();
    
    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState(dummyAddress);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]);
    const [paymentOption, setPaymentOption] = useState("COD");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [addAddressMode, setAddAddressMode] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: "",
        address: "",
        phone: "",
        city: "",
        zip: ""
    });
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: ""
    });
    const [captcha, setCaptcha] = useState("");
    const [userCaptcha, setUserCaptcha] = useState("");
    const [captchaError, setCaptchaError] = useState(false);

    // Calculate cart totals
    const subtotal = cartArray.reduce((sum, item) => sum + (item.offerPrice * item.quantity), 0);
    const tax = subtotal * 0.02;
    const total = subtotal + tax;
    const itemCount = getCartCount();

    // Build cart array from cartItems
    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key);
            if (product) {
                product.quantity = cartItems[key];
                tempArray.push(product);
            }
        }
        setCartArray(tempArray);
    };

    // Handle quantity changes
    const handleQuantityChange = (productId, newQuantity) => {
        updateCartItem(productId, parseInt(newQuantity));
    };

    // Remove item from cart
    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    // Create order data
    const createOrderData = () => {
        return {
            items: cartArray,
            total: total,
            currency: currency,
            paymentMethod: paymentOption,
            shippingAddress: selectedAddress.address,
            userId: user ? user.id : 'guest',
            status: 'Processing'
        };
    };

    // Place order handler
    const handlePlaceOrder = () => {
        // Ensure there's a valid address selected
        if (!selectedAddress || !selectedAddress.address) {
            toast.error("Please select a shipping address");
            setShowAddress(true);
            return;
        }
        
        const orderData = createOrderData();
        
        // Double-check that shippingAddress is properly set
        if (!orderData.shippingAddress) {
            orderData.shippingAddress = selectedAddress.address;
        }
        
        console.log('Order data before sending:', orderData); // Debug log
        
        if (paymentOption === "Online") {
            setShowPaymentForm(true);
        } else {
            // Add COD order
            addOrder(orderData);
            setOrderPlaced(true);
            setTimeout(() => {
                navigate("/my-orders"); // Fixed navigation path
            }, 3000);
        }
    };

    // Handle online payment
    const handleOnlinePayment = (e) => {
        e.preventDefault();
        
        // Validate CAPTCHA
        if (userCaptcha !== captcha) {
            setCaptchaError(true);
            return;
        }
        
        // Add online payment order
        const orderData = createOrderData();
        addOrder(orderData);
        
        setOrderPlaced(true);
        setTimeout(() => {
            navigate("/orders");
        }, 3000);
    };

    // Handle address input changes
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        if (addAddressMode) {
            setNewAddress(prev => ({ ...prev, [name]: value }));
        } else {
            setSelectedAddress(prev => ({ ...prev, [name]: value }));
        }
    };

    // Save new address
    const saveNewAddress = () => {
        const addressToSave = {
            id: addresses.length + 1,
            ...newAddress
        };
        setAddresses([...addresses, addressToSave]);
        setSelectedAddress(addressToSave);
        setAddAddressMode(false);
        setNewAddress({ name: "", address: "", phone: "", city: "", zip: "" });
    };

    // Generate new CAPTCHA
    const generateCaptcha = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
        setUserCaptcha("");
        setCaptchaError(false);
    };

    // Load cart when products or cartItems change
    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    // Generate initial CAPTCHA
    useEffect(() => {
        generateCaptcha();
    }, []);

    // Order placed confirmation screen
    if (orderPlaced) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                        Your order has been placed and will be delivered to:
                        <br />
                        <span className="font-medium">{selectedAddress.address}</span>
                    </p>
                    <p className="text-gray-600 mb-8">
                        Payment Method: <span className="font-medium">
                            {paymentOption === "COD" ? "Cash on Delivery" : "Online Payment"}
                        </span>
                    </p>
                    <button 
                        onClick={() => navigate("/orders")}
                        className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                        View Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-4 mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-indigo-500">{itemCount} Items</span>
                </h1>

                {cartArray.length === 0 ? (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold mt-4 mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                            <p className="text-left">Product Details</p>
                            <p className="text-center">Price</p>
                            <p className="text-center">Quantity</p>
                            <p className="text-center">Subtotal</p>
                        </div>

                        {cartArray.map((product) => (
                            <div key={product._id} className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center py-6 border-b border-gray-200">
                                <div className="flex items-center gap-4 col-span-2 md:col-span-1">
                                    <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={product.image[0]} 
                                            alt={product.name} 
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-gray-500 text-sm">{product.category}</p>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <p className="font-medium">{currency}{product.offerPrice.toFixed(2)}</p>
                                </div>
                                
                                <div className="flex items-center justify-center">
                                    <select 
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1 outline-none"
                                    >
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-center">
                                        {currency}{(product.offerPrice * product.quantity).toFixed(2)}
                                    </p>
                                    <button 
                                        onClick={() => handleRemoveItem(product._id)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button 
                            onClick={() => navigate("/products")}
                            className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
                        >
                            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="#615fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Continue Shopping
                        </button>
                    </>
                )}
            </div>

            {cartArray.length > 0 && (
                <div className="max-w-md w-full bg-gray-50 p-6 border border-gray-200 rounded-lg mt-8 md:mt-0 md:ml-8">
                    {showPaymentForm ? (
                        <div>
                            <h2 className="text-xl font-bold mb-6">Online Payment</h2>
                            
                            <form onSubmit={handleOnlinePayment}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={paymentDetails.cardNumber}
                                        onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="cardName"
                                        value={paymentDetails.cardName}
                                        onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={paymentDetails.expiry}
                                            onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={paymentDetails.cvv}
                                            onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                                            placeholder="123"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-gray-700">Security Code</label>
                                        <button 
                                            type="button"
                                            onClick={generateCaptcha}
                                            className="text-indigo-600 text-sm hover:underline"
                                        >
                                            Refresh
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-200 border border-gray-300 rounded-lg py-2 px-4 font-mono text-lg tracking-wider">
                                            {captcha}
                                        </div>
                                        <input
                                            type="text"
                                            value={userCaptcha}
                                            onChange={(e) => {
                                                setUserCaptcha(e.target.value);
                                                setCaptchaError(false);
                                            }}
                                            placeholder="Enter code"
                                            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                                captchaError ? "border-red-500" : "border-gray-300"
                                            }`}
                                            required
                                        />
                                    </div>
                                    {captchaError && (
                                        <p className="text-red-500 text-sm mt-1">Security code is incorrect</p>
                                    )}
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
                                    >
                                        Pay Now
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentForm(false)}
                                        className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : addAddressMode ? (
                        <div>
                            <h2 className="text-xl font-bold mb-6">Add New Address</h2>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newAddress.name}
                                    onChange={handleAddressChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Address</label>
                                <textarea
                                    name="address"
                                    value={newAddress.address}
                                    onChange={handleAddressChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                    placeholder="Street address, apartment, suite, etc."
                                ></textarea>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={newAddress.city}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="New York"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={newAddress.zip}
                                        onChange={handleAddressChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="10001"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={newAddress.phone}
                                    onChange={handleAddressChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={saveNewAddress}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
                                >
                                    Save Address
                                </button>
                                <button
                                    onClick={() => setAddAddressMode(false)}
                                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="font-medium">Delivery Address</p>
                                    <button 
                                        onClick={() => setShowAddress(!showAddress)} 
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Change
                                    </button>
                                </div>
                                
                                {showAddress ? (
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <div 
                                                key={address.id}
                                                onClick={() => {
                                                    setSelectedAddress(address);
                                                    setShowAddress(false);
                                                }}
                                                className={`p-4 border rounded-lg cursor-pointer ${
                                                    selectedAddress.id === address.id 
                                                        ? "border-indigo-600 bg-indigo-50" 
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                <p className="font-medium">{address.name}</p>
                                                <p className="text-gray-600">{address.address}</p>
                                                <p className="text-gray-600">{address.phone}</p>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => setAddAddressMode(true)}
                                            className="w-full py-2 text-center border-2 border-dashed border-gray-300 rounded-lg text-indigo-600 hover:bg-gray-100"
                                        >
                                            + Add New Address
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 border border-gray-300 rounded-lg">
                                        <p className="font-medium">{selectedAddress.name}</p>
                                        <p className="text-gray-600">{selectedAddress.address}</p>
                                        <p className="text-gray-600">{selectedAddress.phone}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <p className="font-medium mb-3">Payment Method</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentOption("COD")}
                                        className={`p-4 border rounded-lg text-center ${
                                            paymentOption === "COD"
                                                ? "border-indigo-600 bg-indigo-50"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <span className="block font-medium">Cash on Delivery</span>
                                        <span className="text-sm text-gray-600">Pay when received</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentOption("Online")}
                                        className={`p-4 border rounded-lg text-center ${
                                            paymentOption === "Online"
                                                ? "border-indigo-600 bg-indigo-50"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <span className="block font-medium">Online Payment</span>
                                        <span className="text-sm text-gray-600">Card/UPI/Wallet</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (2%)</span>
                                    <span className="font-medium">{currency}{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-300">
                                    <span className="font-bold">Total</span>
                                    <span className="text-xl font-bold text-indigo-600">{currency}{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
                            >
                                {paymentOption === "COD" ? "Place Order" : "Proceed to Payment"}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Cart;