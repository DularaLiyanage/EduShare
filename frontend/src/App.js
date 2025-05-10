import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/Events/EventList.jsx';
import EventCalendar from './components/Events/EventCalendar';
import EventDetail from './components/Events/EventDetail'; 

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import PostList from './components/Posts/PostList.jsx';
import PostForm from './components/Posts/PostForm.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import AppNavbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PostDetail from './components/Posts/PostDetail';
import NotificationsPanel from './components/Notifications/NotificationsPanel';

import AddLearningPlan from './components/LearningPlans/AddLearningPlan';
import AllLearningPlan from './components/LearningPlans/AllLearningPlan';
import MyLearningPlan from './components/LearningPlans/MyLearningPlan';
import UpdateLearningPlan from './components/LearningPlans/UpdateLearningPlan';


// Create inner component to safely use useAuth()
function AppContent() {
  const { currentUser } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Event Routes */}
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/calendar" element={<EventCalendar />} />
          
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
          path="/profile/:userId"
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
            
        {/* ➡️ Learning Plan Routes */}
        <Route
          path="/allLearningPlan"
          element={
            <PrivateRoute>
              <AllLearningPlan />
            </PrivateRoute>
          }
        />
        <Route
          path="/addLearningPlan"
          element={
            <PrivateRoute>
              <AddLearningPlan />
            </PrivateRoute>
          }
        />
        <Route
          path="/myLearningPlan"
          element={
            <PrivateRoute>
              <MyLearningPlan />
            </PrivateRoute>
          }
        />
        <Route
          path="/updateLearningPlan/:id"
          element={
            <PrivateRoute>
              <UpdateLearningPlan />
            </PrivateRoute>
          }
        />
        
        {/* Pass currentUser.id as recipientId */}
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

// Wrap AppContent inside AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          {/* Fixed Navigation Bar */}
          <AppNavbar />
          
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