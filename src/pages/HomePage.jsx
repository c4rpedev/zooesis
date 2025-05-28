
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { FilePlus2, History, BarChart3, Zap, User, Activity } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const HomePage = () => {
      const { user } = useAuth();
      const { t } = useTranslation();

      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }
        })
      };

      const quickActions = [
        { titleKey: 'newAnalysis', descriptionKey: "homeNewAnalysisDescription", icon: FilePlus2, path: "/new-analysis", color: "text-primary" },
        { titleKey: 'history', descriptionKey: "homeHistoryDescription", icon: History, path: "/history", color: "text-sky-500" },
        { titleKey: 'subscription', descriptionKey: "homeSubscriptionDescription", icon: Zap, path: "/subscription", color: "text-amber-500" },
        { titleKey: 'profile', descriptionKey: "homeProfileDescription", icon: User, path: "/profile", color: "text-green-500" }
      ];

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <Card className="shadow-xl bg-gradient-to-r from-primary/80 to-sky-600/80 dark:from-primary/70 dark:to-sky-700/70 text-white">
            <CardHeader>
              <motion.div initial={{ opacity:0, x: -20 }} animate={{ opacity:1, x: 0 }} transition={{delay: 0.2}}>
                <BarChart3 className="h-12 w-12 mb-2 opacity-80" />
                <CardTitle className="text-4xl font-bold">
                  {t('welcomeBack')}, {user?.profile?.full_name || user?.email?.split('@')[0] || t('guestUser')}!
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg mt-1">
                  {t('homeTagline')}
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.p 
                className="text-lg"
                initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} transition={{delay: 0.4}}
              >
                {t('homeIntro')}
              </motion.p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {quickActions.map((action, i) => (
              <motion.custom
                key={action.titleKey}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={i}
                component={Card}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold text-slate-700 dark:text-slate-200">{t(action.titleKey)}</CardTitle>
                  {/* Icon removed from here as per request */}
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <action.icon className={`h-8 w-8 ${action.color} opacity-70 mt-1`} />
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">{t(action.descriptionKey)}</p>
                      <Button asChild className="w-full shadow-md hover:shadow-lg transition-shadow">
                        <Link to={action.path}>
                          {t('goTo')} {t(action.titleKey)}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </motion.custom>
            ))}
          </div>

          <Card className="shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Activity className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-semibold text-slate-700 dark:text-slate-200">{t('homeRecentActivityTitle')}</CardTitle>
              </div>
              <CardDescription className="text-slate-600 dark:text-slate-400">{t('homeRecentActivityDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 dark:text-slate-400">
                {t('homeRecentActivityPlaceholder')}
              </p>
            </CardContent>
          </Card>

        </motion.div>
      );
    };

    export default HomePage;
  