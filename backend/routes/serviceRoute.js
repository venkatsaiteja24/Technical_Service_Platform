const express = require('express');
const { createService, getAllServices, filterTechnicians, getAllServiceNames } = require('../controllers/serviceController');

const router = express.Router();

router.post('/', createService); // Create a new service
router.get('/', getAllServices); // Get all services
router.get('/names', getAllServiceNames);
router.get('/filter', filterTechnicians); // Filter technicians based on service name and location

module.exports = router;