import React from 'react'
import ProductCard from './ProductCard'

const ProductList = ({ products, onEditProduct, onDeleteProduct, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-pulse">
            <div className="h-32 sm:h-48 bg-gray-200 rounded mb-3 sm:mb-4"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  const productsArray = Array.isArray(products) ? products : []

  if (productsArray.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No products found</h3>
        <p className="text-gray-500 text-sm sm:text-base">Create your first product for this shop!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {productsArray.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  )
}

export default ProductList