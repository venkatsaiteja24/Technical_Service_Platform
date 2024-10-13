const validateStatus = (req, res, next) => {
    const { status } = req.body; // or req.params if used for confirmation
    if (!status || !['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid booking status' });
    }
    next();
};

// In your routes file
router.patch('/:id/status', authMiddleware, validateStatus, updateBookingStatus);
