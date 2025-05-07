import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/Events/EventList.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, useAuth } from './context/AuthContext'; // ✅ also import useAuth here
import AppNavbar from './components/layout/Navbar'; // Header component
import PrivateRoute from './components/layout/PrivateRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PostDetail from './components/Posts/PostDetail';
import NotificationsPanel from './components/Notifications/NotificationsPanel';

// ✅ Create inner component to safely use useAuth()
function AppContent() {
  const { currentUser } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<EventList />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/:userId"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <PrivateRoute>
              <PostDetail />
            </PrivateRoute>
          }
        />
        {/* ✅ Pass currentUser.id as recipientId */}
        {currentUser && (
          <Route
            path="/notifications"
            element={<NotificationsPanel recipientId={currentUser.id} />}
          />
        )}
      </Routes>
    </>
  );
}

// ✅ Wrap AppContent inside AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          {/* Fixed Navigation Bar */}
          <AppNavbar /> {/* Render AppNavbar only here once */}
          
          {/* Scrollable Content Area */}
          <div className="content-area">
            <AppContent /> {/* Use AppContent here to render the routes */}
          </div>

          {/* You can add Footer here if needed */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
