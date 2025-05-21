import React from 'react';
import { BotProvider } from './context/BotContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <BotProvider>
        <Layout>
          <Dashboard />
        </Layout>
      </BotProvider>
    </ThemeProvider>
  );
}

export default App;