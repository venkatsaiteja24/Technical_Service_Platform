import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../CSS/BookingManage.css'

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth); // Assumes user role is part of auth state
  const [showReviewForm, setShowReviewForm] = useState(null); // State to track which booking is being reviewed
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Fetch bookings based on the user role
        const endpoint =
          user.role === 'technician'
            ? `https://technical-service-platform.vercel.app/api/bookings/technician/${user.id}` // Technician bookings
            : `https://technical-service-platform.vercel.app/api/bookings/customer/${user.id}`; // Customer bookings

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
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
      await axios.patch(`https://technical-service-platform.vercel.app/api/bookings/${bookingId}/cancel`, null, {
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
        await axios.patch(`https://technical-service-platform.vercel.app/api/bookings/${bookingId}/confirm`, null, {
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

  //function to handle completing a booking
  const handleCompleteBooking = async (bookingId) => {
    if (user.role === 'technician') {
      try {
        await axios.patch(`https://technical-service-platform.vercel.app/api/bookings/${bookingId}/complete`, null, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status: 'completed' } : booking
          )
        );
      } catch (error) {
        console.error('Error completing booking:', error);
        setError('Failed to mark booking as completed. Please try again.');
      }
    }
  };
  
  const handleReviewSubmit = async (bookingId, technicianId) => {
    try {
      await axios.post(
        `https://technical-service-platform.vercel.app/api/reviews`,
        { customer: user.id, technician: technicianId, service: bookingId, rating, reviewText },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setShowReviewForm(null); // Hide the review form after submission
      setRating(0); // Reset rating
      setReviewText(''); // Reset review text
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    }
  };

  // Group bookings by technician
  const groupedBookings = bookings.reduce((acc, booking) => {
    (acc[booking.technician.username] = acc[booking.technician.username] || []).push(booking);
    return acc;
  }, {});

  return (
    <div>
      <h2>Manage Your Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : Object.keys(groupedBookings).length > 0 ? (
        Object.keys(groupedBookings).map((technicianName) => (
          <div key={technicianName} className="technician-bookings">
            <h3>{technicianName}{/*-{groupedBookings[technicianName][0].service.name}*/}</h3>
            <ul>
              {groupedBookings[technicianName].map((booking) => (
                <li key={booking._id} className="booking-item">
                  <p><strong>Service:</strong> {booking.service.name}</p>
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                  <p><strong>Status:</strong> {booking.status}</p>

                  {user.role === 'customer' && booking.status === 'completed' && (
                    <>
                      {showReviewForm === booking._id ? (
                        <div className="review-form">
                          <h3>Leave a Review</h3>
                          <label>
                            Rating:
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                            />
                          </label>
                          <label>
                            Review:
                            <textarea
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                            />
                          </label>
                          <button onClick={() => handleReviewSubmit(booking._id, booking.technician._id)}>
                            Submit Review
                          </button>
                          <button onClick={() => setShowReviewForm(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setShowReviewForm(booking._id)}>Leave a Review</button>
                      )}
                    </>
                  )}

                  {user.role === 'customer' && (booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button className="cancel-button" onClick={() => handleCancelBooking(booking._id)}>
                      Cancel Booking
                    </button>
                  )}

                  {user.role === 'technician' && (
                    <>
                      {booking.status === 'pending' && (
                        <button className="confirm-button" onClick={() => handleConfirmBooking(booking._id)}>
                          Confirm Booking
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <>
                          <button className="complete-button" onClick={() => handleCompleteBooking(booking._id)}>
                            Complete Booking
                          </button>
                          <button className="cancel-button" onClick={() => handleCancelBooking(booking._id)}>
                            Cancel Booking
                          </button>
                        </>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default BookingManagement;
