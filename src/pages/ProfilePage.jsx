
    import React, { useState, useEffect } from 'react';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { UserCircle, Mail, Edit3, Save, Loader2, LockKeyhole as ShieldKeyhole } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ProfilePage = () => {
      const { user, updateUser, loading: authLoading } = useAuth();
      const { toast } = useToast();
      const { t } = useTranslation();

      const [fullName, setFullName] = useState('');
      const [avatarUrl, setAvatarUrl] = useState('');
      const [newPassword, setNewPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [isEditing, setIsEditing] = useState(false);
      const [loading, setLoading] = useState(false);
      const [profileLoading, setProfileLoading] = useState(true);

      useEffect(() => {
        if (user) {
          setProfileLoading(true);
          supabase
            .from('user_profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single()
            .then(({ data, error }) => {
              if (error && error.code !== 'PGRST116') { // PGRST116: "The result contains 0 rows"
                toast({ title: t('errorFetchingProfile'), description: error.message, variant: 'destructive' });
              } else if (data) {
                setFullName(data.full_name || user.email || '');
                setAvatarUrl(data.avatar_url || '');
              } else {
                // Profile might not exist yet, use defaults
                setFullName(user.email || '');
              }
              setProfileLoading(false);
            })
            .catch(err => {
                 toast({ title: t('errorFetchingProfile'), description: err.message, variant: 'destructive' });
                 setProfileLoading(false);
            });
        }
      }, [user, toast, t]);
      
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

          // Update Supabase Auth user_metadata (only if it's different)
          const authUpdates = {};
          if (user.user_metadata?.full_name !== fullName) authUpdates.full_name = fullName;
          if (user.user_metadata?.avatar_url !== avatarUrl) authUpdates.avatar_url = avatarUrl;

          if (Object.keys(authUpdates).length > 0) {
            const { error: authError } = await updateUser({ data: authUpdates });
             if (authError) {
                console.warn("Auth metadata update failed, but profile saved:", authError.message);
                toast({ title: t('profileUpdated parcialmente'), description: t('profileUpdatedAuthError'), variant: 'warning' });
            }
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
          const { error } = await updateUser({ password: newPassword });
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

      if (authLoading || profileLoading) {
        return (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          </div>
        );
      }

      if (!user) {
        return <p>{t('mustBeLoggedIn')}</p>;
      }

      return (
        <motion.div 
          className="container mx-auto px-4 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md">
            <CardHeader className="text-center p-8 bg-primary/10 dark:bg-primary/20 rounded-t-lg">
              <UserCircle className="mx-auto h-20 w-20 text-primary mb-3" />
              <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">{t('profileSettingsTitle')}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 pt-1">{t('profileSettingsDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
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

              <form onSubmit={handlePasswordUpdate} className="space-y-6">
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
          </Card>
        </motion.div>
      );
    };

    export default ProfilePage;
  