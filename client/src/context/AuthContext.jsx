import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          try {
              const parsedUser = JSON.parse(storedUser);
              // Ensure isAdmin is properly converted to boolean
              parsedUser.isAdmin = Boolean(parsedUser.isAdmin);
              setUser(parsedUser);
          } catch (error) {
              console.error('Error parsing stored user:', error);
              localStorage.removeItem('user');
          }
      }
  }, []);

  const login = (userData) => {
      // Ensure isAdmin is properly set as boolean
      const userWithBooleanAdmin = {
          ...userData,
          isAdmin: Boolean(userData.isAdmin)
      };
      setUser(userWithBooleanAdmin);
      localStorage.setItem('user', JSON.stringify(userWithBooleanAdmin));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
