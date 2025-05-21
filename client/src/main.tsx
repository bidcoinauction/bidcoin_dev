import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Safe check for ethereum property without redefining it
const ethereumCheck = () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    console.log('Ethereum provider detected');
  }
};

// Call the check function
ethereumCheck();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
