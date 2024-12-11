import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/CustomerHome.css'; // Import the CSS file

const CustomerHome = () => {
  const navigate = useNavigate();

  const handleBookAppointmentClick = () => {
    navigate('/Landing-page'); // Navigate to the booking page
  };

  const handleViewPastBookingsClick = () => {
    navigate('/Manage-bookings'); // Navigate to manage bookings page
  };

  const handleContactSupportClick = () => {
    navigate('/contact-support'); // Navigate to contact support page
  };

  const handleUpdateProfileClick = () => {
    navigate('/User-profile'); // Navigate to update user profile
  };

  return (
    <div className="customer-home">
      <header>
        <h1>Welcome to Your Dashboard</h1>
        <p>Find and book appointments with trusted technicians near you!</p>
      </header>

      <section>
        <h2>Book an Appointment</h2>
        <button onClick={handleBookAppointmentClick}>Book an Appointment</button>
      </section>

      <section>
        <h2>Past Bookings</h2>
        <button onClick={handleViewPastBookingsClick}>View Past Bookings</button>
      </section>

      <section>
        <h2>Quick Links</h2>
        <button onClick={handleUpdateProfileClick}>Update Profile</button>
        <button onClick={handleContactSupportClick}>Contact Support</button>
      </section>
    </div>
  );
};

export default CustomerHome;
