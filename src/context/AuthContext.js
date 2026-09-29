import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../../firebase';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase auth listener note:', err?.message);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please ensure credentials are provided.');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please ensure credentials are provided.');
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) return;
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
