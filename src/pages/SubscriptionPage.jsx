import React, { useState, useMemo, useEffect} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Zap, CheckCircle, ShieldCheck, Star, Loader2 } from 'lucide-react'; // Added Loader2
import { motion } from 'framer-motion';
import { useTranslation } from '@/contexts/TranslationContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/components/ui/use-toast.jsx';
import { supabase } from '@/lib/supabaseClient.jsx'; // Ensure this path is correct
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe.js with your publishable key
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!STRIPE_PUBLISHABLE_KEY) {
  console.error("Stripe publishable key not found. Make sure VITE_STRIPE_PUBLISHABLE_KEY is set in your .env file.");
}
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const SubscriptionPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams(); 

  const plans = useMemo(() => [
    {
      nameKey: "planFreeName",
      price: "0",
      billingCycleKey: "planPerMonth",
      descriptionKey: "planFreeDescription",
      featuresKeys: [
        "planFeatureBasicAccess",
        "planFeature10Analyses"
      ],
      ctaKey: "planFreeCTA",
      popular: false,
      planId: "free",
      stripePriceId: null,
    },
    {
      nameKey: "planPopularName",
      price: "19",
      billingCycleKey: "planPerMonth",
      descriptionKey: "planPopularDescription",
      featuresKeys: [
        "planFeatureBasicAccess",
        "planFeatureSpecializedAccess",
        "planFeature90Analyses"
      ],
      ctaKey: "planPopularCTA",
      popular: true,
      planId: "popular_internal",
      stripePriceId: "price_1Q93ZRFDb5nnq6rJbMJRSsJk" // YOUR ACTUAL STRIPE PRICE ID 
    },
    {
      nameKey: "planProfessionalName",
      price: "69",
      billingCycleKey: "planPerMonth",
      descriptionKey: "planProfessionalDescription",
      featuresKeys: [
        "planFeatureBasicAccess",
        "planFeatureSpecializedAccess",
        "planFeatureUnlimitedAnalyses"
      ],
      ctaKey: "planProfessionalCTA",
      popular: false,
      planId: "professional_internal",
      stripePriceId: "price_1QhdDUFDb5nnq6rJArbsooB5" // YOUR ACTUAL STRIPE PRICE ID
    }
  ], [t]);

  

  const handleChoosePlan = async (planNameKey, stripePriceId, internalPlanId) => {
    if (!stripePromise) {
      toast({
        title: t('errorStripeNotLoadedTitle'),
        description: t('errorStripeNotLoadedDescription'),
        variant: "destructive",
      });
      return;
    }

    if (internalPlanId === "free") {
      toast({
        title: t('manageSubscriptionTitle'),
        description: t('manageSubscriptionDescription'),
      });
      return;
    }

    if (!user) {
      toast({
        title: t('errorUserNotAuthenticatedTitle'),
        description: t('errorUserNotAuthenticatedDescription'),
        variant: "destructive",
      });
      // Consider redirecting to login page: history.push('/login');
      return;
    }

    if (!stripePriceId) {
      toast({
        title: t('errorMissingPriceIdTitle'),
        description: t('errorMissingPriceIdDescription'),
        variant: "destructive",
      });
      return;
    }

  

    setLoadingPlanId(internalPlanId);
    setIsLoading(true);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planId: stripePriceId,
          userId: user.id
        }
      });

      if (functionError) {
        // Use a more specific error from the function if available
        const detailedError = functionError.context?.errorMessage || functionError.message || t('errorCreatingCheckoutSession');
        throw new Error(detailedError);
      }
