const Booking = require('../models/bookingModel');

// Create Booking Function
exports.createBooking = async (req, res) => {
    const { customer, technician, service, date } = req.body;

    // Check if the requester is a customer
    if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Only customers can create bookings.' });
    }

    if (!customer || !technician || !service || !date) {
        return res.status(400).json({ message: 'Customer, technician, service, and date are required.' });
    }

    try {
        const newBooking = new Booking({ 
            customer, 
            technician, 
            service, 
            date, 
            status: 'pending' // Set initial status to 'pending'
        });
        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(400).json({ message: 'Error creating booking', error });
    }
};

// Confirm Booking Function
exports.confirmBooking = async (req, res) => {
    const { id } = req.params; // Get booking ID from request parameters

    // Check if the requester is a technician
    if (req.user.role !== 'technician') {
        return res.status(403).json({ message: 'Only technicians can confirm bookings.' });
    }

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled' || booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot confirm a cancelled or completed booking' });
        }

        booking.status = 'confirmed'; // Update the status to 'confirmed'
        await booking.save();
        res.status(200).json({ message: 'Booking confirmed', booking });
    } catch (error) {
        res.status(400).json({ message: 'Error confirming booking', error });
    }
};

// Cancel Booking Function
exports.cancelBooking = async (req, res) => {
    const { id } = req.params; // Get booking ID from request parameters

    // Check if the requester is a technician
    if (req.user.role !== 'technician') {
        return res.status(403).json({ message: 'Only technicians can cancel bookings.' });
    }

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed booking' });
        }

        booking.status = 'cancelled'; // Update the status to 'cancelled'
        await booking.save();
        res.status(200).json({ message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(400).json({ message: 'Error cancelling booking', error });
    }
};

// Get Bookings for Technician Function
exports.getBookingsForTechnician = async (req, res) => {
    // Check if the requester is a technician
    if (req.user.role !== 'technician') {
        return res.status(403).json({ message: 'Only technicians can access their bookings.' });
    }

    const { technicianId } = req.params; // Technician ID from request parameters

    try {
        const bookings = await Booking.find({ technician: technicianId }).populate('customer technician service');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching bookings for technician', error });
    }
};

// Get Bookings by Status Function
exports.getBookingsByStatus = async (req, res) => {
    // Check if the requester is a technician
    if (req.user.role !== 'technician') {
        return res.status(403).json({ message: 'Only technicians can access bookings by status.' });
    }

    const { status } = req.params;

    // Validate status based on allowed enum values
    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status parameter' });
    }

    try {
        const bookings = await Booking.find({ status }).populate('customer technician service');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching bookings', error });
    }
};
