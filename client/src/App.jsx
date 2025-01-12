import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/AdminDashboard';
import OrderFood from './pages/OrderFood';
import BookTable from './pages/BookTable';
import BookingConfirmed from './pages/BookingConfirmed';
import OrderConfirmation from './pages/OrderConfirmation';
import Checkout from './pages/Checkout';
import MyBotLog from './pages/MyBotLog';
import { AuthProvider } from './context/AuthContext';
import "./styles/index.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/order" element={<OrderFood />} />
              <Route path="/bookings" element={<BookTable />} />
              <Route path="/confirmed-booking" element={<BookingConfirmed />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmed-order" element={<OrderConfirmation/>} />
              <Route path="/my-bot-log" element={<MyBotLog/>} />
            </Routes>
          </div>
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;