// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ensure the root element is properly typed
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

// Render the App component within React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
