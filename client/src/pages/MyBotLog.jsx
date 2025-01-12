import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function MyBotLog() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        const fetchUserLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login to view your history');
                    navigate('/login');
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };
    
                const [ordersRes, bookingsRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/orders/my-orders', { headers }),
                    axios.get('http://localhost:3000/api/bookings/my-bookings', { headers })
                ]);
    
                setOrders(ordersRes.data);
                setBookings(bookingsRes.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again');
                    navigate('/login');
                } else {
                    toast.error('Failed to fetch your history');
                }
                console.error('Error fetching user logs:', error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchUserLogs();
    }, [user, navigate]);    

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-6 p-4 space-y-6">
            <h1 className="text-2xl font-bold mb-8">My History</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-500">No orders found</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                                <div className="mt-2">
                                    <p className="text-sm font-medium mb-1">Items:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {order.items.map((item, index) => (
                                            <li key={index}>{item.name} × {item.quantity}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
                {bookings.length === 0 ? (
                    <p className="text-gray-500">No bookings found</p>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm text-gray-500">Booking ID: {booking._id}</p>
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="font-medium">Date: {new Date(booking.date).toLocaleDateString()}</p>
                                <p className="text-gray-600">Time: {booking.time}</p>
                                <p className="text-gray-600">Guests: {booking.guests}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBotLog;