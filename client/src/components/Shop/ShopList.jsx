import React from 'react'
import ShopCard from './ShopCard'

const ShopList = ({ shops, onEditShop, onDeleteShop, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  const shopsArray = Array.isArray(shops) ? shops : []

  if (shopsArray.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏪</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No shops found</h3>
        <p className="text-gray-500">Create your first shop to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shopsArray.map((shop) => (
        <ShopCard
          key={shop._id}
          shop={shop}
          onEdit={onEditShop}
          onDelete={onDeleteShop}
        />
      ))}
    </div>
  )
}

export default ShopList