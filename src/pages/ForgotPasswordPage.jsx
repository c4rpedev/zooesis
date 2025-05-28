
    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Mail, Send, Loader2, ArrowLeft } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ForgotPasswordPage = () => {
      const { resetPassword } = useAuth();
      const { toast } = useToast();
      const { t } = useTranslation();
      const [email, setEmail] = useState('');
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState('');
      const [error, setError] = useState('');

      const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
          const { error: resetError } = await resetPassword(email);

          if (resetError) {
            setError(resetError.message);
            toast({
              title: t('passwordResetFailed'),
              description: resetError.message,
              variant: "destructive",
            });
          } else {
            setMessage(t('passwordResetSuccessMessage'));
            toast({
              title: t('passwordResetEmailSent'),
              description: t('passwordResetCheckInbox'),
            });
          }
        } catch (catchError) {
          setError(catchError.message);
          toast({
            title: t('passwordResetFailed'),
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
                <Mail className="mx-auto h-16 w-16 text-primary mb-4" />
              </motion.div>
              <CardTitle className="text-4xl font-bold text-slate-800 dark:text-white">{t('forgotPasswordTitle')}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 pt-1">
                {t('forgotPasswordDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handlePasswordReset} className="space-y-6">
                {error && <p className="text-sm text-red-500 text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
                {message && <p className="text-sm text-green-600 text-center bg-green-100 dark:bg-green-900/30 p-3 rounded-md">{message}</p>}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/40 transform hover:scale-102" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                    {t('sendResetLink')}
                  </Button>
                </motion.div>
              </form>
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Link to="/login" className="font-medium text-primary hover:underline flex items-center justify-center">
                  <ArrowLeft className="inline mr-1 h-4 w-4" /> {t('backToLogin')}
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ForgotPasswordPage;
  