
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from '@/App.jsx';
    import '@/index.css';
    import { AuthProvider } from '@/contexts/AuthContext.jsx';
    import { TranslationProvider } from '@/contexts/TranslationContext.jsx';

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <TranslationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </TranslationProvider>
      </React.StrictMode>
    );
  