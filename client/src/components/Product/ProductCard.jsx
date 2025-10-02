import React, { useState, useEffect } from 'react'
import { Edit, Trash2 } from 'lucide-react'

const ProductCard = ({ product, onEdit, onDelete }) => {
  const defaultImage = 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=No+Image'
  const [imageUrl, setImageUrl] = useState(product.image || defaultImage)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Reset image URL when product changes
    if (product.image) {
      setImageUrl(product.image)
      setImageError(false)
    } else {
      setImageUrl(defaultImage)
    }
  }, [product.image])

  const handleImageError = () => {
    console.log('Image failed to load, using default:', imageUrl)
    setImageError(true)
    setImageUrl(defaultImage)
  }

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageUrl)
    setImageError(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
      {/* Product Image */}
      <div className="h-48 bg-gray-100 overflow-hidden relative">
        <img 
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
        {imageError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Image not available</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
              title="Edit product"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              title="Delete product"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {product.description && (
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-green-600">
              ₹{parseFloat(product.price).toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Stock:</span>
            <span className={`font-semibold ${
              product.stock > 10 ? 'text-green-600' : 
              product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {product.stock} units
            </span>
          </div>
          
          {product.category && (
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="text-gray-800 font-medium">{product.category}</span>
            </div>
          )}
        </div>
        
        {/* Debug info - remove this after testing */}
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
          <div>Image URL: {product.image || 'No image'}</div>
          <div>Status: {imageError ? 'Failed to load' : 'Loaded'}</div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard