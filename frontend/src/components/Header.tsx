import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useBots } from '../context/BotContext';
import { Moon, Sun, PersonStanding } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { bots } = useBots();
  
  return (
    <header className={`py-4 px-6 shadow-md transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PersonStanding size={28} className="text-blue-500" />
          <h1 className="text-xl font-bold">Zoom Bot Manager</h1>
          {bots.length > 0 && (
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500 text-white'
            }`}>
              {bots.length} active
            </span>
          )}
        </div>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-700' 
              : 'hover:bg-gray-100'
          }`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-gray-700" />
          ) : (
            <Sun size={20} className="text-yellow-300" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;