const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Create a new booking
router.post('/', auth, async (req, res) => {
    try {
        const { date, time, guests } = req.body;

        // Check for availability
        const existingBookings = await Booking.countDocuments({
            date,
            time,
            status: { $ne: 'cancelled' } // Consider only active bookings
        });

        if (existingBookings >= 10) { // Assume 10 tables are available per time slot
            return res.status(400).json({ message: 'No available tables for this time' });
        }

        const booking = new Booking({
            user: req.user.id, // Associate the booking with the logged-in user
            date,
            time,
            guests,
            status: 'confirmed'
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get all bookings (admin only)
router.get('/all', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .sort({ date: 1, time: 1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's bookings
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .sort({ date: 1, time: 1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status
router.patch('/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/my-bookings', auth, async (req, res) => {
    try {
        console.log('Authenticated User ID:', req.user.id); // Debug the logged-in user ID
        const bookings = await Booking.find({ user: req.user.id })
            .sort({ date: -1 }); // Fetch bookings for the logged-in user
        console.log('Fetched Bookings:', bookings); // Debug fetched bookings
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get user's bookings (alternative endpoint)
router.get('/user/:userId', auth, async (req, res) => {
    try {
        console.log('Request Params:', req.params); // Debug request parameters
        console.log('Decoded User ID:', req.user.id); // Debug decoded user ID

        if (!req.params.userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (req.user.id !== req.params.userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const bookings = await Booking.find({ user: req.params.userId }).sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Cancel booking
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;