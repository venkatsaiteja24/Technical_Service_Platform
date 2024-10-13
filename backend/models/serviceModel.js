const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,  // Service name is required and serves as the category
        unique: true,    // Ensures service names are unique
        trim: true       // Automatically removes whitespace from both ends
    },
    description: {
        type: String,
        maxlength: 500,  // Optional short description of the service, limited to 500 characters
        trim: true       // Automatically removes whitespace from both ends
    },
    technicians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'      // References technicians who offer this service
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active' // Default to 'active'
    }
}, { timestamps: true }); // Include timestamps

module.exports = mongoose.model('Service', serviceSchema);
