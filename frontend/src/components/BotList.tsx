import React, { useState } from 'react';
import { useBots } from '../context/BotContext';
import { useTheme } from '../context/ThemeContext';
import { RefreshCw, User, X } from 'lucide-react';
import Button from './ui/Button';
import ConfirmDialog from './ui/ConfirmDialog';

const BotList: React.FC = () => {
  const { bots, killBot, refreshBots, isLoading } = useBots();
  const { theme } = useTheme();
  const [botToKill, setBotToKill] = useState<string | null>(null);

  const handleKillBot = async () => {
    if (botToKill) {
      try {
        await killBot(botToKill);
        setBotToKill(null);
      } catch (error) {
        // Error is handled in context
      }
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md h-full transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <User className="text-blue-500 mr-2" size={24} />
          <h2 className="text-xl font-semibold">Active Bots</h2>
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          onClick={() => refreshBots()}
          disabled={isLoading}
          iconLeft={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
        >
          Refresh
        </Button>
      </div>
      
      <div className="overflow-hidden rounded-lg border dark:border-gray-700">
        {bots.length === 0 ? (
          <div className={`p-6 text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p>No active bots</p>
            <p className="text-sm mt-1">Add a bot to get started</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {bots.map((bot) => (
              <li 
                key={bot.name}
                className={`flex items-center justify-between p-4 transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    theme === 'dark' ? 'bg-green-400' : 'bg-green-500'
                  }`} />
                  <span className="font-medium">{bot.name}</span>
                </div>
                <button
                  onClick={() => setBotToKill(bot.name)}
                  className={`p-1.5 rounded-full transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-600 text-gray-300 hover:text-red-400' 
                      : 'hover:bg-gray-200 text-gray-500 hover:text-red-500'
                  }`}
                  aria-label={`Kill bot ${bot.name}`}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!botToKill}
        onClose={() => setBotToKill(null)}
        onConfirm={handleKillBot}
        title="Kill Bot"
        message={`Are you sure you want to terminate '${botToKill}' bot? This action cannot be undone.`}
      />
    </div>
  );
};

export default BotList;