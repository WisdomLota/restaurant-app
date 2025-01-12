const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Create a new order
const mongoose = require('mongoose');

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




// Get all orders (admin only)
router.get('/all', async (req, res) => {
    // if (!req.user.isAdmin) {
    //     return res.status(403).json({ message: 'Access denied. Admins only.' });
    // }

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

router.patch('/:id', auth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid order ID format' });
    }

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

module.exports = router;
