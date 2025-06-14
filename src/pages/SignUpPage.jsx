
    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Phone as PhoneIcon, Globe, UserPlus, Mail, Key, LogIn, Loader2, User } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const SignUpPage = () => {
      const navigate = useNavigate();
      const { signup } = useAuth(); 
      const { toast } = useToast();
      const { t } = useTranslation();

      const [fullName, setFullName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [phone, setPhone] = useState('');
      const [country, setCountry] = useState('');

      const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        if (!fullName.trim()) {
          setError(t('fullNameRequired'));
          toast({
            title: t('validationErrorTitle'),
            description: t('fullNameRequired'),
            variant: "destructive",
          });
          return;
        }
        if (password !== confirmPassword) {
          setError(t('passwordsDoNotMatch'));
          toast({
            title: t('validationErrorTitle'),
            description: t('passwordsDoNotMatch'),
            variant: "destructive",
          });
          return;
        }
         // Add validation for new fields
    if (!phone.trim()) {
      toast({ title: t('validationErrorTitle'), description: t('phoneNumberRequired', {defaultValue: "Phone number is required."}), variant: 'destructive' });
      return;
    }
    if (!country.trim()) {
      toast({ title: t('validationErrorTitle'), description: t('countryRequired', {defaultValue: "Country is required."}), variant: 'destructive' });
      return;
    }
        setLoading(true);
        try {
          const { error: signUpError } = await signup(email, password, fullName, phone, country);
console.log('signUpError',signUpError)
          if (signUpError) {
            setError(signUpError.message);
            toast({
              title: t('signUpFailed'),
              description: signUpError.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: t('signupNeedsVerificationTitle'), // Usamos la traducción que ya tenías
              description: t('signupNeedsVerificationDescription'),
              variant: 'default', // O 'success' si prefieres
              duration: 10000, // Para dar tiempo al usuario a leer
           });
            navigate('/verify-email');
          }
        } catch (catchError) {
console.log('catchError',catchError)

          setError(catchError.message);
           toast({
            title: t('signUpFailed'),
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
                <UserPlus className="mx-auto h-16 w-16 text-primary mb-4" />
              </motion.div>
              <CardTitle className="text-4xl font-bold text-slate-800 dark:text-white">{t('createAccount')}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 pt-1">
                {t('joinZooesis')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSignUp} className="space-y-6">
                {error && <p className="text-sm text-red-500 text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  <Label htmlFor="fullName" className="flex items-center text-slate-700 dark:text-slate-200">
                    <User className="mr-2 h-5 w-5 text-primary" /> {t('fullNameLabel')}
                  </Label>
                  <Input 
                    id="fullName" type="text" placeholder={t('fullNamePlaceholder')} required 
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="h-12 text-base focus:ring-2 focus:ring-primary transition-all" 
                  />
                </motion.div>
                  {/* Phone Number Input */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }} // Adjusted delay
            >
              <Label htmlFor="phone" className="flex items-center text-slate-700 dark:text-slate-200">
                <PhoneIcon className="mr-2 h-5 w-5 text-primary" /> {t('phoneNumberLabel', { defaultValue: "Phone Number"})}
              </Label>
              <Input 
                id="phone" type="tel" value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder={t('phoneNumberPlaceholder', { defaultValue: "e.g., +1234567890"})} 
                required 
                className="h-12 text-base focus:ring-2 focus:ring-primary transition-all"
              />
            </motion.div>

            {/* Country Input */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }} // Adjusted delay
            >
              <Label htmlFor="country" className="flex items-center text-slate-700 dark:text-slate-200">
                <Globe className="mr-2 h-5 w-5 text-primary" /> {t('countryLabel', { defaultValue: "Country"})}
              </Label>
              <Input 
                id="country" type="text" value={country} 
                onChange={(e) => setCountry(e.target.value)} 
                placeholder={t('countryPlaceholder', { defaultValue: "e.g., United States"})} 
                required 
                className="h-12 text-base focus:ring-2 focus:ring-primary transition-all"
              />
            </motion.div>
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
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Label htmlFor="confirmPassword" className="flex items-center text-slate-700 dark:text-slate-200">
                    <Key className="mr-2 h-5 w-5 text-primary" /> {t('confirmPassword')}
                  </Label>
                  <Input 
                    id="confirmPassword" type="password" placeholder="••••••••" required 
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 text-base focus:ring-2 focus:ring-primary transition-all" 
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/40 transform hover:scale-102" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                    {t('signUp')}
                  </Button>
                </motion.div>
              </form>
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('alreadyHaveAccount')}{' '}
                  <Link to="/login" className="font-medium text-primary hover:underline">
                    {t('signInHere')} <LogIn className="inline ml-1 h-4 w-4" />
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default SignUpPage;
  