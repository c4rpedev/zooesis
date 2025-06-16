
    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Phone as PhoneIcon, Phone, Globe, UserPlus, Mail, Key, LogIn, Loader2, User, ChevronDown, Check } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

          // Country data with phone codes and flags
const countries = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', format: '(XXX) XXX-XXXX' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', format: '(XXX) XXX-XXXX' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', format: 'XXXX XXX XXXX' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', format: 'XX XX XX XX XX' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', format: 'XXX XXXXXXX' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', format: 'XXX XXX XXX' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', format: 'XXX XXX XXXX' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', format: 'XXXX XXX XXX' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', format: 'XX-XXXX-XXXX' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', format: 'XX-XXXX-XXXX' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', format: 'XXX XXXX XXXX' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', format: 'XXXXX XXXXX' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', format: '(XX) XXXXX-XXXX' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', format: 'XXX XXX XXXX' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', format: 'XX XXXX-XXXX' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', format: 'XXX XXX-XX-XX' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', format: 'XX XXX XXXX' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', format: 'XX XXXX XXXX' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', format: 'XXX XXX XXXX' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', format: 'XXX XXXXXX' },
];

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
      // const [country, setCountry] = useState('');
      const [country, setCountry] = useState(countries[0].name); // Initialize with default country name
      const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to US
const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);



const handlePhoneChange = (e) => {
  const value = e.target.value;
  const formatted = formatPhoneNumber(value, selectedCountry.format);
  setPhone(formatted);
};

const handleCountrySelect = (country) => {
  setSelectedCountry(country);
  setCountry(country.name); // <-- Add this line
  setIsCountryDropdownOpen(false);
  // Clear phone number when country changes to avoid format confusion
  setPhone('');
};

const getFullPhoneNumber = () => {
  const numbers = phone.replace(/\D/g, '');
  return `${selectedCountry.dialCode}${numbers}`;
};

// Phone formatting function
const formatPhoneNumber = (value, format) => {
  if (!value || !format) return value;
  
  const numbers = value.replace(/\D/g, '');
  let formatted = '';
  let numberIndex = 0;
  
  for (let i = 0; i < format.length && numberIndex < numbers.length; i++) {
    if (format[i] === 'X') {
      formatted += numbers[numberIndex];
      numberIndex++;
    } else {
      formatted += format[i];
    }
  }
  
  return formatted;
};

// Country Selector Component
const CountrySelector = ({ selectedCountry, onSelect, isOpen, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full h-10 px-3 text-left bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
          <span className="text-sm text-muted-foreground truncate">{selectedCountry.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b">
            <Input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onSelect(country);
                  setSearchTerm('');
                }}
                className="flex items-center w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              >
                <span className="text-lg mr-3">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{country.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{country.dialCode}</span>
                  </div>
                </div>
                {selectedCountry.code === country.code && (
                  <Check className="h-4 w-4 ml-2 text-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
          const fullPhoneNumber = getFullPhoneNumber(); // Get the full number
const { error: signUpError } = await signup(email, password, fullName, fullPhoneNumber, country);
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
           {/* Enhanced Phone Number Input with Country Selector */}
<motion.div 
  className="space-y-3"
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4, delay: 0.1 }}
>
  <Label className="flex items-center text-slate-700 dark:text-slate-200">
    <Phone className="mr-2 h-5 w-5 text-primary" /> {t('phoneNumberLabel', { defaultValue: "Phone Number"})}
  </Label>
  
  {/* Country Selector */}
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{t('countryLabel', { defaultValue: "Country"})}</Label>
    <CountrySelector
      selectedCountry={selectedCountry}
      onSelect={handleCountrySelect}
      isOpen={isCountryDropdownOpen}
      onToggle={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
    />
  </div>
  
  {/* Phone Input */}
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{t('phoneNumberLabel', { defaultValue: "Number"})}</Label>
    <div className="flex">
      <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
        <span className="text-sm font-medium text-muted-foreground">
          {selectedCountry.dialCode}
        </span>
      </div>
      <Input 
        id="phone" 
        type="tel" 
        value={phone} 
        onChange={handlePhoneChange}
        placeholder={selectedCountry.format.replace(/X/g, '0')}
        required 
        className="h-12 text-base focus:ring-2 focus:ring-primary transition-all rounded-l-none border-l-0 focus:border-l"
      />
    </div>
  </div>
  
  <p className="text-xs text-muted-foreground">
    {t('completeNumber', { defaultValue: "Complete number"})}: {selectedCountry.dialCode}{phone.replace(/\D/g, '')}
  </p>
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
  