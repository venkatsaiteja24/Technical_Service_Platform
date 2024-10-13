const mongoose = require ('mongoose')

const reviewSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',// References the customer (User model)
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',// References the technician (User model)
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',// References the service being reviewed
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true  // A rating between 1 and 5
    },
    reviewText: {
        type: String,  // Optional written feedback
        maxlength: 1000  // Limit to 1000 characters
    },
    date: {
        type: Date,
        default: Date.now  // Automatically set the current date when the review is created
    }
});

module.exports = mongoose.model('Review', reviewSchema);