const Review = require('../models/reviewModel');

exports.createReview = async (req, res) => {
    const { customer, technician, service, rating, reviewText } = req.body;

    try {
        const newReview = new Review({ customer, technician, service, rating, reviewText });
        await newReview.save();
        res.status(201).json({ message: 'Review created successfully', review: newReview });
    } catch (error) {
        res.status(400).json({ message: 'Error creating review', error });
    }
};

exports.getReviewsForTechnician = async (req, res) => {
    const { technicianId } = req.params;

    try {
        const reviews = await Review.find({ technician: technicianId }).populate('customer service');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching reviews', error });
    }
};
