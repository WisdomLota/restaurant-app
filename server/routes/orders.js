const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

// Create a new order
router.post('/', async (req, res) => {
    const { items, total, userId } = req.body;

    // Validate input
    if (!items || items.length === 0 || !total || !userId) {
        console.log('Invalid payload:', req.body);
        return res.status(400).json({ message: 'Invalid order data' });
    }

    // Validate `userId`
    if (!mongoose.isValidObjectId(userId)) {
        console.log('Invalid userId:', userId);
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const order = new Order({
            user: userId,
            items,
            total,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/create', auth, async (req, res) => {
    try {
        const { items, total } = req.body;

        console.log('Authenticated User ID:', req.user.id); // Log user ID from the auth middleware

        const newOrder = new Order({
            user: req.user.id, // Assign logged-in user's ID
            items,
            total,
            status: 'pending', // Default status
            createdAt: new Date()
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
});


// Get all orders (admin only)
router.get('/all', auth, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (admin only)
router.patch('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get orders by user
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/my-orders', auth, async (req, res) => {
    try {
        console.log('Authenticated User ID:', req.user.id); // Ensure this logs the correct user ID
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

        console.log('Fetched Orders:', orders); // Log the orders fetched
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Failed to fetch user orders' });
    }
});


// Get user's orders (alternative endpoint)
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

        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




router.delete('/:id', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
