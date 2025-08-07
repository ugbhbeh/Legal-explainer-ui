import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import AuthProvider from './services/Authprovider'
import { useState, useEffect } from 'react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
 
 
    return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
              <Route path="/" element={<Home isAuthenticated={isAuthenticated} /> } />
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to ="/" /> } />
              <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to ="/" /> } />
        </Routes>    
      </AuthProvider>
    </BrowserRouter>
     
  )
  
}

export default App
