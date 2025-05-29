import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient.jsx';
// Importa aquí cualquier otra dependencia necesaria para las acciones
// import { someOtherHelper } from '@/lib/utils';

export const useAuthSessionManagement = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define las acciones de autenticación directamente aquí o impórtalas y úsalas
  const fetchUserProfile = useCallback(async (userId) => {
    // Lógica para obtener el perfil del usuario de Supabase
    const { data, error } = await supabase
      .from('profiles') // Asume que tienes una tabla 'profiles'
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      setIsAdmin(false); // O maneja el error según tu lógica
      return null;
    }

    // Lógica para determinar si el usuario es administrador basada en el perfil
    setIsAdmin(data?.is_admin || false);
    return data;
  }, [/* Dependencias si las hay */]); // Agrega dependencias si fetchUserProfile usa variables externas

  const handleUserSession = useCallback(async (session) => {
    setLoading(true);
    if (session?.user) {
      const profile = await fetchUserProfile(session.user.id);
      setUser({ ...session.user, profile });
    } else {
      setUser(null);
      setIsAdmin(false);
    }
    setLoading(false);
  }, [fetchUserProfile]); // Depende de fetchUserProfile

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session);
    });

    // Manejar la sesión inicial al cargar la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [handleUserSession]);

  // Define otras acciones de autenticación aquí
  const signIn = useCallback(async (credentials) => {
    // Lógica para iniciar sesión
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    setLoading(false);
    if (error) {
      console.error("Error signing in:", error);
      throw error; // Lanza el error para ser manejado en la UI
    }
    return data;
  }, []);

  const signOut = useCallback(async () => {
    // Lógica para cerrar sesión
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }, []);

  // ... otras acciones (signUp, resetPassword, etc.)

  return {
    user,
    isAdmin,
    loading,
    signIn,
    signOut,
    fetchUserProfile, // Devuelve fetchUserProfile si es necesario fuera del hook
    // ... devuelve otras acciones
  };
};
