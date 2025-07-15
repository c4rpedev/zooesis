import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { CheckCircle, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/contexts/TranslationContext.jsx';

const PricingSection = () => {
  const { t } = useTranslation();

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
      ctaKey: "planFreeCTA", // Changed from planFreeCTA to a more generic CTA for landing page
      popular: false,
      linkTo: "/signup" // Or just /subscription and let user choose
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
      ctaKey: "planFreeCTA", // Changed from planPopularCTA
      popular: true,
      linkTo: "/signup"
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
      ctaKey: "planFreeCTA", // Changed from planProfessionalCTA
      popular: false,
      linkTo: "/signup"
    }
  ], [t]);

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
    <section id="pricing" className="py-16 md:py-24 bg-white dark:bg-slate-850/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t('subscriptionPageTitle')}
          </h2>
          <p className="mt-3 text-lg md:text-xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('subscriptionPageSubtitle')}
          </p>
        </motion.div>

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
              <Card className={`flex flex-col h-full rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]
                              ${plan.popular ? 'border-2 border-primary bg-primary/5 dark:bg-primary/10' : 'bg-white dark:bg-slate-800'}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center">
                      <Star className="h-3.5 w-3.5 mr-1 fill-current" /> {t('mostPopularPlan')}
                    </div>
                  </div>
                )}
                <CardHeader className="p-6 text-center">
                  <CardTitle className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>{t(plan.nameKey)}</CardTitle>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-1">
                    ${plan.price}
                    <span className="text-base font-medium text-slate-500 dark:text-slate-400">{t(plan.billingCycleKey)}</span>
                  </p>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400 min-h-[30px]">{t(plan.descriptionKey)}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <ul className="space-y-2.5">
                    {plan.featuresKeys.map((featureKey, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <CheckCircle className={`h-4.5 w-4.5 mr-2.5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary' : 'text-green-500'}`} />
                        <span className="text-sm text-slate-700 dark:text-slate-200">{t(featureKey)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-6 mt-auto">
                  <Button
                    asChild
                    size="lg"
                    className={`w-full text-base py-2.5 transition-all duration-300 transform hover:scale-105
                               ${plan.popular ? 'bg-primary hover:bg-primary/90 shadow-primary/30' : 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 shadow-slate-400/30'} text-white shadow-md`}
                  >
                    <Link to={plan.linkTo}>
                      {t(plan.ctaKey)}
                      <Zap className="ml-1.5 h-4.5 w-4.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.custom>
          ))}
        </div>
      
      </div>
    </section>
  );
};

export default PricingSection;
