import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function MyBotLog() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchUserLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [ordersRes, bookingsRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/orders/my-orders', { headers }),
                    axios.get('http://localhost:3000/api/bookings/my-bookings', { headers })
                ]);

                setOrders(ordersRes.data);
                setBookings(bookingsRes.data);
            } catch (error) {
                console.error('Error fetching user logs:', error);
                toast.error('Failed to fetch your orders and bookings');
            }
        };

        if (user) {
            fetchUserLogs();
        }
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto mt-6 space-y-6">
            <h1 className="text-2xl font-bold">My Bot Log</h1>

            <div>
                <h2 className="text-xl font-semibold">My Orders</h2>
                {orders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    <ul>
                        {orders.map((order) => (
                            <li key={order._id} className="border p-4 mb-4">
                                <p>Order ID: {order._id}</p>
                                <p>Total: ${order.total.toFixed(2)}</p>
                                <p>Status: {order.status}</p>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>{item.name} - {item.quantity}x</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <h2 className="text-xl font-semibold">My Bookings</h2>
                {bookings.length === 0 ? (
                    <p>No bookings found</p>
                ) : (
                    <ul>
                        {bookings.map((booking) => (
                            <li key={booking._id} className="border p-4 mb-4">
                                <p>Booking ID: {booking._id}</p>
                                <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                                <p>Time: {booking.time}</p>
                                <p>Guests: {booking.guests}</p>
                                <p>Status: {booking.status}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MyBotLog;
