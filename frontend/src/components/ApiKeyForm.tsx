import React, { useState } from 'react';
import { useBots } from '../context/BotContext';
import { useTheme } from '../context/ThemeContext';
import { Key } from 'lucide-react';
import Button from './ui/Button';

const ApiKeyForm: React.FC = () => {
  const { setApiKey } = useBots();
  const { theme } = useTheme();
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      setApiKey(key.trim());
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center mb-4">
        <Key className="text-blue-500 mr-2" size={24} />
        <h2 className="text-xl font-semibold">API Key Authentication</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="apiKey" 
            className={`block mb-2 text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Enter your API Key
          </label>
          
          <div className="relative">
            <input
              id="apiKey"
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
              }`}
              placeholder="Your API key"
              required
            />
            
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        
        <Button type="submit" fullWidth>
          Connect
        </Button>
      </form>
    </div>
  );
};

export default ApiKeyForm;