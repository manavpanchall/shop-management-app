import React, { useState, useEffect } from 'react'
import { productAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import ProductList from '../components/Product/ProductList'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll()
      setProducts(response.data)
    } catch (error) {
      showToast('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product) => {
    // For now, redirect to shop detail page
    window.location.href = `/shops/${product.shop}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
        <p className="text-gray-600 mt-1">
          Browse all products across all your shops
        </p>
      </div>

      {/* Products List */}
      <ProductList
        products={products}
        onEditProduct={handleEditProduct}
        loading={loading}
      />
    </div>
  )
}

export default ProductsPage