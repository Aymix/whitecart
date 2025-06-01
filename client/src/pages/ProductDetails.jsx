import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/img/assets";

const ProductDetails = () => {
    const { products, navigate, currency, addToCart } = useAppContext();
    const { id } = useParams();
    const decodedId = decodeURIComponent(id).trim(); // Décodage et nettoyage de l'ID
    
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Trouver le produit correspondant
    const product = products.find((item) => 
        item._id && item._id.toString() === decodedId
    );

    useEffect(() => {
        if (products.length > 0) {
            setIsLoading(false);
            
            if (product) {
                // Set thumbnail only if it hasn't been set yet or if product changed
                if (!thumbnail && product.image?.length > 0) {
                    setThumbnail(product.image[0]);
                }
                
                // Find related products only if they haven't been loaded yet
                if (relatedProducts.length === 0) {
                    const related = products.filter(item => 
                        item.category === product.category && 
                        item._id !== product._id
                    ).slice(0, 5);
                    setRelatedProducts(related);
                }
            }
        }
    }, [products, product]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Loading product...</h2>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="flex-grow flex items-center justify-center p-8">
                    <div className="text-center max-w-2xl">
                        <h1 className="text-4xl font-bold mb-4">GreenCart</h1>
                        <h2 className="text-2xl font-semibold mb-6">Product not found</h2>
                        <p className="text-lg mb-8">
                            We couldn't find the product you're looking for. It might have been removed or the link might be incorrect.
                        </p>
                        <Link 
                            to="/products" 
                            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>

                <footer className="bg-gray-100 p-8 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                {['Home', 'Best Sellers', 'Offers & Deals', 'Contact Us', 'FAQs'].map((item) => (
                                    <li key={item}>
                                        <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-green-500">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-bold mb-4">Need help?</h4>
                            <ul className="space-y-2">
                                {['Delivery Information', 'Return & Refund Policy', 'Payment Methods', 'Track your Order', 'Contact Us'].map((item) => (
                                    <li key={item}>
                                        <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-green-500">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-bold mb-4">Follow Us</h4>
                            <ul className="space-y-2">
                                {['Instagram', 'Twitter', 'Facebook', 'YouTube'].map((item) => (
                                    <li key={item}>
                                        <a href={`https://${item.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer" className="hover:text-green-500">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        Copyright © {new Date().getFullYear()} GreenStack.dev All Rights Reserved.
                    </p>
                </footer>
            </div>
        );
    }

    return (
        <div className="mt-12 px-4 md:px-8">
            {/* Breadcrumb navigation */}
            <p className="text-sm">
                <Link to="/" className="hover:text-indigo-500">Home</Link> /
                <Link to="/products" className="hover:text-indigo-500"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-indigo-500"> {product.category}</Link> /
                <span className="text-indigo-500"> {product.name}</span>
            </p>

            {/* Product main content */}
            <div className="flex flex-col md:flex-row gap-16 mt-8">
                {/* Product images */}
                <div className="flex gap-6 w-full md:w-1/2">
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-4">
                        {product.image.map((image, index) => (
                            <div 
                                key={index} 
                                onClick={() => setThumbnail(image)} 
                                className={`border-2 ${thumbnail === image ? 'border-indigo-500' : 'border-gray-200'} rounded-lg overflow-hidden cursor-pointer w-20 h-20`}
                            >
                                <img 
                                    src={image || '/img/placeholder-image.jpg'} 
                                    alt={`Thumbnail ${index + 1}`} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = '/img/placeholder-image.jpg';
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Main image */}
                    <div className="flex-1 border-2 border-gray-200 rounded-lg overflow-hidden">
                        <img 
                            src={thumbnail || product.image[0] || '/img/placeholder-image.jpg'} 
                            alt={product.name} 
                            className="w-full h-full object-contain max-h-[500px]"
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = '/img/placeholder-image.jpg';
                            }}
                        />
                    </div>
                </div>

                {/* Product details */}
                <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-bold">{product.name}</h1>

                    {/* Ratings */}
                    <div className="flex items-center mt-3">
                        {Array(5).fill('').map((_, i) => (
                            <img 
                                key={i}
                                src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                                alt="star"
                                className="w-5 h-5"
                            />
                        ))}
                        <span className="ml-2 text-gray-600">(4 customer reviews)</span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-6">
                        {product.price > product.offerPrice && (
                            <p className="text-gray-500 line-through text-lg">
                                {currency}{product.price.toFixed(2)}
                            </p>
                        )}
                        <p className="text-2xl font-bold text-indigo-600">
                            {currency}{product.offerPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">(Inclusive of all taxes)</p>
                    </div>

                    {/* Description */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-3">About this product</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            {product.description.map((desc, index) => (
                                <li key={index} className="text-gray-700">{desc}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                        <button
                            onClick={() => {
                                addToCart(product._id);
                                navigate("/cart");
                            }}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => addToCart(product._id)}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">You may also like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {relatedProducts.map((item) => (
                            <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                                <Link to={`/products/${item._id}`}>
                                    <img 
                                        src={item.image && item.image[0] ? item.image[0] : '/img/placeholder-image.jpg'} 
                                        alt={item.name} 
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = '/img/placeholder-image.jpg';
                                        }}
                                    />
                                    <div className="p-4">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-indigo-600 font-bold mt-2">
                                            {currency}{item.offerPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;