import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import LoadingPage from '../pages/loading';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckAuthLoading, setIsCheckAuthLoading] = useState(false);

  const checkAuth = async () => {
    setIsCheckAuthLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/auth/me', {
        withCredentials: true,
      });
      setUser(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      // console.log('checkAuth:error caught');
      // console.error(error);
    }
    setIsCheckAuthLoading(false);
  };

  const handleSignOut = async () => {
    const itoast = toast.loading('Signing in...', { position: 'bottom-right' })
    try {
      const response = await axios.get('http://localhost:8000/auth/signout', { withCredentials: true });
      setUser({})
      setIsAuthenticated(false)
      toast.update(itoast, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000
      })
    } catch (error) {
      // console.log('handleSignOut:error caught')
      // console.error(error);

      let errorMessage = error.response?.data.message
      errorMessage = errorMessage ? errorMessage : error.message
      toast.update(itoast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 2000
      })
    }
  };

  useEffect(() => { checkAuth(); }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        checkAuth,
        isCheckAuthLoading,
        isAuthenticated,
        setIsAuthenticated,
        handleSignOut,
      }}
    >

      {isCheckAuthLoading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
