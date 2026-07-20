import './css/App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import Garage from './pages/Garage.jsx'
import Community from './pages/Community.jsx'
import Messages from './pages/Messages.jsx'
import Profile from './pages/Profile.jsx'
import MyEvents from './pages/MyEvents.jsx';
import CreateEvent from './pages/CreateEvent.jsx';
import UserProfile from './pages/UserProfile.jsx';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-aqua" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/home" replace /> : <Register />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/garage" element={<ProtectedRoute><Garage /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
