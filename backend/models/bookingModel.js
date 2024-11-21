const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], // Array of allowed values
        default: 'pending'
    },
});

module.exports = mongoose.model('Booking', bookingSchema);
