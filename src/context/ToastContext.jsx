import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext({
  addToast: () => {},
  removeToast: () => {},
  showSuccess: () => {},
  showError: () => {},
  showInfo: () => {}
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title = '', message = '', duration = 4500 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((message, title = 'Success') => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const showError = useCallback((message, title = 'Error') => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const showInfo = useCallback((message, title = 'Notification') => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showInfo }}>
      {children}
      
      {/* Fixed Toast Container */}
      <div 
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '420px',
          width: 'calc(100vw - 48px)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          
          const borderColor = isSuccess ? 'rgba(16, 185, 129, 0.45)' : (isError ? 'rgba(239, 68, 68, 0.45)' : 'rgba(223, 99, 38, 0.45)');
          const iconColor = isSuccess ? '#10b981' : (isError ? '#ef4444' : '#df6326');
          const titleColor = isSuccess ? '#10b981' : (isError ? '#f87171' : '#df6326');

          return (
            <div
              key={toast.id}
              role="alert"
              style={{
                pointerEvents: 'auto',
                backgroundColor: '#18110c',
                border: `1px solid ${borderColor}`,
                borderRadius: '14px',
                padding: '14px 16px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)',
                boxSizing: 'border-box'
              }}
            >
              {/* Icon */}
              <div style={{ color: iconColor, marginTop: '2px', flexShrink: 0 }}>
                {isSuccess ? <CheckCircle2 size={18} /> : (isError ? <AlertCircle size={18} /> : <Info size={18} />)}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                  <div style={{ fontSize: '13px', fontWeight: 800, color: titleColor, marginBottom: '2px' }}>
                    {toast.title}
                  </div>
                )}
                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.45' }}>
                  {toast.message}
                </div>
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px'
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
