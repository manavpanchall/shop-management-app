import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { shopAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    recentShops: []
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [shopsResponse, shopsWithProductsResponse] = await Promise.all([
        shopAPI.getAll(),
        shopAPI.getWithProducts()
      ])

      // Handle different response formats
      const extractShopsArray = (response) => {
        if (Array.isArray(response.data)) return response.data
        if (response.data && Array.isArray(response.data.data)) return response.data.data
        if (response.data && response.data.success && Array.isArray(response.data.data)) return response.data.data
        if (response.data && typeof response.data === 'object') {
          return Object.values(response.data).find(val => Array.isArray(val)) || []
        }
        return []
      }

      const shops = extractShopsArray(shopsResponse)
      const shopsWithProducts = extractShopsArray(shopsWithProductsResponse)

      const totalProducts = shopsWithProducts.reduce((total, shop) => 
        total + (shop.products?.length || 0), 0
      )

      setStats({
        totalShops: shops.length,
        totalProducts,
        recentShops: shops.slice(0, 5)
      })
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      showToast('Failed to load dashboard data', 'error')
      setStats({
        totalShops: 0,
        totalProducts: 0,
        recentShops: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your shops and products.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shops</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalShops}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">🏪</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quick Actions</p>
              <div className="flex space-x-2 mt-2">
                <Link
                  to="/shops"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Manage Shops
                </Link>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">➕</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shops */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Shops</h2>
          <Link
            to="/shops"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            View All
          </Link>
        </div>

        {stats.recentShops.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4">🏪</span>
            <p className="text-gray-600">No shops created yet</p>
            <Link
              to="/shops"
              className="inline-block mt-2 text-blue-500 hover:text-blue-600 font-medium"
            >
              Create your first shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recentShops.map((shop) => (
              <div
                key={shop._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{shop.name}</h3>
                  {shop.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {shop.description}
                    </p>
                  )}
                </div>
                <Link
                  to={`/shops/${shop._id}`}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  View Products
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard