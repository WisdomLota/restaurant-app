import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function BookingConfirmed() {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                    Thank you for your booking. We hope to see you soon!
                </p>
                <p className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90" onClick={() => navigate('/')}>Go Home</p>
                {/* <button
                    onClick={() => navigate('/my-orders')}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
                >
                    View My Orders
                </button> */}
            </div>
        </div>
    );
}

export default BookingConfirmed;