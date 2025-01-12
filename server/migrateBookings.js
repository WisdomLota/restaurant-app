const mongoose = require('mongoose');

const Booking = require('./models/Booking'); // Replace with the correct path to your Booking model
const User = require('./models/User'); // Replace with the correct path to your User model

const migrateBookings = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/restaurant-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Fetch all bookings with user as a String
        const bookings = await Booking.find({ user: { $type: 'string' } });
        console.log(`Found ${bookings.length} bookings to migrate`);

        for (const booking of bookings) {
            // Find the corresponding user
            const user = await User.findOne({ email: booking.user }); // Assuming user email is stored in the `user` field

            if (user) {
                // Update the booking with the user's ObjectId
                booking.user = user._id;
                await booking.save();
                console.log(`Migrated booking ${booking._id} to use ObjectId`);
            } else {
                console.warn(`No matching user found for booking ${booking._id} with user ${booking.user}`);
            }
        }

        console.log('Migration complete');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateBookings();
