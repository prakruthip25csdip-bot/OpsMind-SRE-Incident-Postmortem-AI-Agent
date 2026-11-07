import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(() => 
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  );
  const [hindsightEndpoint, setHindsightEndpoint] = useState(() => 
    import.meta.env.VITE_HINDSIGHT_ENDPOINT || 'https://ui.hindsight.vectorize.io'
  );
  const [groqModel, setGroqModel] = useState(() => 
    import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile'
  );

  // 'demo' (interactive realistic simulation) or 'live' (queries real FastAPI backend)
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('memoradesk_mode') || 'demo';
  });

  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected', 'offline', 'checking'
  const [lastChecked, setLastChecked] = useState(null);
  const [hindsightStatus, setHindsightStatus] = useState('ready'); // 'ready', 'connected', 'standby'

  const checkBackendHealth = useCallback(async () => {
    setBackendStatus('checking');
    try {
      const response = await axios.get(`${apiUrl}/api/health`, { timeout: 2500 });
      if (response.status === 200) {
        setBackendStatus('connected');
        setLastChecked(new Date().toLocaleTimeString());
        return true;
      }
    } catch (err) {
      // Backend is not currently running locally
      setBackendStatus('offline');
      setLastChecked(new Date().toLocaleTimeString());
      return false;
    }
  }, [apiUrl]);

  useEffect(() => {
    checkBackendHealth();
    localStorage.setItem('memoradesk_mode', mode);
  }, [mode, checkBackendHealth]);

  const toggleMode = () => {
    setMode(prev => prev === 'demo' ? 'live' : 'demo');
  };

  return (
    <ApiContext.Provider
      value={{
        apiUrl,
        setApiUrl,
        hindsightEndpoint,
        setHindsightEndpoint,
        groqModel,
        setGroqModel,
        mode,
        setMode,
        toggleMode,
        backendStatus,
        lastChecked,
        checkBackendHealth,
        hindsightStatus,
        isLive: mode === 'live' && backendStatus === 'connected'
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApi must be used within ApiProvider');
  return context;
};
