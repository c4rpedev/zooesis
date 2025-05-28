
    import { useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useToast } from '@/components/ui/use-toast.js';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    export const useAuthActions = (setUserState, setIsAdminState, setLoadingState, currentUser) => {
      const { toast } = useToast();
      const { t } = useTranslation();

      const fetchUserProfile = useCallback(async (userId) => {
        if (!userId) {
          if (setIsAdminState) setIsAdminState(false);
          return null;
        }
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('is_admin, full_name, avatar_url, subscription_plan, analyses_used')
            .eq('id', userId)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
            if (setIsAdminState) setIsAdminState(false);
            return null;
          }
          
          if (data) {
            if (setIsAdminState) setIsAdminState(data.is_admin || false);
            return data;
          }
          if (setIsAdminState) setIsAdminState(false);
          return null;
        } catch (error) {
          console.error('Error in fetchUserProfile:', error);
          if (setIsAdminState) setIsAdminState(false);
          return null;
        }
      }, [setIsAdminState]);

      const login = async (email, password) => {
        if (setLoadingState) setLoadingState(true);
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (data.user) {
            const profile = await fetchUserProfile(data.user.id);
            if (setUserState) setUserState({ ...data.user, profile });
            toast({
              title: t('loginSuccessTitle'),
              description: t('loginSuccessDescription'),
              variant: 'success',
            });
          }
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
          
          if (data.user && data.user.identities && data.user.identities.length > 0) {
             toast({
              title: t('signupSuccessTitle'),
              description: t('signupSuccessDescription'),
              variant: 'success',
            });
          } else if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
             toast({
              title: t('signupNeedsVerificationTitle'),
              description: t('signupNeedsVerificationDescription'),
              variant: 'default',
              duration: 10000, 
            });
          }
          return { user: data.user, error: null };
        } catch (error) {
          console.error('Signup error:', error);
          toast({
            title: t('signupErrorTitle'),
            description: error.message || t('signupErrorDescription'),
            variant: 'destructive',
          });
          return { user: null, error };
        } finally {
          if (setLoadingState) setLoadingState(false);
        }
      };

      const logout = async () => {
        if (setLoadingState) setLoadingState(true);
        try {
          await supabase.auth.signOut();
          if (setUserState) setUserState(null);
          if (setIsAdminState) setIsAdminState(false);
           toast({
            title: t('logoutSuccessTitle'),
            description: t('logoutSuccessDescription'),
            variant: 'success',
          });
        } catch (error) {
          console.error('Logout error:', error);
          toast({
            title: t('logoutErrorTitle'),
            description: error.message || t('logoutErrorDescription'),
            variant: 'destructive',
          });
        } finally {
          if (setLoadingState) setLoadingState(false);
        }
      };

      const sendPasswordResetEmail = async (email) => {
        if (setLoadingState) setLoadingState(true);
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
          });
          if (error) throw error;
          toast({
            title: t('passwordResetSuccessTitle'),
            description: t('passwordResetSuccessDescription'),
            variant: 'success',
          });
          return true;
        } catch (error) {
          console.error('Password reset error:', error);
          toast({
            title: t('passwordResetErrorTitle'),
            description: error.message || t('passwordResetErrorDescription'),
            variant: 'destructive',
          });
          return false;
        } finally {
          if (setLoadingState) setLoadingState(false);
        }
      };

      const updateUserPassword = async (newPassword) => {
        if (setLoadingState) setLoadingState(true);
        try {
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) throw error;
          toast({
            title: t('passwordUpdateSuccessTitle'),
            description: t('passwordUpdateSuccessDescription'),
            variant: 'success',
          });
          return true;
        } catch (error) {
          console.error('Password update error:', error);
          toast({
            title: t('passwordUpdateErrorTitle'),
            description: error.message || t('passwordUpdateErrorDescription'),
            variant: 'destructive',
          });
          return false;
        } finally {
          if (setLoadingState) setLoadingState(false);
        }
      };
      
      const updateUserProfile = async (userId, profileData) => {
        if (setLoadingState) setLoadingState(true);
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .update(profileData)
            .eq('id', userId)
            .select()
            .single();

          if (error) throw error;

          if (setUserState && currentUser && currentUser.id === userId) {
             setUserState(prevUser => ({
                ...prevUser,
                profile: { ...prevUser.profile, ...data }
              }));
          }
          
          if (setIsAdminState && profileData.is_admin !== undefined && currentUser && currentUser.id === userId) {
            setIsAdminState(profileData.is_admin);
          }
          
          toast({
            title: t('profileUpdateSuccessTitle'),
            description: t('profileUpdateSuccessDescription'),
            variant: 'success',
          });
          return { data, error: null };

        } catch (error) {
          console.error('Error updating user profile:', error);
          toast({
            title: t('profileUpdateErrorTitle'),
            description: error.message || t('profileUpdateErrorDescription'),
            variant: 'destructive',
          });
          return { data: null, error };
        } finally {
          if (setLoadingState) setLoadingState(false);
        }
      };

      return {
        fetchUserProfile,
        login,
        signup,
        logout,
        sendPasswordResetEmail,
        updateUserPassword,
        updateUserProfile,
      };
    };
  