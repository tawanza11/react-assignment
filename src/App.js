import './App.css';
import axios from 'axios'
import { useState } from 'react';
import LoginScreen from './LoginScreen';
import FinanceScreen from './FinanceScreen';


axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337"

function App() {
  const handleLoginSuccess = () => { alert("Login Success!!!") }
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return (  
    <div className="App">
      <header className="App-header">
      {!isAuthenticated ? (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        ) : (
          <FinanceScreen />
        )}
      </header>
    </div>
  );
}

export default App;

