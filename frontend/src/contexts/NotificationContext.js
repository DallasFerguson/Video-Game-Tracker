import { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const newNotification = { id, message, type };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after duration
    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Shorthand alias for addNotification
  const notify = addNotification;

  const value = {
    notifications,
    addNotification,
    removeNotification,
    notify
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Display notifications */}
      {notifications.length > 0 && (
        <div className="notification-container">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification notification-${notification.type}`}
              onClick={() => removeNotification(notification.id)}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;