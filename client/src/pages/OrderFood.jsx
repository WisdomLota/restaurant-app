import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function OrderFood() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/menu');
                setMenuItems(response.data);
            } catch (error) {
                toast.error('Failed to load menu');
            }
        };
        fetchMenu();
    }, []);

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem._id === item._id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem._id === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
        toast.success('Added to cart');
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item._id !== itemId));
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = async () => {
        try {
            // const response = await axios.post('http://localhost:3000/api/create-payment-intent', {
            //     items: cart,
            //     total: getTotal(),
            //     userId: user.id
            // });
            // navigate(`/checkout/${response.data.orderId}`); haven't implemented payment
            navigate('/confirmed-order');
        } catch (error) {
            toast.error('Failed to create order');
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Menu</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {menuItems.map(item => (
                            <div key={item._id} className="bg-white p-4 rounded-lg shadow">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-md"
                                />
                                <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                                <p className="text-gray-600">{item.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-primary font-bold">
                                        ${item.price.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="bg-primary text-white px-4 py-2 rounded-md"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow h-fit sticky top-4">
                    <h2 className="text-xl font-bold mb-4">Your Cart</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-500">Your cart is empty</p>
                    ) : (
                        <>
                            {cart.map(item => (
                                <div key={item._id} className="flex justify-between items-center mb-2">
                                    <div>
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t mt-4 pt-4">
                                <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>${getTotal().toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-primary text-white py-2 rounded-md mt-4"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderFood;