import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// ✅ Service Worker Registration for PWA (Background Sync)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('❌ ServiceWorker registration failed:', error);
      });
  });
}
