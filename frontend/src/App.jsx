import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Storefront from './pages/Storefront';
import POSDashboard from './pages/POSDashboard';
import BookRepair from './pages/BookRepair';
import TechDashboard from './pages/TechDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import { Navigate } from 'react-router-dom';
import './index.css';

const ProtectedRoute = ({ children, token }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('bubiToken'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/pos" element={<ProtectedRoute token={token}><POSDashboard /></ProtectedRoute>} />
        <Route path="/repairs/book" element={<BookRepair />} />
        <Route path="/tech" element={<ProtectedRoute token={token}><TechDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute token={token}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
