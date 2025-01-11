import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function BookTable() {
    const [booking, setBooking] = useState({
        date: '',
        time: '',
        guests: 1
    });
    const { user } = useAuth();
    const navigate = useNavigate();

    const timeSlots = [
        '12:00', '13:00', '14:00', '15:00', '18:00', 
        '19:00', '20:00', '21:00', '22:00'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/bookings', {
                ...booking,
                userId: user.id
            });
            toast.success('Table booked successfully!');
            navigate('/my-bookings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">
                    Book a Table
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded-md"
                            value={booking.date}
                            onChange={(e) => setBooking({...booking, date: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Time</label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={booking.time}
                            onChange={(e) => setBooking({...booking, time: e.target.value})}
                            required
                        >
                            <option value="">Select time</option>
                            {timeSlots.map(time => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Number of Guests</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-md"
                            value={booking.guests}
                            onChange={(e) => setBooking({...booking, guests: parseInt(e.target.value)})}
                            min="1"
                            max="10"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90"
                    >
                        Book Now
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookTable;