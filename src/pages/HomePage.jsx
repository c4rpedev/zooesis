
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { FilePlus2, History, BarChart3, Zap, User, Activity, Loader2, AlertTriangle, FileText, CalendarDays, PawPrint, Microscope } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useRecentAnalysis } from '@/hooks/useRecentAnalysis.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const HomePage = () => {
      const { user } = useAuth();
      const { t } = useTranslation();
      const { recentAnalysis, loading, error, fetchRecentAnalysis } = useRecentAnalysis();

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
            <CardContent className="space-y-4">
              {loading && (
                <div className="flex justify-center items-center py-6">
                  <Loader2 className="animate-spin h-10 w-10 text-primary" />
                </div>
              )}
              {error && (
                <div className="flex flex-col items-center text-center py-6">
                  <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
                  <p className="text-red-500 font-medium">{t('errorFetchingRecentAnalysis')}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{error.message}</p>
                  <Button variant="outline" size="sm" onClick={fetchRecentAnalysis} className="mt-4">
                    {t('tryAgain')}
                  </Button>
                </div>
              )}
              {!loading && !error && !recentAnalysis && (
                <div className="flex flex-col items-center text-center py-6">
                  <FileText className="h-10 w-10 text-slate-400 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{t('noRecentAnalysisFound')}</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">{t('startNewAnalysisPrompt')}</p>
                  <Button asChild className="mt-4">
                    <Link to="/new-analysis">{t('newAnalysisButton')}</Link>
                  </Button>
                </div>
              )}
              {!loading && !error && recentAnalysis && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <PawPrint className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {t('patientNameLabel')}: <strong className="font-semibold">{recentAnalysis.patient_name || t('notAvailable')}</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Microscope className="h-5 w-5 text-sky-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {t('analysisTypeLabel')}: <strong className="font-semibold">{recentAnalysis.analysis_type || t('notAvailable')}</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {t('dateLabel')}: <strong className="font-semibold">{new Date(recentAnalysis.upload_date).toLocaleDateString()}</strong>
                    </span>
                  </div>
                  <div className="pt-3">
                    <Button asChild className="w-full md:w-auto shadow-md hover:shadow-lg transition-shadow">
                      <Link to={`/history/${recentAnalysis.id}`}>
                        <FileText className="mr-2 h-4 w-4" /> {t('viewReportButton')}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </motion.div>
      );
    };

    export default HomePage;
  