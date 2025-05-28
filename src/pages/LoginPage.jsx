
    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { LogIn, UserPlus, Mail, Key, Loader2 } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const LoginPage = () => {
      const navigate = useNavigate();
      const { login } = useAuth();
      const { toast } = useToast();
      const { t } = useTranslation();

      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');

      const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
          const { error: loginError, user } = await login(email, password);

          if (loginError) {
            setError(loginError.message);
            toast({
              title: t('loginFailed'),
              description: loginError.message,
              variant: "destructive",
            });
          } else if (user) {
            toast({
              title: t('loginSuccess'),
              description: t('redirectToDashboard'),
            });
            navigate('/'); 
          } else {
            setError(t('loginFailed'));
             toast({
              title: t('loginFailed'),
              description: t('loginErrorDescription'),
              variant: "destructive",
            });
          }
        } catch (catchError) {
          setError(catchError.message);
          toast({
            title: t('loginFailed'),
            description: catchError.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      return (
        <motion.div 
          className="flex items-center justify-center min-h-[calc(100vh-10rem)] bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="w-full max-w-md shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md">
            <CardHeader className="text-center p-8 bg-primary/10 dark:bg-primary/20 rounded-t-lg">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              >
                <LogIn className="mx-auto h-16 w-16 text-primary mb-4" />
              </motion.div>
              <CardTitle className="text-4xl font-bold text-slate-800 dark:text-white">{t('welcomeBack')}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 pt-1">
                {t('signInToDashboard')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {error && <p className="text-sm text-red-500 text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Label htmlFor="email" className="flex items-center text-slate-700 dark:text-slate-200">
                    <Mail className="mr-2 h-5 w-5 text-primary" /> {t('emailAddress')}
                  </Label>
                  <Input 
                    id="email" type="email" placeholder="you@example.com" required 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base focus:ring-2 focus:ring-primary transition-all" 
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Label htmlFor="password" className="flex items-center text-slate-700 dark:text-slate-200">
                    <Key className="mr-2 h-5 w-5 text-primary" /> {t('password')}
                  </Label>
                  <Input 
                    id="password" type="password" placeholder="••••••••" required 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base focus:ring-2 focus:ring-primary transition-all" 
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/40 transform hover:scale-102" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                    {t('signIn')}
                  </Button>
                </motion.div>
              </form>
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('dontHaveAccount')}{' '}
                  <Link to="/signup" className="font-medium text-primary hover:underline">
                    {t('signUpHere')} <UserPlus className="inline ml-1 h-4 w-4" />
                  </Link>
                </p>
                 <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                    {t('forgotPasswordLink')}
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default LoginPage;
  