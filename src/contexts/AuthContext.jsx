import React, { createContext, useContext, useMemo } from 'react';
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
  // Ahora useAuthSessionManagement devuelve todo lo necesario
  const value = useAuthSessionManagement();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
