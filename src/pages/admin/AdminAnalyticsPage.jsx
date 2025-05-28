
    import React, { useEffect, useState, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card.jsx';
    import { BarChartBig, Users, FileText, TrendingUp, TrendingDown, Activity, Eye, AlertTriangle, Loader2 } from 'lucide-react';
    import AdminPageHeader from '@/components/admin/shared/AdminPageHeader.jsx';

    const StatCard = ({ title, value, icon: Icon, change, changeType, description, isLoading, t }) => {
      const ChangeIcon = changeType === 'increase' ? TrendingUp : TrendingDown;
      const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

      return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary my-2" />
            ) : (
              <>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
                {change && (
                  <p className={`text-xs ${changeColor} flex items-center`}>
                    <ChangeIcon className="h-3 w-3 mr-1" />
                    {change} {t('vsLastPeriod')}
                  </p>
                )}
              </>
            )}
            {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
          </CardContent>
        </Card>
      );
    };
    
    const AdminAnalyticsPage = () => {
      const { t } = useTranslation();
      const [analyticsData, setAnalyticsData] = useState({
        totalUsers: 0,
        newUsersLast30Days: 0,
        totalAnalyses: 0,
        analysesLast30Days: 0,
        activeSubscriptions: 0, 
        mostUsedAnalysisType: 'N/A',
        ocrSuccessRate: 0, 
        averageProcessingTime: 'N/A' 
      });
      const [loading, setLoading] = useState(true);

      const fetchAnalyticsData = useCallback(async () => {
        setLoading(true);
        try {
          const { data: users, error: usersError } = await supabase.from('user_profiles').select('id, created_at, subscription_plan', { count: 'exact' });
          if (usersError) throw usersError;

          const { data: analyses, error: analysesError } = await supabase.from('analyses').select('id, created_at, analysis_type, status', { count: 'exact' });
          if (analysesError) throw analysesError;
          
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const newUsersCount = users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length;
          const analysesLast30DaysCount = analyses.filter(a => new Date(a.created_at) > thirtyDaysAgo).length;

          const analysisTypeCounts = analyses.reduce((acc, curr) => {
            acc[curr.analysis_type] = (acc[curr.analysis_type] || 0) + 1;
            return acc;
          }, {});
          
          let mostUsedType = 'N/A';
          if (Object.keys(analysisTypeCounts).length > 0) {
            mostUsedType = Object.keys(analysisTypeCounts).reduce((a, b) => analysisTypeCounts[a] > analysisTypeCounts[b] ? a : b);
            mostUsedType = t(mostUsedType) || mostUsedType;
          }

          setAnalyticsData({
            totalUsers: users.length,
            newUsersLast30Days: newUsersCount,
            totalAnalyses: analyses.length,
            analysesLast30Days: analysesLast30DaysCount,
            activeSubscriptions: users.filter(u => u.subscription_plan && u.subscription_plan !== 'free').length, 
            mostUsedAnalysisType: mostUsedType,
            ocrSuccessRate: 95, 
            averageProcessingTime: '35s' 
          });

        } catch (error) {
          console.error("Error fetching analytics data:", error);
          
        } finally {
          setLoading(false);
        }
      }, [t]);

      useEffect(() => {
        fetchAnalyticsData();
      }, [fetchAnalyticsData]);

      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.1, duration: 0.5 }
        })
      };
      
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <AdminPageHeader title={t('applicationAnalytics')} />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
              <StatCard t={t} title={t('totalUsers')} value={analyticsData.totalUsers} icon={Users} description={t('totalRegisteredUsers')} isLoading={loading}/>
            </motion.div>
            <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
              <StatCard t={t} title={t('newUsersLast30Days')} value={analyticsData.newUsersLast30Days} icon={Users} changeType="increase" description={t('newSignUps')} isLoading={loading}/>
            </motion.div>
            <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
             <StatCard t={t} title={t('totalAnalysesPerformed')} value={analyticsData.totalAnalyses} icon={FileText} description={t('allAnalysesProcessed')} isLoading={loading}/>
            </motion.div>
             <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
              <StatCard t={t} title={t('analysesLast30Days')} value={analyticsData.analysesLast30Days} icon={FileText} changeType="increase" description={t('analysesInLastMonth')} isLoading={loading}/>
            </motion.div>
             <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
              <StatCard t={t} title={t('activeSubscriptions')} value={analyticsData.activeSubscriptions} icon={Activity} description={t('paidSubscriptions')} isLoading={loading}/>
            </motion.div>
            <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
                <StatCard t={t} title={t('mostUsedAnalysisType')} value={analyticsData.mostUsedAnalysisType} icon={BarChartBig} description={t('mostPopularAnalysis')} isLoading={loading}/>
            </motion.div>
            <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants}>
                <StatCard t={t} title={t('ocrSuccessRate')} value={`${analyticsData.ocrSuccessRate}%`} icon={Eye} description={t('imageToTextAccuracy')} isLoading={loading} />
            </motion.div>
            <motion.div custom={7} initial="hidden" animate="visible" variants={cardVariants}>
                <StatCard t={t} title={t('averageProcessingTime')} value={analyticsData.averageProcessingTime} icon={Loader2} description={t('avgTimeFromUploadToReport')} isLoading={loading} />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-slate-800 dark:text-slate-100">
                  <BarChartBig className="mr-3 h-7 w-7 text-primary"/>
                  {t('detailedCharts')}
                </CardTitle>
                <CardDescription>{t('visualizeGrowthAndUsage')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-md">
                  <p className="text-muted-foreground text-lg">
                    <AlertTriangle className="inline-block h-5 w-5 mr-2 text-yellow-500" /> 
                    {t('chartsComingSoon')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      );
    };

    export default AdminAnalyticsPage;
  