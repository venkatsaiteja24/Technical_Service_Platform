const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');
const { userSchema } = require('../schemas/userSchemas'); // Import Zod schemas
const {z} = require('zod');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Signup Function
const signup = asyncHandler(async (req, res) => {
    try {
        const validatedData = userSchema.parse(req.body); // Validate request body with Zod
        const { username, email, password, role, customerDetails, technicianDetails } = validatedData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;

        // Create user based on role
        if (role === 'technician') {
            newUser = new User({
                username,
                email,
                password: hashedPassword,
                role,
                technicianDetails: {
                    phoneNumber: technicianDetails.phoneNumber,
                    profession: technicianDetails.profession,
                    skills: technicianDetails.skills,
                    address: technicianDetails.address,
                },
            });

            // After creating the user, link to the service
            const service = await Service.findOne({ name: technicianDetails.profession });
            if (service) {
                service.technicians.push(newUser._id); // Link technician to the service
                await service.save();
            } else {
                return res.status(404).json({ message: 'Service not found for the given profession' });
            }

        } else if (role === 'customer') {
            newUser = new User({
                username,
                email,
                password: hashedPassword,
                role,
                customerDetails: {
                    phoneNumber: customerDetails.phoneNumber,
                    address: customerDetails.address,
                },
            });

        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User created successfully', user: newUser, token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log('Zod Validation Errors:', error.errors); // Log validation errors
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: 'Error during signup', error: error.message });
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Login Function
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Extract the address from customerDetails or technicianDetails based on role
        const address = user.role === 'technician' 
            ? user.technicianDetails.address 
            : user.customerDetails.address;

        res.status(200).json({ 
            token, 
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                address: address || "Address not available" // Default message if address is not provided
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Get User Function
const getUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Update User Function
const updateUser = asyncHandler(async (req, res) => {
    const { username, email, password, technicianDetails, customerDetails } = req.body;

    if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);

    try {
        // Validate and update technician details
        if (req.user.role === 'technician' && technicianDetails) {
            userSchema.parse({ technicianDetails }); // Validate technician details with Zod
            updates.technicianDetails = technicianDetails;
        } 
        // Validate and update customer details
        else if (req.user.role === 'customer' && customerDetails) {
            userSchema.parse({ customerDetails }); // Validate customer details with Zod
            updates.customerDetails = customerDetails;
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors }); // Return Zod validation errors
        }
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Get All Technicians Function
const getAllTechnicians = asyncHandler(async (req, res) => {
    try {
        // Query for all technicians and select only the needed fields
        const technicians = await User.find(
            { role: 'technician' },
            {
                _id: 1, // Use _id to get the MongoDB ID
                username: 1,
                'technicianDetails.profession': 1,
                'technicianDetails.skills': 1,
                'technicianDetails.address': 1,
            }
        );

        if (technicians.length === 0) {
            return res.status(404).json({ message: 'No technicians found.' });
        }

        // Map to format the response to include the technician ID
        const formattedTechnicians = technicians.map(technician => ({
            userid: technician._id.toString(), // Convert ObjectId to string if necessary
            username: technician.username,
            profession: technician.technicianDetails.profession,
            skills: technician.technicianDetails.skills,
            address: technician.technicianDetails.address,
        }));

        res.status(200).json(formattedTechnicians);
    } catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).json({ message: 'Error fetching technicians', error: error.message });
    }
});


module.exports = {
    signup,
    login,
    getUser,
    updateUser,
    getAllTechnicians
};

