import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { productService } from '../api'
import toast from 'react-hot-toast'

const Products = () => {
   const { products, searchQuery } = useAppContext()
   const [filteredProducts, setFilteredProducts] = useState([])
   const [loading, setLoading] = useState(true)
   
   // Fetch all products when component mounts
   useEffect(() => {
     const fetchAllProducts = async () => {
       setLoading(true)
       try {
         const response = await productService.getProducts()
         if (response.success) {
           setFilteredProducts(response.data)
         }
       } catch (error) {
         toast.error('Failed to fetch products')
         console.error(error)
       } finally {
         setLoading(false)
       }
     }
     
     fetchAllProducts()
   }, [])
   
   // Filter products based on search query
   useEffect(() => {
     if (searchQuery.length > 0) {
       setFilteredProducts(products.filter(
         product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
       ))
     } else if (products.length > 0) {
       setFilteredProducts(products)
     }
   }, [products, searchQuery])
  return (
   
    <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium uppercase'>All products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product}/>
          ))
        ) : (
          <div className="col-span-full flex justify-center py-10">
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products