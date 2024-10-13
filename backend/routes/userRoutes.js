const express = require('express');
const { signup, login, getUser, updateUser} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getUser); // Get current user details
router.put('/me', authMiddleware, updateUser); // Update current user details




module.exports = router;