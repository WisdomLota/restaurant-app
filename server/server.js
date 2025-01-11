require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/bookings');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/create-payment-intent', orderRoutes);

// Connect to MongoDB
connectDB();

// Basic route
app.get('/', (req, res) => {
    res.send('Restaurant API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});