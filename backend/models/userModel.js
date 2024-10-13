const mongoose = require('mongoose');

// Address Schema
const addressSchema = mongoose.Schema({
    street: {
        type: String,
        required: [true, 'Please enter street address'],
    },
    city: {
        type: String,
        required: [true, 'Please enter city'],
    },
    state: {
        type: String,
        required: [true, 'Please enter state'],
    },
    zipCode: {
        type: String,
        required: [true, 'Please enter zip code'],
        match: [/^\d{5}$/, 'Please enter a valid zip code'], // Example for US ZIP code
    },
});

// Customer Schema
const customerSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: [true, 'Please enter Phone Number'],
        match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number'], // Example phone number validation
    },
    address: {
        type: addressSchema,
        required: [true, 'Please enter address'],
    },
});

// Technician Schema
const technicianSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: [true, 'Please enter Phone Number'],
        match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number'], // Example phone number validation
    },
    address: {
        type: addressSchema,
        required: [true, 'Please enter address'],
    },
    profession: {
        type: String,
        required: [true, 'Please enter Profession'],
    },
    skills: [{
        type: String,
        required: [true, 'Please enter Skills'],
    }],
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service', // Reference to services offered
    }],
});

// User Schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Email validation
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    role: {
        type: String,
        enum: ['customer', 'technician'],
        required: true,
    },
    customerDetails: customerSchema,
    technicianDetails: technicianSchema,
    resetPasswordToken: { // New field for password reset token
        type: String,
    },
    resetPasswordExpires: { // New field for token expiration
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
