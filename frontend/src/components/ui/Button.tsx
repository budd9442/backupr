import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft,
  iconRight,
  children,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  
  const getBaseClasses = () => {
    return `inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      fullWidth ? 'w-full' : ''
    } ${
      disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
    }`;
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm px-3 py-1.5';
      case 'lg':
        return 'text-lg px-6 py-3';
      case 'md':
      default:
        return 'text-base px-4 py-2';
    }
  };
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return theme === 'dark'
          ? 'bg-gray-600 text-white hover:bg-gray-500 focus:ring-gray-500'
          : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-300';
      case 'outline':
        return theme === 'dark'
          ? 'bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500'
          : 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300';
      case 'danger':
        return theme === 'dark'
          ? 'bg-red-700 text-white hover:bg-red-600 focus:ring-red-500'
          : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'primary':
      default:
        return theme === 'dark'
          ? 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500'
          : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500';
    }
  };
  
  const classes = `${getBaseClasses()} ${getSizeClasses()} ${getVariantClasses()}`;
  
  return (
    <button className={classes} disabled={disabled} {...props}>
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

export default Button;