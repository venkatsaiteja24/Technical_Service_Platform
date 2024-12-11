import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/Auth/authSlice';
import './CSS/Navbar.css';



const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Redirect to home page after logout
  };

  // Handle home button click
  const handleHomeClick = () => {
    if (user) {
      if (user.role === 'customer') {
        navigate('/customer-home'); // Redirect to landing page for customers
      } else if (user.role === 'technician') {
        navigate('/technician-home'); // Redirect to technician home for technicians
      }
    } else {
      navigate('/home'); // Redirect to home for unauthenticated users
    }
  };

    // Handle My Bookings navigation
    const handleManageBookingsClick = () => {
      if (user && user.role === 'customer') {
        navigate('/manage-bookings'); // Navigate to My Bookings for customers
      }
    };
    return (
      <nav>
        {user && <span>Welcome, {user.username}!</span>} {/* Display username at start */}
    
        <button onClick={handleHomeClick}>Home</button>
    
        {user ? (
          <>
            {user.role === 'customer' && (
              <button onClick={handleManageBookingsClick}>My Bookings</button>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
      </nav>
    );
    
};

export default Navbar;
