// Import necessary libraries and components
import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import pages and components for routing
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import NavBar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Home from './components/HomePages/Home';
import NotFound from './components/NotFound';
import BookingManagement from './components/Booking/BookingManagement';
import TechnicianHome from './components/HomePages/TechnicianHome';
import UserProfile from './components/Auth/UserProfile'
import './App.css'

// ProtectedRoute component decides what to show based on login status and user role
const ProtectedRoute = ({ customerElement, technicianElement }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/home" />; // Redirect to Home if not logged in

  // Render based on user role
  return user.role === 'technician' ? technicianElement : customerElement;
};

function App() {
  return (
    <Router>
      <NavBar />
      <div className="App">
        <Routes>
          {/* Redirect root path based on user login status and role */}
          <Route
            path="/"
            element={
              <ProtectedRoute
                customerElement={<LandingPage />}
                technicianElement={<TechnicianHome />}
              />
            }
          />
          <Route path="/home" element={<Home />} /> {/* Home for unauthenticated users */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manage-bookings" element={<BookingManagement />} />
          <Route path="/technician-home" element={<TechnicianHome />} />

            {/* Protected Route for User Profile */}
            <Route 
            path="/profile" 
            element={
              <ProtectedRoute 
                customerElement={<UserProfile />} 
                technicianElement={<Navigate to="/technician-home" />} // Redirect technicians to their dashboard if they try to access UserProfile
              />
            } 
          />

          {/* Handle all other undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
