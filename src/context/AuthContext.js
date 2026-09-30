import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
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

    let unsubscribe = () => {};

    // Explicitly enforce browserLocalPersistence so sessions persist across page reloads and refreshes
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          if (currentUser && typeof window !== 'undefined') {
            localStorage.setItem('firebase_auth_active', 'true');
          } else if (typeof window !== 'undefined') {
            localStorage.removeItem('firebase_auth_active');
          }
          setLoading(false);
        });
      })
      .catch((err) => {
        console.warn('Firebase setPersistence note:', err?.message);
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
      });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please ensure credentials are provided.');
    await setPersistence(auth, browserLocalPersistence).catch(() => {});
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please ensure credentials are provided.');
    await setPersistence(auth, browserLocalPersistence).catch(() => {});
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('firebase_auth_active');
    }
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
