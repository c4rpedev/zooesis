
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card.jsx';
    import { Users, FileText, Edit, BarChart2 } from 'lucide-react';
    import { Link } from 'react-router-dom';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';

    const AdminDashboardPage = () => {
      const { t } = useTranslation();

      const StatCard = ({ title, value, icon: Icon, description, to, delay }) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay }}
        >
        <Link to={to} className="block hover:shadow-primary/30 transition-shadow duration-300 rounded-xl">
          <Card className="shadow-lg hover:border-primary dark:hover:border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-primary">{title}</CardTitle>
              <Icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
              <p className="text-xs text-muted-foreground pt-1">{description}</p>
            </CardContent>
          </Card>
        </Link>
        </motion.div>
      );

      // Placeholder data - In a real app, this would come from API calls
      const stats = {
        totalUsers: 125, // Placeholder
        totalAnalyses: 580, // Placeholder
        promptsToReview: 3, // Placeholder
      };

      return (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-white">{t('adminDashboard')}</h1>
            <p className="text-lg text-muted-foreground">{t('adminDashboardWelcome')}</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard 
              title={t('totalUsers')} 
              value={stats.totalUsers} 
              icon={Users} 
              description={t('totalUsersDescription')}
              to="/admin/users"
              delay={0.1}
            />
            <StatCard 
              title={t('totalAnalyses')} 
              value={stats.totalAnalyses} 
              icon={FileText} 
              description={t('totalAnalysesDescription')}
              to="/admin/analytics"
              delay={0.2}
            />
            <StatCard 
              title={t('managePrompts')} 
              value={t('editPrompts')} 
              icon={Edit} 
              description={t('managePromptsDescription')}
              to="/admin/prompts"
              delay={0.3}
            />
          </div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                    <BarChart2 className="mr-3 h-7 w-7 text-primary"/>
                    {t('quickAnalyticsOverview')}
                </CardTitle>
                <CardDescription>{t('quickAnalyticsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for a simple chart or more stats */}
                <p className="text-center py-8 text-muted-foreground">{t('analyticsChartPlaceholder')}</p>
                <div className="text-center">
                    <Link to="/admin/analytics" className="text-primary hover:underline font-medium">
                        {t('viewDetailedAnalytics')}
                    </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default AdminDashboardPage;
  