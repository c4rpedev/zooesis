
    import React, { createContext, useContext, useMemo } from 'react';
    import { useAuthActions } from '@/hooks/useAuthActions.js';
    import { useAuthSessionManagement } from '@/hooks/useAuthSessionManagement.js';

    const AuthContext = createContext(null);

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
      }
      return context;
    };

    export const AuthProvider = ({ children }) => {
      const { 
        user, 
        setUser, 
        isAdmin, 
        setIsAdmin, 
        loading,
        setLoading, 
      } = useAuthSessionManagement();

      const authActions = useAuthActions(setUser, setIsAdmin, setLoading, user);
      
      const value = useMemo(() => ({
        user,
        isAdmin,
        loading,
        ...authActions,
      }), [user, isAdmin, loading, authActions]);

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };
  