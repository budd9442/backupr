import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Bot, ApiResponse } from '../types';
import { apiClient } from '../utils/apiClient';

interface BotContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  zoomLink: string;
  setZoomLink: (link: string) => void;
  bots: Bot[];
  isLoading: boolean;
  error: string | null;
  refreshBots: () => Promise<void>;
  setLink: (link: string) => Promise<void>;
  joinBot: (name: string) => Promise<void>;
  killBot: (name: string) => Promise<void>;
  killAllBots: () => Promise<void>;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('apiKey') || '');
  const [zoomLink, setZoomLink] = useState<string>('');
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Validate API key format
  const isValidApiKey = (key: string): boolean => {
    return key.trim().length >= 32;
  };

  // Load initial Zoom link
  const loadZoomLink = useCallback(async () => {
    if (!apiKey || !isValidApiKey(apiKey)) return;
    
    try {
      const response = await apiClient.getLink();
      if (response.link) {
        setZoomLink(response.link);
      }
    } catch (err) {
      // Silently handle the error if the link is not set
      if (err instanceof Error && err.message !== 'Zoom link not set') {
        console.error('Error loading Zoom link:', err);
      }
    }
  }, [apiKey]);

  // Save API key to localStorage and initialize
  useEffect(() => {
    if (apiKey) {
      if (!isValidApiKey(apiKey)) {
        setError('Invalid API key format');
        return;
      }
      localStorage.setItem('apiKey', apiKey);
      apiClient.setApiKey(apiKey);
      loadZoomLink(); // Load Zoom link when API key is set
      refreshBots(); // Refresh bots when API key changes
    }
  }, [apiKey, loadZoomLink]);

  // Refresh bots list
  const refreshBots = useCallback(async () => {
    if (!apiKey) {
      setError('Please enter your API key');
      return;
    }

    if (!isValidApiKey(apiKey)) {
      setError('Invalid API key format');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getBots();
      if (response.names) {
        setBots(response.names.map(name => ({ name })));
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to fetch bots: ${errorMessage}`);
      console.error('Error fetching bots:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // Set Zoom meeting link
  const setLink = async (link: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.setLink(link);
      setZoomLink(link);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to set Zoom link: ${errorMessage}`);
      console.error('Error setting link:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Join a bot to the meeting
  const joinBot = async (name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.joinBot(name);
      await refreshBots();
    } catch (err: any) {
      let errorMessage = 'Failed to join bot';
      if (err?.message === 'Bot limit reached') {
        errorMessage = 'Bot limit reached (maximum 10 bots)';
      } else if (err?.message === 'Name already in use') {
        errorMessage = 'Bot name already in use';
      } else if (err?.message === 'Zoom link not set') {
        errorMessage = 'Please set a Zoom link first';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Error joining bot:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Kill a specific bot
  const killBot = async (name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.killBot(name);
      await refreshBots();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to kill bot: ${errorMessage}`);
      console.error('Error killing bot:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Kill all bots
  const killAllBots = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.killAllBots();
      await refreshBots();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to kill all bots: ${errorMessage}`);
      console.error('Error killing all bots:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh bots list every 10 seconds
  useEffect(() => {
    if (!apiKey || !isValidApiKey(apiKey)) return;
    
    const intervalId = setInterval(() => {
      refreshBots();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [apiKey, refreshBots]);

  return (
    <BotContext.Provider
      value={{
        apiKey,
        setApiKey,
        zoomLink,
        setZoomLink,
        bots,
        isLoading,
        error,
        refreshBots,
        setLink,
        joinBot,
        killBot,
        killAllBots,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBots = (): BotContextType => {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error('useBots must be used within a BotProvider');
  }
  return context;
};