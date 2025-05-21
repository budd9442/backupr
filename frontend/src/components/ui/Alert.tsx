import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  autoClose = true,
  duration = 5000,
}) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return theme === 'dark' 
          ? 'bg-green-800 text-green-100 border-green-700' 
          : 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return theme === 'dark' 
          ? 'bg-red-800 text-red-100 border-red-700' 
          : 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return theme === 'dark'
          ? 'bg-yellow-800 text-yellow-100 border-yellow-700'
          : 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'info':
        return theme === 'dark'
          ? 'bg-blue-800 text-blue-100 border-blue-700'
          : 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return theme === 'dark' ? 'text-green-300' : 'text-green-500';
      case 'error':
        return theme === 'dark' ? 'text-red-300' : 'text-red-500';
      case 'warning':
        return theme === 'dark' ? 'text-yellow-300' : 'text-yellow-500';
      case 'info':
        return theme === 'dark' ? 'text-blue-300' : 'text-blue-500';
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 rounded-lg border shadow-lg transition-all ${getStyles()} animate-slide-up`}>
      <div className="flex items-start">
        <div className={`mr-3 flex-shrink-0 ${getIconColor()}`}>
          {getIcon()}
        </div>
        
        <div className="flex-grow">
          <p>{message}</p>
        </div>
        
        <button
          onClick={() => setVisible(false)}
          className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Alert;