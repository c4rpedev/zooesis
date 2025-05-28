
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useAuthActions } from '@/hooks/useAuthActions.js';

    export const useAuthSessionManagement = () => {
      const [user, setUser] = useState(null);
      const [isAdmin, setIsAdmin] = useState(false);
      const [loading, setLoading] = useState(true);

      const { fetchUserProfile } = useAuthActions(setUser, setIsAdmin, setLoading, user);

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
      }, [fetchUserProfile]);

      useEffect(() => {
        const getInitialSession = async () => {
          setLoading(true);
          try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
              console.error("Error getting initial session:", sessionError.message);
            }
            await handleUserSession(session);
          } catch (error) {
            console.error("Exception in getInitialSession:", error);
            setUser(null);
            setIsAdmin(false);
          } finally {
            setLoading(false);
          }
        };

        getInitialSession();

        const { data: authListenerData } = supabase.auth.onAuthStateChange(async (event, session) => {
          setLoading(true);
          try {
            await handleUserSession(session);
          } catch (error) {
            console.error("Exception in onAuthStateChange handler:", error);
            setUser(null);
            setIsAdmin(false);
          } finally {
            setLoading(false);
          }
        });

        return () => {
          authListenerData?.subscription?.unsubscribe();
        };
      }, [handleUserSession]);

      useEffect(() => {
        const handleVisibilityChange = async () => {
          if (document.visibilityState === 'visible') {
            setLoading(true);
            try {
              const { data: { session }, error: sessionError } = await supabase.auth.getSession();
              if (sessionError) {
                console.error("Error refreshing session on visibility change:", sessionError.message);
              }
              await handleUserSession(session);
            } catch (error) {
              console.error("Exception in handleVisibilityChange:", error);
              setUser(null);
              setIsAdmin(false);
            } finally {
              setLoading(false);
            }
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }, [handleUserSession]);
      
      return { user, setUser, isAdmin, setIsAdmin, loading, setLoading };
    };
  