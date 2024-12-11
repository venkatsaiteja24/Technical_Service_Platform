import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../features/Auth/authSlice'; // Replace with the correct import path\
import { useNavigate } from 'react-router-dom';
import './UserProfile.css'; 

const UserProfile = () => {

  const navigate = useNavigate(); // Use the navigate hook
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load user data into form fields whenever `user` changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhoneNumber(user.phoneNumber || '');
      setAddress({
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
      });
    }
  }, [user]); // Dependency on `user`

  const handleAddressChange = (field) => (e) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [field]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (password && password !== confirmPassword) {
      alert('Passwords do not match.');
      return false;
    }

    if (address.state && !/^[A-Z]{2}$/.test(address.state)) {
      alert('State must be a valid two-letter abbreviation (e.g., MA).');
      return false;
    }

    return true;
  };

  // Update the user data in Redux and redirect to UserProfileCard after success
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedUserData = {
      name,
      ...(password && { password }), // Only include password if provided
      phoneNumber,
      address,
    };

    dispatch(updateUser(updatedUserData)).then((response) => {
      if (response?.type.endsWith('/fulfilled')) {
        setSuccessMessage('Profile updated successfully.');
        setPassword('');
        setConfirmPassword('');
        navigate('/user-profile'); // Redirect to User Profile Card
      }
    });
  };


  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (!user) {
    return <p>No user data available.</p>;
  }

  return (
    <div className="user-profile">
      <h2 className="form-title">Update Profile</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <fieldset disabled={loading}>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number (e.g., XXX-XXX-XXXX)"
              aria-label="Phone Number"
            />
          </div>
          <h3>Address</h3>
          <div className="form-group">
            <label>Street</label>
            <input
              type="text"
              value={address.street}
              onChange={handleAddressChange('street')}
              aria-label="Street Address"
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={address.city}
              onChange={handleAddressChange('city')}
              aria-label="City"
            />
          </div>
          <div className="form-group">
            <label>State (e.g., MA)</label>
            <input
              type="text"
              value={address.state}
              onChange={handleAddressChange('state')}
              placeholder="Enter state abbreviation"
              aria-label="State"
            />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              value={address.zipCode}
              onChange={handleAddressChange('zipCode')}
              aria-label="Zip Code"
            />
          </div>
          <h3>Change Password</h3>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="New Password"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirm New Password"
            />
          </div>
          <button type="submit" className="submit-button">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </fieldset>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UserProfile;