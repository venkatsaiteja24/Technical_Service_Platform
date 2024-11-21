import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../CSS/BookingForm.css'

const BookingForm = ({ technicianId, customerId, serviceId }) => {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timeout); // Cleanup on unmount or when success changes
    }
  }, [success]);

  const handleBooking = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const selectedDate = new Date(date);
    const currentDate = new Date();
  
    if (!date || selectedDate < currentDate) {
      setError('Please select a valid future date.');
      return;
    }

    setError(''); // Reset error state
    setSuccess(''); // Reset success state
    setLoading(true); // Set loading state

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated. Please log in.');
        return;
      }

      const bookingData = {
        customer: customerId,
        technician: technicianId,
        service: serviceId,
        date: new Date(date).toISOString(),
      };

      console.log('Sending booking data:', bookingData); // Log booking data

      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) { // Check for 201 Created
        setSuccess('Booking successful!');
        setDate(''); // Clear the form
      }
    } catch (error) {
      const errorMsg = error.response && error.response.data
        ? error.response.data.message
        : 'Failed to book appointment. Please try again.';
      setError(errorMsg);
      console.error('Error booking appointment:', errorMsg);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleBooking}>
      <h4>Book Appointment</h4>
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        required 
        disabled={loading} // Disable input while loading
      />
      <button type="submit" disabled={loading} className='book-btn'>
        {loading ? 'Booking...' : 'Book'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

BookingForm.propTypes = {
  technicianId: PropTypes.string.isRequired,
  customerId: PropTypes.string.isRequired,
  serviceId: PropTypes.string.isRequired,
};

export default BookingForm;
