import React, { useEffect } from 'react';
import logo from '../HomePage/main_logo.png';

export const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="toast show position-fixed top-0 end-0 m-3" 
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
      style={{ 
        zIndex: 9999,
        minWidth: '300px',
        backgroundColor: 'white',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="toast-header bg-primary text-white">
        <img src={logo} className="rounded me-2" alt="Sport Hub" height="20" />
        <strong className="me-auto">Nueva Notificación</strong>
        <small className="text-white-50">Ahora</small>
        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
      </div>
      <div className="toast-body text-dark">
        {message}
      </div>
    </div>
  );
};