// src/components/TechnicianHome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/TechnicainHome.css'; // Import the CSS file

const TechnicianHome = () => {
  const navigate = useNavigate();

  const handleViewAllBookingClick = () => {
    navigate('/manage-bookings');
  };

  const handleUpdateProfileClick = () => {
    navigate('/update-profile');
  };

  const handleContactSupportClick = () => {
    navigate('/contact-support');
  };

  return (
    <div className="technician-home">
      <button onClick={handleViewAllBookingClick}>View All Bookings</button>

      <h2>Recent Feedback</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel eveniet facilis maiores et expedita aut quia eius aperiam minus ducimus. Id rem in mollitia iste eum praesentium, deleniti quis veritatis.
      </p>

      <h2>Quick Links</h2>
      <button onClick={handleUpdateProfileClick}>Update Profile</button>
      <button onClick={handleContactSupportClick}>Contact Support</button>
    </div>
  );
};

export default TechnicianHome;
