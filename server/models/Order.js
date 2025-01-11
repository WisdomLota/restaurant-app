const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        name: String,
        quantity: Number,
        price: Number
    }],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    paymentStatus: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);