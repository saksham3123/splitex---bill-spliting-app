import { useState, useEffect, useRef } from 'react';
import './Toast.css';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toasts, addToast };
}

export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

function Toast({ message, type }) {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  return (
    <div className={`toast toast-${type} animate-slide`}>
      <span className="toast-icon">{icons[type] || icons.info}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}
