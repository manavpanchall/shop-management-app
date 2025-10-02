import React from 'react'
import { useToast } from '../../context/ToastContext'
import { X } from 'lucide-react'

const Toast = () => {
  const { toast, hideToast } = useToast()

  if (!toast) return null

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[toast.type] || 'bg-gray-500'

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4 min-w-80`}>
        <div className="flex-1">
          {toast.message}
        </div>
        <button
          onClick={hideToast}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default Toast