import React, { useState, useEffect } from 'react'
import { shopAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import ShopList from '../components/Shop/ShopList'
import ShopForm from '../components/Shop/ShopForm'

const ShopsPage = () => {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingShop, setEditingShop] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      const response = await shopAPI.getAll()

      let shopsData = []

      if (Array.isArray(response.data)) {
        shopsData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        shopsData = response.data.data
      } else {
        shopsData = []
      }

      const shopsWithCount = shopsData.map(shop => ({
        ...shop,
        productsCount: 0
      }))

      setShops(shopsWithCount)
    } catch (error) {
      console.error('Fetch shops error:', error)
      showToast('Failed to load shops', 'error')
      setShops([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShop = () => {
    setEditingShop(null)
    setShowForm(true)
  }

  const handleEditShop = (shop) => {
    setEditingShop(shop)
    setShowForm(true)
  }

  const handleDeleteShop = async (shopId) => {
    if (window.confirm('Are you sure you want to delete this shop? All products in this shop will also be deleted.')) {
      try {
        await shopAPI.delete(shopId)
        showToast('Shop deleted successfully!', 'success')
        fetchShops() // Refresh the list
      } catch (error) {
        showToast('Failed to delete shop', 'error')
      }
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingShop(null)
    fetchShops()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingShop(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Shops</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your shops and their products</p>
        </div>
        <button
          onClick={handleCreateShop}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center"
        >
          <span>+</span>
          <span>Add Shop</span>
        </button>
      </div>

      {/* Shop Form */}
      {showForm && (
        <ShopForm
          shop={editingShop}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Shops List */}
      <ShopList
        shops={shops}
        onEditShop={handleEditShop}
        onDeleteShop={handleDeleteShop}
        loading={loading}
      />
    </div>
  )
}

export default ShopsPage