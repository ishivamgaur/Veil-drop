import React from 'react';

/**
 * Toast Container Component
 * Renders non-intrusive floating feedback toasts for interactions and network events.
 */
export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div id="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" onClick={() => removeToast(toast.id)}>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
