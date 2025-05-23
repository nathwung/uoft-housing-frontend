import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import ProtectedRoute from './components/ProtectedRoute';
import EditProfilePage from './pages/EditProfilePage';
import VerifiedRedirectPage from './pages/VerifiedRedirectPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<EditProfilePage />} />
        
        <Route path="/listings" element={
          <ProtectedRoute><ListingsPage /></ProtectedRoute>
        } />
        <Route path="/listing/:id" element={
          <ProtectedRoute><ListingDetailPage /></ProtectedRoute>
        } />
        <Route path="/post" element={
          <ProtectedRoute><CreateListingPage /></ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute><EditListingPage /></ProtectedRoute>
        } />
        <Route path="/verified" element={<VerifiedRedirectPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
