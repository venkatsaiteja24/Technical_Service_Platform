const { z } = require('zod');

// Address Schema
const addressSchema = z.object({
    street: z.string().nonempty('Please enter street address'),
    city: z.string().nonempty('Please enter city'),
    state: z.string().nonempty('Please enter state').regex(/^[A-Za-z]{2}$/, 'Please enter a valid 2-letter state abbreviation'),
    zipCode: z.string().nonempty('Please enter zip code').regex(/^\d{5}$/, 'Please enter a valid zip code'),
});

// Customer Schema
const customerSchema = z.object({
    phoneNumber: z.string().nonempty('Please enter Phone Number').regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number'),
    address: addressSchema,
});

// Technician Schema
const technicianSchema = z.object({
    phoneNumber: z.string().nonempty('Please enter Phone Number').regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number'),
    address: addressSchema,
    profession: z.string().nonempty('Please enter Profession'),
    skills: z.array(z.string().nonempty('Please enter Skills')),
});

// User Schema
const userSchema = z.object({
    username: z.string().nonempty('Please add a name'),
    email: z.string().email('Please enter a valid email address').nonempty('Please add an email'),
    password: z.string().nonempty('Please add a password'),
    role: z.enum(['customer', 'technician']),
    customerDetails: customerSchema.optional(),
    technicianDetails: technicianSchema.optional(),
});

module.exports = { userSchema, customerSchema, technicianSchema, addressSchema };
