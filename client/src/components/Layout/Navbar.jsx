import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully', 'success')
    setIsMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
            <span>🏪</span>
            <span className="hidden sm:inline">ShopManager</span>
          </Link>

          {/* Mobile menu button */}
          {isAuthenticated && (
            <div className="sm:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 transition-colors p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-1 transition-colors ${
                  isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span>👤</span>
                <span>Dashboard</span>
              </Link>
              <Link
                to="/shops"
                className={`flex items-center space-x-1 transition-colors ${
                  isActive('/shops') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span>🏪</span>
                <span>Shops</span>
              </Link>
            </div>
          )}

          {/* User Info & Logout - Desktop */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-gray-700 text-sm lg:text-base">Hello, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          {isMenuOpen && isAuthenticated && (
            <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-t sm:hidden z-50">
              <div className="px-4 py-4 space-y-4">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition-colors ${
                    isActive('/') ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  👤 Dashboard
                </Link>
                <Link
                  to="/shops"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg transition-colors ${
                    isActive('/shops') ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🏪 Shops
                </Link>
                <div className="pt-4 border-t">
                  <p className="px-3 py-2 text-gray-700">Hello, {user?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 px-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar