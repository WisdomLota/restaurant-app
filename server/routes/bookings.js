const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Create a new booking
router.post('/bookings', async (req, res) => {
    try {
        const { date, time, guests, userId } = req.body;
        
        // Check if there's availability
        const existingBookings = await Booking.countDocuments({
            date,
            time,
            status: { $ne: 'cancelled' }
        });

        if (existingBookings >= 10) { // Assuming max 10 tables per time slot
            return res.status(400).json({ message: 'No available tables for this time' });
        }

        const booking = new Booking({
            user: userId,
            date,
            time,
            guests
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings (admin only)
router.get('/all', auth, async (req, res) => {
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
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;