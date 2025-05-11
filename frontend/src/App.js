import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import VerifierDashboard from './VerifierDashboard';
import LoanApplication from './LoanApplication';
import UserDashboard from './UserDashboard';
import AdminAnalytics from './AdminAnalytics';
import Register from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const role = localStorage.getItem('role'); // Get role directly from localStorage

  // Route guards
  const ProtectedAdminRoute = ({ children }) => {
    console.log('ProtectedAdminRoute - Role:', role);
    if (role === 'admin') {
      console.log('Access granted to admin');
      return children;
    }
    console.log('Redirecting to login');
    return <Navigate to="/login" />;
  };

  const ProtectedVerifierRoute = ({ children }) => {
    console.log('ProtectedVerifierRoute - Role:', role);
    if (role === 'verifier') {
      console.log('Access granted to verifier');
      return children;
    }
    console.log('Redirecting to login');
    return <Navigate to="/login" />;
  };

  const ProtectedUserRoute = ({ children }) => {
    console.log('ProtectedUserRoute - Role:', role);
    if (role === 'user') {
      console.log('Access granted to user');
      return children;
    }
    console.log('Redirecting to login');
    return <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/verifier-dashboard"
        element={
          <ProtectedVerifierRoute>
            <VerifierDashboard />
          </ProtectedVerifierRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedUserRoute>
            <UserDashboard />
          </ProtectedUserRoute>
        }
      />

      {/* Other Routes */}
      <Route path="/loan-application" element={<LoanApplication />} />
      <Route path="/admin-analytics" element={<AdminAnalytics />} />
    </Routes>
  );
}

export default App;
