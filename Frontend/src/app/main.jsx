import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../styles/global.css';

// StrictMode removed to prevent double API calls in development
// StrictMode intentionally double-invokes effects to help catch bugs
// but causes unnecessary duplicate network requests
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
