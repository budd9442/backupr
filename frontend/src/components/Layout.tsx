import React from 'react';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className={`py-4 text-center text-sm ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        © {new Date().getFullYear()} Budd Systems - Zoom Bot Manager
      </footer>
    </div>
  );
};

export default Layout;