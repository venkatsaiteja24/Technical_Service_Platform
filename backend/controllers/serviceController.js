const User = require('../models/userModel');
const Service = require('../models/serviceModel');

// Create Service Function
exports.createService = async (req, res) => {
    const { name, description } = req.body;

    // Validate required fields
    if (!name || !description) {
        return res.status(400).json({ message: 'name and description are required.' });
    }

    try {
        const newService = new Service({ name, description });
        await newService.save();
        res.status(201).json({ message: 'Service created successfully', service: newService });
    } catch (error) {
        res.status(400).json({ message: 'Error creating service', error });
    }
};

// Get All Services Function
exports.getAllServices = async (req, res) => {
    try {
        // Fetch all services with populated technicians
        const services = await Service.find().populate('technicians');

        // Remove passwords from the technicians' details
        const servicesWithoutPasswords = services.map(service => {
            return {
                ...service._doc, // Spread the service document
                technicians: service.technicians.map(technician => {
                    const { password, ...technicianWithoutPassword } = technician._doc; // Exclude the password
                    return technicianWithoutPassword; // Return the technician without the password
                })
            };
        });

        res.status(200).json(servicesWithoutPasswords);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching services', error });
    }
};

//Get All Service Names Function
exports.getAllServiceNames = async (req, res) => {
    try {
        // Fetch all services and return only their names
        const services = await Service.find({}, 'name'); // Get only the 'name' field

        // If no services found, send a message
        if (services.length === 0) {
            return res.status(404).json({ message: 'No services found' });
        }

        res.status(200).json(services); // Return the list of service names
    } catch (error) {
        res.status(400).json({ message: 'Error fetching services', error });
    }
};

// Filter Technicians Function
exports.filterTechnicians = async (req, res) => {
    const { serviceName, city } = req.query; // Get service name and city from query params

    try {
        // Find technicians that offer the specified service and are located in the specified city
        const technicians = await User.find({
            role: 'technician',
            'technicianDetails.profession': serviceName, // Match the technician's profession to the service name
            'technicianDetails.address.city': { $regex: city, $options: 'i' } // Match city in address
        });

        if (technicians.length === 0) {
            return res.status(404).json({ message: 'No technicians found for this service and city.' });
        }

        res.status(200).json(technicians);
    } catch (error) {
        res.status(400).json({ message: 'Error filtering technicians', error });
    }
};
// 
// Service Lookup by Name: Instead of looking up the service ID, we directly check if the technician's profession matches the serviceName provided in the query parameters.
// City Filtering: The city filtering logic remains the same, using a regex to perform a case-insensitive search.