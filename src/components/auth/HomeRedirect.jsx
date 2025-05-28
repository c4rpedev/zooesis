
    import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import LandingPage from '@/pages/LandingPage.jsx';

    const HomeRedirect = () => {
      const { user, isAdmin, loading } = useAuth();

      if (loading) {
        return null; 
      }

      if (user) {
        return isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />;
      }

      return <LandingPage />;
    };

    export default HomeRedirect;
  