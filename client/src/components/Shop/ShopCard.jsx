import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react'

const ShopCard = ({ shop, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2">{shop.name}</h3>
          <div className="flex space-x-2 flex-shrink-0 ml-2">
            <button
              onClick={() => onEdit(shop)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
              title="Edit shop"
            >
              <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={() => onDelete(shop._id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete shop"
            >
              <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
        
        {shop.description && (
          <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-sm">{shop.description}</p>
        )}
        
        <div className="space-y-2 text-sm text-gray-600">
          {shop.address && (
            <div className="flex items-start space-x-2">
              <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2 text-xs sm:text-sm">{shop.address}</span>
            </div>
          )}
          
          {shop.phone && (
            <div className="flex items-center space-x-2">
              <Phone size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{shop.phone}</span>
            </div>
          )}
          
          {shop.email && (
            <div className="flex items-start space-x-2">
              <Mail size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1 text-xs sm:text-sm">{shop.email}</span>
            </div>
          )}
        </div>

        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-500">
            {shop.productsCount || 0} products
          </span>
          <Link
            to={`/shops/${shop._id}`}
            className="bg-blue-500 text-white px-3 py-2 rounded-md text-xs sm:text-sm hover:bg-blue-600 transition-colors text-center"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ShopCard