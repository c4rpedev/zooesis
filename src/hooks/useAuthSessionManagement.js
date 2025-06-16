import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient.jsx';
// Add these imports - adjust paths according to your project structure
// import { toast } from '@/components/ui/use-toast'; // or wherever your toast is
// import { useTranslation } from 'react-i18next'; // or your translation method

export const useAuthSessionManagement = (setUserState, setIsAdminState, setLoadingState, currentUser) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Add translation hook if using i18n
  // const { t } = useTranslation();
  
  // Add ref to prevent duplicate listeners
  const initialized = useRef(false);

  // Helper function to check if session is valid
  const isSessionValid = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return !error && session !== null;
    } catch {
      return false;
    }
  }, []);

  // Sync internal state with external state setters
  useEffect(() => {
    if (setUserState) setUserState(user);
  }, [user, setUserState]);

  useEffect(() => {
    if (setIsAdminState) setIsAdminState(isAdmin);
  }, [isAdmin, setIsAdminState]);

  useEffect(() => {
    if (setLoadingState) setLoadingState(loading);
  }, [loading, setLoadingState]);

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*, phone, country')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        setIsAdmin(false);
        return null;
      }

      // Set admin status based on profile
      const adminStatus = data?.is_admin || false;
      setIsAdmin(adminStatus);
      return data;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      setIsAdmin(false);
      return null;
    }
  }, []);

  const handleUserSession = useCallback(async (session) => {
    setLoading(true);
    try {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        const userWithProfile = { ...session.user, profile };
        setUser(userWithProfile);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error handling user session:", error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    // Prevent duplicate initialization
    if (initialized.current) return;
    initialized.current = true;

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session);
    });

    // Handle initial session on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [handleUserSession]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        const userWithProfile = { ...data.user, profile };
        setUser(userWithProfile);
        
        // Uncomment and adjust these lines based on your toast/translation setup
        // toast({
        //   title: t('loginSuccessTitle'),
        //   description: t('loginSuccessDescription'),
        //   variant: 'success',
        // });
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      
      // Uncomment and adjust these lines based on your toast/translation setup
      // toast({
      //   title: t('loginErrorTitle'),
      //   description: error.message || t('loginErrorDescription'),
      //   variant: 'destructive',
      // });
      
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Check if there's an active session before attempting logout
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error && error.message !== "Auth session missing!") {
          console.error("Error signing out:", error);
          throw error;
        }
      }
      
      // Always clear user state regardless of session status
      setUser(null);
      setIsAdmin(false);
      
      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      
      // If the error is about missing session, still clear the state
      if (error.message === "Auth session missing!" || error.code === "session_not_found") {
        setUser(null);
        setIsAdmin(false);
        return { error: null }; // Treat as successful logout
      }
      
      return { error };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = async (email, password, fullName, phone, country) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,     
            country: country
          },
        },
      });
      
      if (error) throw error;
      
      // Handle signup success/verification needed logic here
      // Uncomment and adjust based on your toast/translation setup
      // if (data.user && data.user.identities && data.user.identities.length > 0) {
      //   toast({
      //     title: t('signupSuccessTitle'),
      //     description: t('signupSuccessDescription'),
      //     variant: 'success',
      //   });
      // } else if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      //   toast({
      //     title: t('signupNeedsVerificationTitle'),
      //     description: t('signupNeedsVerificationDescription'),
      //     variant: 'default',
      //     duration: 10000, 
      //   });
      // }
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Uncomment and adjust based on your toast/translation setup
      // toast({
      //   title: t('signupErrorTitle'),
      //   description: error.message || t('signupErrorDescription'),
      //   variant: 'destructive',
      // });
      
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    user,
    isAdmin,
    loading,
    login,
    logout,
    signup,
    fetchUserProfile,
    isSessionValid,
  };
};