const express = require('express');
const { createService, getAllServices, filterTechnicians } = require('../controllers/serviceController');

const router = express.Router();

router.post('/', createService); // Create a new service
router.get('/', getAllServices); // Get all services
router.get('/filter', filterTechnicians); // Filter technicians based on service name and location

module.exports = router;