// src/components/Auth/Login.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/Auth/authSlice';
import './Login.css'; // Import a CSS file for styling

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }
    dispatch(loginUser({ email, password })).catch((err) =>
      console.error('Login failed:', err)
    );
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'technician') {
        navigate('/manage-bookings');
      } else if (user.role === 'customer') {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleCreateAccount = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        {error && <p className="login-error">{error}</p>}
        <div className="login-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button
          type="button"
          className="signup-button"
          onClick={handleCreateAccount}
        >
          Create a New Account
        </button>
      </form>
    </div>
  );
};

export default Login;
