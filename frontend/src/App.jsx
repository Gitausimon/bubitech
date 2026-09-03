import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Storefront from './pages/Storefront';
import POSDashboard from './pages/POSDashboard';
import BookRepair from './pages/BookRepair';
import TechDashboard from './pages/TechDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import './index.css';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
         const token = await currentUser.getIdToken();
         localStorage.setItem('bubiToken', token);
      } else {
         localStorage.removeItem('bubiToken');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/login" element={user ? <Navigate to="/admin" replace /> : <Login />} />
        <Route path="/pos" element={<ProtectedRoute user={user}><POSDashboard /></ProtectedRoute>} />
        <Route path="/repairs/book" element={<BookRepair />} />
        <Route path="/tech" element={<ProtectedRoute user={user}><TechDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute user={user}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
