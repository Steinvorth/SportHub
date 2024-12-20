import React, { createContext, useState, useContext } from 'react';
import { Toast } from './Toast';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: '', isVisible: false });

  const showNotification = (message) => {
    setNotification({ message, isVisible: true });
  };

  const hideNotification = () => {
    setNotification({ message: '', isVisible: false });
  };

  return (
    <NotificationsContext.Provider value={{ showNotification }}>
      {children}
      <Toast 
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);