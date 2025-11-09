import { createContext, useContext, useState } from 'react';

// Create the context
const ToastContext = createContext();

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function to add a new toast
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  // Function to remove a toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value = {
    toasts,
    addToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-lg shadow-lg border-l-4 flex items-center gap-3 min-w-80 max-w-md transform transition-all duration-300 ${
              toast.type === 'success' 
                ? 'bg-green-500 text-white border-green-600' 
                : toast.type === 'error'
                ? 'bg-red-500 text-white border-red-600'
                : toast.type === 'warning'
                ? 'bg-yellow-500 text-white border-yellow-600'
                : 'bg-blue-500 text-white border-blue-600'
            }`}
            style={{
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <span className="text-lg">
              {toast.type === 'success' ? '✅' :
               toast.type === 'error' ? '❌' :
               toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white hover:text-gray-200 text-lg font-bold transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add CSS animation if Tailwind animations aren't working */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastContext;