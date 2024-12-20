import './App.css';
import axios from 'axios'
import { useState } from 'react';
import LoginScreen from './nav/LoginScreen';
import FinanceScreen from './nav/FinanceScreen';
import UI from './nav/UI';
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLoginSuccess = () => setIsAuthenticated(true)
    
  return (
    <Router>
    <Routes>
      {/* หน้าล็อกอิน */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace /> //ไปui
          ) : (
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          )
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <UI />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  </Router>
  );
}

export default App;

