import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TechnicianHome = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Import useNavigate

  const handleViewAllBookingClick = () => {
    navigate('/manage-bookings'); // Navigate to manage bookings
  };

  return (
    <div>
      <h1>Welcome back, {user.username}!</h1>

      <h2>Your Upcoming Appointments</h2>
      {/* Placeholder for upcoming appointments list */}
      <ul>
        {/* Map through upcoming appointments */}
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit autem ullam nostrum? Sint inventore perspiciatis quo delectus, voluptate dolore commodi dolor at illum asperiores voluptas recusandae eos, reprehenderit accusantium in?</li>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eum assumenda deleniti est exercitationem nihil temporibus voluptates a modi provident totam at laboriosam repellat rem, consequatur non illo, distinctio tenetur.</li>
      </ul>

      {/* Button to view all bookings */}
      <button onClick={handleViewAllBookingClick}>View All Bookings</button>

      <h2>Quick Stats</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem consequatur illo nisi dolores, sit fugiat dolorem natus dolor commodi amet sapiente sequi voluptatibus veniam est necessitatibus iusto expedita nulla distinctio.</p>

      <h2>Notifications</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero exercitationem repellat unde! Dolorum unde vero repellat doloribus ea? Maxime itaque provident dolorum rerum velit nisi dicta libero dignissimos corporis illum?</p>

      <h2>Recent Feedback</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel eveniet facilis maiores et expedita aut quia eius aperiam minus ducimus. Id rem in mollitia iste eum praesentium, deleniti quis veritatis.</p>

      <h2>Quick Links</h2>
      <button onClick={() => navigate('/manage-bookings')}>Manage Bookings</button>
      <button onClick={() => navigate('/update-profile')}>Update Profile</button>
      <button onClick={() => navigate('/contact-support')}>Contact Support</button>
    </div>
  );
};

export default TechnicianHome;
