import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For the manage subscription button
import { useAuth } from '@/contexts/AuthContext.jsx';
import { supabase } from '@/lib/supabaseClient.jsx'; // For profile updates, if not handled by AuthContext's updateUser
import { useToast } from '@/components/ui/use-toast.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { UserCircle, Mail, Edit3, Save, Loader2, LockKeyhole as ShieldKeyhole, Briefcase, BarChart2, CalendarClock, Check, AlertTriangle } from 'lucide-react'; // Added icons
import { motion } from 'framer-motion';
import { useTranslation } from '@/contexts/TranslationContext.jsx';
import { getPlanDetails } from '@/lib/planConfig.js'; // Ensure this path is correct

const ProfilePage = () => {
  const { user, updateUser, loading: authLoading, refreshUserProfile } = useAuth(); // Assuming refreshUserProfile or similar might exist
  const { toast } = useToast();
  const { t, language: currentLanguage } = useTranslation();
  const navigate = useNavigate();

  // State for editable fields (full_name, avatar_url)
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  // State for password change
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // For general form submission
  const [profileDataLoading, setProfileDataLoading] = useState(true); // For initial load of profile fields

  // Derived state for subscription details (read directly from user.profile)
  const subscriptionPlanId = user?.profile?.subscription_plan_id;
  const analysisCount = user?.profile?.analysis_count ?? 0; // Default to 0 if null/undefined
  const currentPeriodEnd = user?.profile?.current_period_end;
  const planDetails = subscriptionPlanId ? getPlanDetails(subscriptionPlanId) : getPlanDetails('free');


  useEffect(() => {
    // If AuthContext provides these, direct fetching here might not be needed
    // or can be a fallback/manual refresh.
    // For now, assuming user.profile is populated by AuthContext.
    if (user?.profile) {
      setFullName(user.profile.full_name || user.email || '');
      setAvatarUrl(user.profile.avatar_url || '');
      setProfileDataLoading(false);
    } else if (user && !user.profile && !authLoading) {
      // If user exists but profile is somehow null and auth is not loading,
      // it might indicate an issue or a new user whose profile isn't fetched yet by AuthContext.
      // A manual refresh function from AuthContext could be useful here.
      // Or, if your AuthContext always ensures profile is fetched, this might not be needed.
      console.warn("User profile data not available in AuthContext on ProfilePage mount.");
      setProfileDataLoading(false); // Stop loading to prevent infinite spinner
    } else if (!user && !authLoading) {
      setProfileDataLoading(false); // No user and not loading auth, so stop profile loading
    }
  }, [user, authLoading]);


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const profileUpdates = {
      id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileUpdates, { onConflict: 'id' });

      if (profileError) throw profileError;

      const authUpdates = {};
      if (user.user_metadata?.full_name !== fullName) authUpdates.full_name = fullName;
      if (user.user_metadata?.avatar_url !== avatarUrl) authUpdates.avatar_url = avatarUrl;

      if (Object.keys(authUpdates).length > 0) {
        const { error: authDataError } = await updateUser({ data: authUpdates }); // Use updateUser from useAuth
         if (authDataError) {
            console.warn("Auth metadata update failed, but profile saved:", authDataError.message);
            toast({ title: t('profileUpdatedParcialmente', {defaultValue: "Profile Partially Updated"}), description: t('profileUpdatedAuthError', {defaultValue: "Could not update some authentication details."}), variant: 'warning' });
        }
      }
      
      // If AuthContext has a refresh function:
      if (typeof refreshUserProfile === 'function') {
        await refreshUserProfile();
      }

      toast({ title: t('profileUpdatedTitle'), description: t('profileUpdatedSuccess') });
      setIsEditing(false);
    } catch (error) {
      toast({ title: t('profileUpdateError'), description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    // ... (password update logic remains the same)
        e.preventDefault();
        if (newPassword !== confirmPassword) {
          toast({ title: t('passwordMismatchTitle'), description: t('passwordMismatchMessage'), variant: 'destructive' });
          return;
        }
        if (newPassword.length < 6) {
          toast({ title: t('passwordTooShortTitle'), description: t('passwordTooShortMessage', {minLength: 6}), variant: 'destructive' });
          return;
        }
        setLoading(true);
        try {
          const { error } = await updateUser({ password: newPassword }); // Use updateUser from useAuth
          if (error) throw error;
          toast({ title: t('passwordUpdatedTitle'), description: t('passwordUpdatedSuccess') });
          setNewPassword('');
          setConfirmPassword('');
        } catch (error) {
          toast({ title: t('passwordUpdateError'), description: error.message, variant: 'destructive' });
        } finally {
          setLoading(false);
        }
  };
  
  // Combined loading state
  if (authLoading || (!user && !authLoading && profileDataLoading) || (user && !user.profile && profileDataLoading) ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center py-10">{t('mustBeLoggedIn')}</p>;
  }
  
  // If user exists, but profile is still null/undefined after loading attempts (and not authLoading)
  // This might indicate a new user whose profile creation via trigger/client-side is delayed or failed.
  if (!user.profile) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-lg text-slate-700 dark:text-slate-200">{t('profileDataNotAvailableTitle', {defaultValue: "Profile Data Not Available"})}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('profileDataNotAvailableMessage', {defaultValue: "Your profile data is still being prepared or could not be loaded. Please try refreshing the page in a moment."})}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">{t('refreshPageButton', {defaultValue: "Refresh Page"})}</Button>
        </div>
    );
  }


  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-2xl mx-auto shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md">
        {/* Personal Information Form ... (same as your existing code) ... */}
        <CardHeader className="text-center p-8 bg-primary/10 dark:bg-primary/20 rounded-t-lg">
            <UserCircle className="mx-auto h-20 w-20 text-primary mb-3" />
            <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">{t('profileSettingsTitle')}</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 pt-1">{t('profileSettingsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
            {/* Personal Info Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* ... (email, fullName, avatarUrl inputs and edit/save button - same as your code) ... */}
                 <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center"><UserCircle className="mr-2 h-6 w-6 text-primary"/>{t('personalInformation')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center text-slate-700 dark:text-slate-200">
                    <Mail className="mr-2 h-5 w-5 text-primary" /> {t('emailAddress')}
                  </Label>
                  <Input id="email" type="email" value={user.email} disabled className="h-11 bg-slate-100 dark:bg-slate-700 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center text-slate-700 dark:text-slate-200">
                    <UserCircle className="mr-2 h-5 w-5 text-primary" /> {t('fullName')}
                  </Label>
                  <Input 
                    id="fullName" type="text" value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    disabled={!isEditing} 
                    className={`h-11 ${!isEditing ? 'bg-slate-100 dark:bg-slate-700 cursor-not-allowed' : ''}`}
                    placeholder={t('enterFullNamePlaceholder')}
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="avatarUrl" className="flex items-center text-slate-700 dark:text-slate-200">
                    <UserCircle className="mr-2 h-5 w-5 text-primary" /> {t('avatarUrl')}
                  </Label>
                  <Input 
                    id="avatarUrl" type="text" value={avatarUrl} 
                    onChange={(e) => setAvatarUrl(e.target.value)} 
                    disabled={!isEditing} 
                    className={`h-11 ${!isEditing ? 'bg-slate-100 dark:bg-slate-700 cursor-not-allowed' : ''}`}
                    placeholder={t('enterAvatarUrlPlaceholder')}
                  />
                  {avatarUrl && <img src={avatarUrl} alt={t('avatarPreviewAlt')} className="mt-2 h-20 w-20 rounded-full object-cover border-2 border-primary"/>}
                </div>
                <div className="flex justify-end">
                  {isEditing ? (
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} {t('saveChanges')}
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit3 className="mr-2 h-4 w-4" /> {t('editProfile')}
                    </Button>
                  )}
                </div>
            </form>
            <hr className="dark:border-slate-700"/>
            {/* Password Change Form */}
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                {/* ... (newPassword, confirmPassword inputs and update button - same as your code) ... */}
                 <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center"><ShieldKeyhole className="mr-2 h-6 w-6 text-primary"/>{t('changePassword')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('newPassword')}</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('confirmNewPassword')}</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="h-11" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading || !newPassword}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} {t('updatePassword')}
                  </Button>
                </div>
            </form>
        </CardContent>

        {/* === Subscription Details Section === */}
        <CardFooter className="p-8 border-t dark:border-slate-700 flex-col items-start space-y-6">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center">
            <Briefcase className="mr-2 h-6 w-6 text-primary"/> {t('subscriptionDetailsTitle', {defaultValue: "Subscription Details"})}
          </h3>
          
          <div className="w-full space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300 font-medium">{t('currentPlanLabel', {defaultValue: "Current Plan"})}:</span>
              <span className="text-slate-800 dark:text-slate-100 font-semibold">{t(planDetails.nameKey, {defaultValue: "N/A"})}</span>
            </div>
            
            {planDetails.limit === Infinity ? (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">{t('analysesUsageLabel', {defaultValue: "Analyses Usage"})}:</span>
                <span className="text-green-500 flex items-center">
                  <Check className="mr-1 h-4 w-4"/> {t('unlimitedAnalyses', {defaultValue: "Unlimited"})}
                </span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{t('analysesUsedLabel', {defaultValue: "Analyses Used"})}:</span>
                  <span className="text-slate-800 dark:text-slate-100">{analysisCount} / {planDetails.limit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{t('analysesLeftLabel', {defaultValue: "Analyses Left"})}:</span>
                  <span className="text-slate-800 dark:text-slate-100">{planDetails.limit - analysisCount}</span>
                </div>
              </>
            )}

            {subscriptionPlanId !== 'free' && currentPeriodEnd ? (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">{t('renewsOnLabel', {defaultValue: "Renews/Expires On"})}:</span>
                <span className="text-slate-800 dark:text-slate-100">
                  {new Date(currentPeriodEnd).toLocaleDateString(currentLanguage || 'en', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            ) : null}
             {subscriptionPlanId === 'free' && (
                <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{t('renewsOnLabel', {defaultValue: "Renews/Expires On"})}:</span>
                    <span className="text-slate-800 dark:text-slate-100">{t('notApplicableShort', {defaultValue: "N/A"})}</span>
                </div>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/subscription')}
            className="w-full mt-4 border-primary text-primary hover:bg-primary/5 hover:text-primary"
          >
            {subscriptionPlanId === 'free' ? t('upgradePlanButton', {defaultValue: "Upgrade Plan"}) : t('manageSubscriptionButton', {defaultValue: "Manage Subscription / View Plans"})}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;