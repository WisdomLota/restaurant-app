import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';

const stripePromise = loadStripe('your_publishable_key');

function CheckoutForm({ clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        if (error) {
            toast.error(error.message);
        } else if (paymentIntent.status === 'succeeded') {
            toast.success('Payment successful!');
            navigate('/order-confirmation');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-md">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4'
                            }
                        },
                        invalid: {
                            color: '#9e2146'
                        }
                    }
                }} />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 disabled:opacity-50"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
}

function Checkout() {
    const [clientSecret, setClientSecret] = useState('');
    const { orderId } = useParams();

    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
                    orderId
                });
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                toast.error('Failed to initialize payment');
            }
        };
        fetchPaymentIntent();
    }, [orderId]);

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">
                    Complete Payment
                </h2>
                {clientSecret && (
                    <Elements stripe={stripePromise}>
                        <CheckoutForm clientSecret={clientSecret} />
                    </Elements>
                    )}
            </div>
        </div>
    );
}

export default Checkout;