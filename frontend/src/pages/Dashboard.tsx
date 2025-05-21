import React from 'react';
import { useBots } from '../context/BotContext';
import ApiKeyForm from '../components/ApiKeyForm';
import ZoomLinkForm from '../components/ZoomLinkForm';
import BotControls from '../components/BotControls';
import BotList from '../components/BotList';
import Alert from '../components/ui/Alert';

const Dashboard: React.FC = () => {
  const { apiKey, error, isLoading } = useBots();

  if (!apiKey) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Welcome to Zoom Bot Manager</h2>
        <p className="mb-6">Please enter your API key to get started.</p>
        <ApiKeyForm />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ZoomLinkForm />
          <BotControls />
        </div>
        <div>
          <BotList />
        </div>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
        />
      )}
      
      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow-lg animate-pulse">
          Loading...
        </div>
      )}
    </div>
  );
};

export default Dashboard;