console.log('functionData',functionData)
      if (functionData && functionData.sessionId) {
        toast({
          title: t('redirectingToStripeTitle'),
          description: t('redirectingToStripeDescription'),
        });
        const stripe = await stripePromise;
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: functionData.sessionId,
        });

        if (stripeError) {
          console.error("Stripe redirectToCheckout error:", stripeError);
          toast({
            title: t('errorRedirectingToStripeTitle'),
            description: stripeError.message || t('errorRedirectingToStripeDescription'),
            variant: "destructive",
          });
        }
      } else {
        // This case might indicate an unexpected response structure from the Edge Function
        throw new Error(t('errorInvalidResponseCheckoutSession'));
      }

    } catch (error) {
      console.error("handleChoosePlan error:", error);
      toast({
        title: t('errorGeneralTitle'),
        description: error.message || t('errorProcessingPlanChoice'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingPlanId(null);
    }
  };
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    // const sessionId = searchParams.get('session_id'); // You can get session_id if needed

    if (checkoutStatus === 'success') {
      toast({
        title: t('paymentSuccessfulTitle'), // Example: "Payment Successful!"
        description: t('paymentSuccessfulDescription'), // Example: "Your subscription is now active."
        variant: 'success',
        duration: 9000, // Make it last longer
      });
      // Optional: Remove query params from URL after displaying message
      setSearchParams({}, { replace: true });
    } else if (checkoutStatus === 'cancel') {
      toast({
        title: t('paymentCanceledTitle'), // Example: "Payment Canceled"
        description: t('paymentCanceledDescription'), // Example: "Your checkout process was canceled."
        variant: 'default', // Or 'destructive'
        duration: 9000,
      });
      // Optional: Remove query params from URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, t, toast]); // Add dependencies for useEffect

  // ... (rest of your component, including the return with JSX) ...
  // The JSX for displaying plans doesn't need to change for this.
  const cardVariants = { /* ... (same as before, ensure this is defined in your actual file) ... */
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: "easeOut"
          }
        })
  };

console.log('STRIPE_PUBLISHABLE_KEY',STRIPE_PUBLISHABLE_KEY)
  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-semibold text-red-600">{t('stripeConfigurationErrorTitle')}</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">{t('stripeConfigurationErrorDescription')}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-16">
         <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
            >
              <Zap className="mx-auto h-20 w-20 text-primary mb-6 p-3 bg-primary/10 rounded-full shadow-lg" />
            </motion.div>
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-sky-400 mb-4"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              {t('subscriptionPageTitle')}
            </motion.h1>
            <motion.p
              className="mt-4 text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              {t('subscriptionPageSubtitle')}
            </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, index) => (
          <motion.custom
            key={plan.nameKey}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className="w-full"
            component={Card} // Ensure motion.custom is correctly used or replace with motion.div if Card is not a motion component
          >
            <Card className={`flex flex-col h-full rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02]
                            ${plan.popular ? 'border-4 border-primary bg-primary/5 dark:bg-primary/10' : 'bg-white dark:bg-slate-800'}`}>
              {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-md flex items-center">
                        <Star className="h-4 w-4 mr-1.5 fill-current" /> {t('mostPopularPlan')}
                      </div>
                    </div>
                  )}
              <CardHeader className="p-8 text-center">
                <CardTitle className={`text-3xl font-bold mb-2 ${plan.popular ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>{t(plan.nameKey)}</CardTitle>
                <p className="text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-1">
                  ${plan.price}
                  <span className="text-xl font-medium text-slate-500 dark:text-slate-400">{t(plan.billingCycleKey)}</span>
                </p>
                <CardDescription className="text-slate-600 dark:text-slate-400 min-h-[40px]">{t(plan.descriptionKey)}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 flex-grow">
                <ul className="space-y-3">
                  {plan.featuresKeys.map((featureKey, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <CheckCircle className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary' : 'text-green-500'}`} />
                      <span className="text-slate-700 dark:text-slate-200">{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8 mt-auto">
                <Button
                  onClick={() => handleChoosePlan(plan.nameKey, plan.stripePriceId, plan.planId)}
                  size="lg"
                  className={`w-full text-lg py-3 transition-all duration-300 transform hover:scale-105
                             ${plan.popular ? 'bg-primary hover:bg-primary/90 shadow-primary/40' : 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 shadow-slate-500/30'} text-white shadow-lg`}
                  disabled={isLoading || (user?.profile?.subscription_plan_id === plan.stripePriceId || (plan.planId === "free" && user?.profile?.subscription_plan_id === "free"))}
                >
                  {isLoading && loadingPlanId === plan.planId ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    (user?.profile?.subscription_plan_id === plan.stripePriceId || (plan.planId === "free" && user?.profile?.subscription_plan_id === "free")) ? t('currentPlan') : t(plan.ctaKey)
                  )}
                  {!(isLoading && loadingPlanId === plan.planId) && !(user?.profile?.subscription_plan_id === plan.stripePriceId || (plan.planId === "free" && user?.profile?.subscription_plan_id === "free")) && <Zap className="ml-2 h-5 w-5" />}
                </Button>
              </CardFooter>
            </Card>
          </motion.custom>
        ))}
      </div>

      <motion.div
        className="mt-20 text-center p-8 bg-slate-100 dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">{t('secureReliableTitle')}</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              {t('secureReliableDescription')}
            </p>
            <Button variant="link" asChild className="mt-4 text-primary text-base">
              <Link to="/faq">{t('faqLink')}</Link>
            </Button>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionPage;