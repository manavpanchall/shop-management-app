import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { shopAPI, productAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import ProductList from '../components/Product/ProductList'
import ProductForm from '../components/Product/ProductForm'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const ShopDetailPage = () => {
  const { shopId } = useParams()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { showToast } = useToast()

  useEffect(() => {
    if (shopId) {
      fetchShopAndProducts()
    }
  }, [shopId])

  useEffect(() => {
    // Filter products based on selected category
    if (selectedCategory === 'all') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory))
    }
  }, [products, selectedCategory])

  const fetchShopAndProducts = async () => {
    try {
      setLoading(true)
      const [shopResponse, productsResponse] = await Promise.all([
        shopAPI.getById(shopId),
        productAPI.getByShop(shopId)
      ])

      const shopData = shopResponse.data.data || shopResponse.data
      const productsData = Array.isArray(productsResponse.data) ? productsResponse.data :
        productsResponse.data.data || []

      setShop(shopData)
      setProducts(productsData)
      setFilteredProducts(productsData)
    } catch (error) {
      showToast('Failed to load shop details', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category).filter(Boolean))]

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setShowProductForm(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleProductFormSuccess = () => {
    setShowProductForm(false)
    setEditingProduct(null)
    fetchShopAndProducts()
  }

  const handleProductFormCancel = () => {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId)
        showToast('Product deleted successfully!', 'success')
        fetchShopAndProducts()
      } catch (error) {
        showToast('Failed to delete product', 'error')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Shop not found</h2>
        <Link to="/shops" className="text-blue-500 hover:text-blue-600">
          Back to Shops
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link
          to="/shops"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span>←</span>
          <span>Back to Shops</span>
        </Link>
      </div>

      {/* Shop Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{shop.name}</h1>
            {shop.description && (
              <p className="text-gray-600 mt-2">{shop.description}</p>
            )}
          </div>
          <button
            onClick={handleCreateProduct}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span>+</span>
            <span>Add Product</span>
          </button>
        </div>

        {/* Shop Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          {shop.address && (
            <div className="flex items-center space-x-3 text-gray-600">
              <span>📍</span>
              <span>{shop.address}</span>
            </div>
          )}
          {shop.phone && (
            <div className="flex items-center space-x-3 text-gray-600">
              <span>📞</span>
              <span>{shop.phone}</span>
            </div>
          )}
          {shop.email && (
            <div className="flex items-center space-x-3 text-gray-600">
              <span>✉️</span>
              <span>{shop.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Form */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          shopId={shopId}
          onSuccess={handleProductFormSuccess}
          onCancel={handleProductFormCancel}
        />
      )}

      {/* Products Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Products ({filteredProducts.length})
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Category Filter */}
            {categories.length > 1 && (
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Filter:
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-auto"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleCreateProduct}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm justify-center w-full sm:w-auto"
            >
              <span>+</span>
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <ProductList
          products={filteredProducts}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          loading={false}
        />
      </div>
    </div>
  )
}

export default ShopDetailPage