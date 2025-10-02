import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Layout/Navbar'
import Toast from './components/UI/Toast'
import ProtectedRoute from './components/Layout/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ShopsPage from './pages/ShopsPage'
import ShopDetailPage from './pages/ShopDetailPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Toast />
            <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/shops" element={
                  <ProtectedRoute>
                    <ShopsPage />
                  </ProtectedRoute>
                } />
                <Route path="/shops/:shopId" element={
                  <ProtectedRoute>
                    <ShopDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/products" element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

export default App