import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/Events/EventList.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import PostList from './components/Posts/PostList.jsx';
import PostForm from './components/Posts/PostForm.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './context/AuthContext';
import AppNavbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PostDetail from './components/Posts/PostDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          {/* Fixed Navigation Bar */}
          <div className="fixed-header">
            <AppNavbar />
          </div>
          
          {/* Scrollable Content Area */}
          <div className="content-area">
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
            </Routes>
          </div>
          
          {/* You can add Footer here if needed */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;