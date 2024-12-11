const express = require('express');
const { createReview, getReviewsForTechnician } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createReview); // Create a new review
router.get('/:technicianId', getReviewsForTechnician); // Get reviews for a specific technician

module.exports = router;