import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './ToastContainer.css';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(toast => {
        let Icon = Info;
        let borderClass = 'toast-info';
        if (toast.type === 'success') {
          Icon = CheckCircle;
          borderClass = 'toast-success';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'toast-warning';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'toast-error';
        }

        return (
          <div key={toast.id} className={`toast-item ${borderClass}`}>
            <Icon size={16} className="toast-icon" />
            <span className="toast-message">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
