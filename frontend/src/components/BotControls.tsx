import React, { useState } from 'react';
import { useBots } from '../context/BotContext';
import { useTheme } from '../context/ThemeContext';
import { UserPlus, Users, Trash2 } from 'lucide-react';
import Button from './ui/Button';
import ConfirmDialog from './ui/ConfirmDialog';

const BotControls: React.FC = () => {
  const { joinBot, killAllBots, bots, isLoading } = useBots();
  const { theme } = useTheme();
  const [botName, setBotName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botName.trim()) {
      try {
        await joinBot(botName.trim());
        setBotName(''); // Clear input on success
      } catch (error) {
        // Error is handled in context
      }
    }
  };

  const handleKillAll = async () => {
    try {
      await killAllBots();
      setShowConfirm(false);
    } catch (error) {
      // Error is handled in context
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center mb-4">
        <Users className="text-blue-500 mr-2" size={24} />
        <h2 className="text-xl font-semibold">Bot Management</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="botName" 
            className={`block mb-2 text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Add new bot
          </label>
          
          <div className="flex gap-2">
            <input
              id="botName"
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className={`flex-grow p-3 border rounded-md focus:ring-2 focus:outline-none transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
              }`}
              placeholder="Bot name"
              disabled={isLoading}
              required
            />
            
            <Button 
              type="submit" 
              disabled={!botName.trim() || isLoading}
              iconLeft={<UserPlus size={16} />}
            >
              Add
            </Button>
          </div>
        </div>
      </form>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Active Bots: 
            </span>
            <span className={`ml-2 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            } font-medium`}>
              {bots.length} / 7
            </span>
          </div>
          
          <Button 
            variant="danger"
            disabled={bots.length === 0 || isLoading}
            iconLeft={<Trash2 size={16} />}
            onClick={() => setShowConfirm(true)}
          >
            Kill All
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleKillAll}
        title="Kill All Bots"
        message="Are you sure you want to terminate all active bots? This action cannot be undone."
      />
    </div>
  );
};

export default BotControls;