import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient.jsx';
// Importa aquí cualquier otra dependencia necesaria para las acciones
// import { someOtherHelper } from '@/lib/utils';


export const useAuthSessionManagement = (setUserState, setIsAdminState, setLoadingState, currentUser) => {

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define las acciones de autenticación directamente aquí o impórtalas y úsalas
  const fetchUserProfile = useCallback(async (userId) => {
    // Lógica para obtener el perfil del usuario de Supabase
    const { data, error } = await supabase

      .from('user_profiles') // Asume que tienes una tabla 'profiles'

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

  const login = async (email, password) => {
    if (setLoadingState) setLoadingState(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // if (data.user) {
      //   const profile = await fetchUserProfile(data.user.id);
      //   if (setUserState) setUserState({ ...data.user, profile });
      //   toast({
      //     title: t('loginSuccessTitle'),
      //     description: t('loginSuccessDescription'),
      //     variant: 'success',
      //   });
      // }
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('loginErrorTitle'),
        description: error.message || t('loginErrorDescription'),
        variant: 'destructive',
      });
      return { user: null, error };
    } finally {
      if (setLoadingState) setLoadingState(false);
    }
  };

  const logout = useCallback(async () => {

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

  // const signup = async (email, password, fullName) => {
  //   if (setLoadingState) setLoadingState(true);
  //   try {
  //     const { data, error } = await supabase.auth.signUp({ email, password });
  //     if (error) throw error;

  //     if (data.user) {
  //       const { error: profileError } = await supabase
  //         .from('user_profiles')
  //         .insert([{ id: data.user.id, full_name: fullName }]);

  //       if (profileError) {
  //         console.error('Error inserting user profile:', profileError);
  //         // Potentially delete the user if profile insertion fails
  //         // await supabase.auth.api.deleteUser(data.user.id); // Consider this implication carefully
  //         throw profileError; 
  //       }
  //       // Optionally, trigger a login or session refresh here if needed
  //       // For now, just returning the user data directly
  //       return { user: data.user, error: null };
  //     }
  //     // if user is null, but no error, it might mean email confirmation is required
  //     // depending on Supabase project settings.
  //     // For this implementation, we'll treat it as a success needing confirmation.
  //     // If specific handling for unconfirmed users is needed, it can be added here.
  //     return { user: data.user, error: null }; 
  //   } catch (error) {
  //     console.error('Signup error:', error);
  //     // Consider using a toast notification for errors, similar to login
  //     // toast({
  //     //   title: t('signupErrorTitle'),
  //     //   description: error.message || t('signupErrorDescription'),
  //     //   variant: 'destructive',
  //     // });
  //     return { user: null, error };
  //   } finally {
  //     if (setLoadingState) setLoadingState(false);
  //   }
  // };
  const signup = async (email, password, fullName) => {
    if (setLoadingState) setLoadingState(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      
      // if (data.user && data.user.identities && data.user.identities.length > 0) {
      //    toast({
      //     title: t('signupSuccessTitle'),
      //     description: t('signupSuccessDescription'),
      //     variant: 'success',
      //   });
      // } else if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      //    toast({
      //     title: t('signupNeedsVerificationTitle'),
      //     description: t('signupNeedsVerificationDescription'),
      //     variant: 'default',
      //     duration: 10000, 
      //   });
      // }
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      // toast({
      //   title: t('signupErrorTitle'),
      //   description: error.message || t('signupErrorDescription'),
      //   variant: 'destructive',
      // });
      return { user: null, error };
    } finally {
      if (setLoadingState) setLoadingState(false);
    }
  };
  
  return {
    user,
    isAdmin,
    loading,
    login,
    logout,
    signup, // Add signup to returned object

    fetchUserProfile, // Devuelve fetchUserProfile si es necesario fuera del hook
    // ... devuelve otras acciones
  };
};
