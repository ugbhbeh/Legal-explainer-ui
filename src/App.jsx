import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import AuthProvider from './services/Authprovider'
import AuthContext from './services/AuthContext'
import { useContext } from 'react'

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element= <Home />  />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
