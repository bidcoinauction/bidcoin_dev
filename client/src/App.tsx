import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test API connection
    fetch('/api/health')
      .then(response => {
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setApiStatus(`API is working: ${data.status}`);
        setError(null);
      })
      .catch(err => {
        setApiStatus('API connection failed');
        setError(err.message);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bidcoin Auction</h1>
        <p>Welcome to the Bidcoin Auction platform!</p>
        
        <div className="api-status">
          <h2>API Status</h2>
          <p>{apiStatus}</p>
          {error && <p className="error">{error}</p>}
        </div>
      </header>
    </div>
  )
}

export default App
