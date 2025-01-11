import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Restaurant Chatbot
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-200">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-gray-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;