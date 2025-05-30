import React, { useState, useEffect } from 'react';
import { useBots } from '../context/BotContext';
import { useTheme } from '../context/ThemeContext';
import { Video } from 'lucide-react';
import Button from './ui/Button';

const ZoomLinkForm: React.FC = () => {
  const { zoomLink, setLink, isLoading } = useBots();
  const { theme } = useTheme();
  const [link, setLinkInput] = useState(zoomLink);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setLinkInput(zoomLink);
  }, [zoomLink]);

  // Fetch the zoom link from backend at startup
  useEffect(() => {
    const fetchZoomLink = async () => {
      try {
        const res = await fetch('/get-link');
        if (res.ok) {
          const data = await res.json();
          if (data?.link) {
            setLinkInput(data.link);
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchZoomLink();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (link.trim()) {
      try {
        await setLink(link.trim());
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        // Error handling is done in context
      }
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center mb-4">
        <Video className="text-blue-500 mr-2" size={24} />
        <h2 className="text-xl font-semibold">Zoom Meeting Link</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="zoomLink" 
            className={`block mb-2 text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Enter Zoom meeting link
          </label>
          
          <input
            id="zoomLink"
            type="url"
            value={link}
            onChange={(e) => setLinkInput(e.target.value)}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
            }`}
            placeholder="https://app.zoom.us/wc/XXXXXXX/join?XXX"
            required
          />
          
          {showSuccess && (
            <p className={`mt-2 text-sm ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              Current meeting link is set
            </p>
          )}
        </div>
        
        <Button 
          type="submit"
        >
          Set Meeting Link
        </Button>
      </form>
    </div>
  );
};

export default ZoomLinkForm;