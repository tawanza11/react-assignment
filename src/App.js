import './App.css';
import axios from 'axios'
import { useState } from 'react';
import LoginScreen from './nav/LoginScreen';
import FinanceScreen from './nav/FinanceScreen';
import UI from './nav/UI';
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLoginSuccess = () => setIsAuthenticated(true)
    
  return (
    <div className="App"> 
        {!isAuthenticated  && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
        {isAuthenticated && <UI/>}
    </div>
  );
}

export default App;

