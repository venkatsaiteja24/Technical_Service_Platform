
const express = require('express')
const colors = require('colors')
const cors = require('cors'); // Import CORS
const dotenv = require('dotenv').config()
const {errorHandler} = require ('./middleware/errorMiddleware')
const port = process.env.PORT || 5000
const connectDB = require('./config/db')

connectDB()

const app = express()

// Enable CORS for all routes
app.use(cors(
  {
    origin: ["https://technical-service-platform-ytkr.vercel.app/"]
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/auth', require('./routes/userRoutes')); 
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes')); // Booking routes
app.use('/api/services', require('./routes/serviceRoute')); // Service routes
app.use('/api/reviews', require('./routes/reviewRoutes')); // Review routes

app.use(errorHandler);


app.listen(port, () => console.log(`server started on port ${port}`));
