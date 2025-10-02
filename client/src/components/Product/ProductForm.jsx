import React, { useState, useEffect } from 'react'
import { productAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import LoadingSpinner from '../UI/LoadingSpinner'

const ProductForm = ({ product = null, shopId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  })
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  // Default categories
  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Toys',
    'Food & Beverages',
    'Health',
    'Automotive',
    'Other'
  ]

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        image: product.image || ''
      })
    }
  }, [product])

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || '' : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
    
    // Reset image error when URL changes
    if (e.target.name === 'image') {
      setImageError(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageError(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        shop: shopId
      }

      if (product) {
        await productAPI.update(product._id, submitData)
        showToast('Product updated successfully!', 'success')
      } else {
        await productAPI.create(submitData)
        showToast('Product created successfully!', 'success')
      }
      onSuccess()
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {product ? 'Edit Product' : 'Create New Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product description"
          />
        </div>

        {/* Image URL Field */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Product Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste any image URL here..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Works with any image URL - JPG, PNG, GIF, WebP, etc.
          </p>
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
            <div className="flex justify-center">
              {imageError ? (
                <div className="max-h-40 w-full rounded-lg border bg-red-50 flex items-center justify-center p-4">
                  <p className="text-red-500 text-sm text-center">
                    Could not load image from this URL.<br/>
                    The image will still be saved and may work in the product list.
                  </p>
                </div>
              ) : (
                <img 
                  src={formData.image} 
                  alt="Product preview" 
                  className="max-h-40 rounded-lg object-cover border"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}
            </div>
            {!imageError && (
              <p className="text-xs text-green-600 mt-2 text-center">
                ✓ Image loaded successfully
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <LoadingSpinner size="small" /> : (product ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm