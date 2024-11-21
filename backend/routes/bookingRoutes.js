const express = require('express');
const {
    createBooking,
    confirmBooking,
    cancelBooking,
    getBookingsForTechnician,
    getBookingsForCustomer,
    getBookingsByStatus,
    markBookingAsCompleted
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new booking (accessible to both customers and technicians)
router.post('/', authMiddleware, createBooking); 

// Confirm a booking (accessible only to technicians)
router.patch('/:id/confirm', authMiddleware, confirmBooking); 

// Cancel a booking (accessible only to technicians)
router.patch('/:id/cancel', authMiddleware, cancelBooking); 

// Get bookings for a specific technician (accessible only to technicians)
router.get('/technician/:technicianId', authMiddleware, getBookingsForTechnician); 

// Get bookings for the logged-in customer (accessible only to customers)
router.get('/customer/:CustomerId', authMiddleware, getBookingsForCustomer); 

// Get bookings by status (accessible only to technicians)
router.get('/status/:status', authMiddleware, getBookingsByStatus); 

// Route to mark a booking as completed
router.patch('/:id/complete', authMiddleware, markBookingAsCompleted);

module.exports = router;
