import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen && !isVisible) return null;
  
  const handleConfirm = () => {
    onConfirm();
  };
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className={`relative z-10 w-full max-w-md p-6 mx-4 rounded-lg shadow-xl transform transition-all duration-300 ${
        isOpen ? 'scale-100' : 'scale-95'
      } ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          aria-label="Close"
        >
          <X size={18} />
        </button>
        
        {/* Header */}
        <div className="flex items-start mb-4">
          <div className={`mr-3 p-2 rounded-full ${
            theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-500'
          }`}>
            <AlertTriangle size={20} />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        
        {/* Content */}
        <p className={`mb-6 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;