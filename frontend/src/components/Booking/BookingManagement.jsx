import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth); // Assumes user role is part of auth state

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Fetch bookings based on the user role
        const endpoint =
          user.role === 'technician'
            ? `http://localhost:5000/api/bookings/technician/${user.id}` // Technician bookings
            : `http://localhost:5000/api/bookings/customer/${user.id}`; // Customer bookings

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log(response.data);
        setBookings(response.data);
      } catch (error) {
        setError('Failed to fetch bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBookings(bookings.filter((booking) => booking._id !== bookingId)); // Update state after cancel
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    if (user.role === 'technician') {
      try {
        await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/confirm`, null, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
          )
        );
      } catch (error) {
        console.error('Error confirming booking:', error);
      }
    }
  };

  return (
    <div>
      <h2>Manage Your Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
              <p><strong>Service:</strong> {booking.service.name}</p>
              <p><strong>Technician:</strong> {booking.technician.username}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {booking.status}</p>

              {/* Conditional rendering based on user role and booking status */}
              {user.role === 'customer' && booking.status === 'pending' && (
                <button onClick={() => handleCancelBooking(booking._id)}>Cancel Booking</button>
              )}
              {user.role === 'technician' && (
                <>
                  {booking.status === 'pending' && (
                    <button onClick={() => handleConfirmBooking(booking._id)}>Confirm Booking</button>
                  )}
                  {booking.status !== 'confirmed' && ( // Only show this button if the status is not canceled
                    <button onClick={() => handleCancelBooking(booking._id)}>Cancel Booking</button>
                  )}
                  
                </>
              )}
            </li>
          ))}

        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default BookingManagement;
