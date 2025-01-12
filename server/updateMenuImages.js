const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem'); // Replace with your MenuItem model path

const updateMenuImages = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/restaurant-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await MenuItem.updateOne(
            { name: 'Caesar Salad' },
            { $set: { image: 'http://localhost:3000/uploads/caesarSalad.jpeg' } }
        );

        await MenuItem.updateOne(
            { name: 'Grilled Chicken Burger' },
            { $set: { image: 'http://localhost:3000/uploads/grilled-chicken-burger.jpeg' } }
        );

        await MenuItem.updateOne(
            { name: 'Spaghetti Bolognese' },
            { $set: { image: 'http://localhost:3000/uploads/spaghetti-bolognese.jpeg' } }
        );

        console.log('Images updated successfully');
        process.exit();
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
};

updateMenuImages();
