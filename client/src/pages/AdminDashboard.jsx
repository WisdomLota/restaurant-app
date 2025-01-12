import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const toastShown = useRef(false); // Ref to prevent duplicate toasts
    const { user } = useAuth();

    const navigate = useNavigate();

    // In AdminDashboard.jsx, modify the useEffect:
    useEffect(() => {
        if (!user || user.isAdmin == true ) {
            if (!toastShown.current) {
                // toast.error('Unauthorized access, only admins allowed');
                toastShown.current = true; // Mark toast as shown
            }
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                if (!toastShown.current) {
                    toast.error('Token not found. Please log in again.');
                    toastShown.current = true; // Mark toast as shown
                }
                navigate('/login');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            const [ordersRes, bookingsRes] = await Promise.all([
                axios.get('http://localhost:3000/api/orders/all', { headers }),
                axios.get('http://localhost:3000/api/bookings/all', { headers })
            ]);

            setOrders(ordersRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            if (!toastShown.current) {
                toast.error('Failed to fetch data. Admin access required.');
                toastShown.current = true; // Mark toast as shown
            }
            navigate('/');
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required. Please log in.');
                return;
            }
    
            const headers = { Authorization: `Bearer ${token}` };
    
            await axios.patch(`http://localhost:3000/api/orders/${orderId}`, { status }, { headers });
            toast.success('Order status updated');
            fetchData(); // Refresh the list
        } catch (error) {
            console.error('Failed to update order:', error);
            toast.error('Failed to update order');
        }
    };
    
    
    
    const updateBookingStatus = async (bookingId, status) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token
            if (!token) {
                toast.error('Authentication required. Please log in.');
                return;
            }
    
            const headers = { Authorization: `Bearer ${token}` };
    
            await axios.patch(`http://localhost:3000/api/bookings/${bookingId}`, { status }, { headers });
            toast.success('Booking status updated');
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to update booking:', error);
            toast.error('Failed to update booking');
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required. Please log in.');
                return;
            }
    
            const headers = { Authorization: `Bearer ${token}` };
    
            await axios.delete(`http://localhost:3000/api/orders/${orderId}`, { headers });
            toast.success('Order deleted successfully');
            fetchData(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete order:', error);
            toast.error('Failed to delete order');
        }
    };

    const deleteBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required. Please log in.');
                return;
            }
    
            const headers = { Authorization: `Bearer ${token}` };
    
            await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`, { headers });
            toast.success('Booking deleted successfully');
            fetchData(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete booking:', error);
            toast.error('Failed to delete booking');
        }
    };
    
    
    
    
    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="flex mb-6 space-x-4">
                <button
                    className={`px-4 py-2 rounded-md ${
                        activeTab === 'orders' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${
                        activeTab === 'bookings' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('bookings')}
                >
                    Bookings
                </button>
            </div>

            {activeTab === 'orders' ? (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left">Order ID</th>
                                <th className="px-6 py-3 text-left">Customer</th>
                                <th className="px-6 py-3 text-left">Items</th>
                                <th className="px-6 py-3 text-left">Total</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} className="border-t">
                                    <td className="px-6 py-4">{order._id}</td>
                                    <td className="px-6 py-4">{order.user?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4">
                                        {order.items.map(item => (
                                            `${item.name} (${item.quantity})`
                                        )).join(', ')}
                                    </td>
                                    <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">{order.status}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className="border rounded p-1"
                                            value={order.status}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="preparing">Preparing</option>
                                            <option value="ready">Ready</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => deleteOrder(order._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                                        >
                                        Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left">Booking ID</th>
                                <th className="px-6 py-3 text-left">Customer</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Time</th>
                                <th className="px-6 py-3 text-left">Guests</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking._id} className="border-t">
                                    <td className="px-6 py-4">{booking._id}</td>
                                    <td className="px-6 py-4">{booking.user?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4">{new Date(booking.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{booking.time}</td>
                                    <td className="px-6 py-4">{booking.guests}</td>
                                    <td className="px-6 py-4">{booking.status}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                                            className="border rounded p-1"
                                            value={booking.status}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => deleteBooking(booking._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                                        >
                                        Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;