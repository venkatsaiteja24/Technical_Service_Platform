import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './UserProfileCard.css'; // Ensure this CSS file is imported

const UserProfileCard = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth); // Access user from Redux store
  console.log('Updated user state:', user);

  const handleEdit = () => {
    navigate('/update-profile'); // Navigate to UserProfile page for editing
  };

  if (loading) {
    return <p>Loading your profile...</p>;
  }

  if (!user) {
    return <p>No user data available. Please log in.</p>;
  }

  // Format the address if present
  const address = user.address || {};
  
  // Break the address into separate lines
  const street = address.street || 'Not Available';
  const city = address.city || 'Not Available';
  const state = address.state || 'Not Available';
  const zipCode = address.zipCode || 'Not Available';

  return (
    <div className="user-card">
      <h2 className="form-title">User Profile</h2>
      <div className="form-group">
        <p><strong>Name:</strong> {user.username || 'Not Available'}</p>
      </div>
      <div className="form-group">
        <p><strong>Phone:</strong> {user.phoneNumber || 'Not Available'}</p>
      </div>
      <div className="form-group">
        <p><strong>Address:</strong></p>
        <div className="address">
          <p>{street}</p>
          <p>{city}</p>
          <p>{state} {zipCode}</p>
        </div>
      </div>
      <button className="submit-button" onClick={handleEdit}>Edit Profile</button>
    </div>
  );
};

export default UserProfileCard;
