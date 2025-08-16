import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import AuthProvider from './services/Authprovider'
import AuthContext from './services/AuthContext'
import Archive from './components/Archive'
import ChatDetails from './components/ChatDetails'
import DocumentDetails from './components/DocumentDetails'
import TopBar from './components/TopBar'
import { useContext } from 'react'

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/chats/:id" element={<ChatDetails />} />
      <Route path="/document/:id" element={<DocumentDetails />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <TopBar />
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
