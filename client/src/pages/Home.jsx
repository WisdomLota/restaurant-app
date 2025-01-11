import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: "Hello! Welcome to our restaurant. How can I help you today?",
      isBot: true
    }
  ]);

  const handleAction = (action) => {
    if (!user) {
      navigate('/login');
      return;
    }

    switch (action) {
      case 'order':
        navigate('/order');
        break;
      case 'book':
        navigate('/book');
        break;
      case 'orders':
        navigate('/my-orders');
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary p-4 flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Restaurant Chatbot</h1>
          {user && (
            <button
              onClick={() => navigate('/logout')}
              className="text-white hover:text-gray-200"
            >
              Logout
            </button>
          )}
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.isBot
                    ? 'bg-gray-100'
                    : 'bg-primary text-white'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t space-x-4 flex justify-center">
          <button
            onClick={() => handleAction('order')}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90"
          >
            Order Food Online
          </button>
          <button
            onClick={() => handleAction('book')}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90"
          >
            Book a Table
          </button>
          <button
            onClick={() => handleAction('orders')}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90"
          >
            My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;