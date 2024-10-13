const express = require('express');
const {
    createBooking,
    confirmBooking,
    cancelBooking,
    getBookingsForTechnician,
    getBookingsByStatus
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

// Get bookings by status (accessible only to technicians)
router.get('/status/:status', authMiddleware, getBookingsByStatus); 

module.exports = router;
