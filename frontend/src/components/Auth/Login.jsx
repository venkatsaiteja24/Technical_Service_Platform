// src/components/Auth/Login.js
import React, { useState, useEffect } from 'react'; // Import React and useState, useEffect hooks
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks for state management
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { loginUser } from '../../features/Auth/authSlice'; // Import the login action from the auth slice

const Login = () => {
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const navigate = useNavigate(); // Get the navigate function for page navigation
  const { user, loading, error } = useSelector((state) => state.auth); // Get user, loading status, and error from Redux state

  // State variables for email and password input
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate form fields
    if (!email || !password) {
      alert('Please fill in all fields.'); // Alert if fields are empty
      return; // Stop further execution
    }

    // Dispatch the loginUser action with email and password
    dispatch(loginUser({ email, password }))
      .catch((err) => {
        console.error('Login failed:', err); // Log error if login fails
      });
  };

  // Redirect based on user role after successful login
  useEffect(() => {
    if (user) {
      if (user.role === 'technician') {
        navigate('/manage-bookings'); // Redirect to dashboard if technician
      } else if (user.role === 'customer') {
        navigate('/'); // Redirect to landing page if customer
      }
    }
  }, [user, navigate]);

  const handleCreateAccount = () => {
    navigate('/signup'); // Redirect to the signup page
  };

  return (
    <form onSubmit={handleSubmit}> {/* Handle form submission */}
    <div>
      <h2>Login</h2> {/* Login heading */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if there is one */}
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state on input change
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on input change
        />
      </label>
      <button type="submit" disabled={loading}> {/* Submit button */}
        {loading ? 'Logging in...' : 'Login'} {/* Display loading text or login text based on loading state */}
      </button>
      </div>
      <button type="button" onClick={handleCreateAccount}> {/* Button to create a new account */}
        Create a New Account
      </button>
      
    </form>
  );
};

export default Login; // Export the Login component for use in other parts of the application
