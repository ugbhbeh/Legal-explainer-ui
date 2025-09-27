import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import AuthProvider from './services/Authprovider'
import AuthContext from './services/AuthContext'
import ChatDetails from './components/ChatDetails'
import DocumentDetails from './components/DocumentDetails'
import TopBar from './components/TopBar'
import Sidebar from './components/SideBar'
import { useContext } from 'react'

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />
      <Route path="/chats/:id" element={<ChatDetails />} />
      <Route path="/document/:id" element={<DocumentDetails />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
       <div className="flex flex-col h-screen">
  {/* Top bar at the top */}
  <TopBar />

  {/* Rest of the screen: sidebar + main content */}
  <div className="flex flex-1">
    {/* Sidebar below top bar */}
    <Sidebar className="h-full" />

    {/* Main content */}
    <main className="flex-1 overflow-y-auto">
              <AppRoutes /> {/* Page content changes here */}
            </main>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
