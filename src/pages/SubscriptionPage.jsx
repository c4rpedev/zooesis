
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Zap, CheckCircle, ShieldCheck, Star, XCircle } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';

    const SubscriptionPage = () => {
      const { t } = useTranslation();
      const { user } = useAuth();
      const { toast } = useToast();

      const plans = [
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
          planId: "free"
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
          planId: "popular" 
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
          planId: "professional"
        }
      ];

      const handleChoosePlan = (planName, planId) => {
        // TODO: Implement Stripe Checkout integration here
        // For now, show an alert or toast message
        toast({
          title: t('planSelectedTitle'),
          description: `${t('planSelectedDescriptionPrefix')} ${t(planName)}. ${t('paymentIntegrationComingSoon')}`,
        });
        // You would typically redirect to Stripe Checkout or handle payment within the app
      };
      
      const cardVariants = {
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
                component={Card}
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
                      onClick={() => handleChoosePlan(plan.nameKey, plan.planId)} 
                      size="lg" 
                      className={`w-full text-lg py-3 transition-all duration-300 transform hover:scale-105
                                 ${plan.popular ? 'bg-primary hover:bg-primary/90 shadow-primary/40' : 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 shadow-slate-500/30'} text-white shadow-lg`}
                      disabled={user?.profile?.subscription_plan === plan.planId}
                    >
                      {user?.profile?.subscription_plan === plan.planId ? t('currentPlan') : t(plan.ctaKey)}
                      {user?.profile?.subscription_plan !== plan.planId && <Zap className="ml-2 h-5 w-5" />}
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
  