const express = require('express');
const { signup, login, getUser, updateUser, getAllTechnicians} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getUser); // Get current user details
router.put('/update', authMiddleware, updateUser); // Update current user details
router.get('/all-technicians', getAllTechnicians);




module.exports = router;