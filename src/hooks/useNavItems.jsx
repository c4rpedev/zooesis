
    import React from 'react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';

    export const useNavItems = () => {
      const { t } = useTranslation();
      const { isAdmin } = useAuth();

      const mainNavItems = React.useMemo(() => [
        { path: '/dashboard', label: t('dashboard') },
        { path: '/new-analysis', label: t('newAnalysis') },
        { path: '/history', label: t('history') },
      ], [t]);

      const bottomNavItems = React.useMemo(() => [
        { path: '/subscription', label: t('subscription') },
        { path: '/profile', label: t('profile') },
        ...(isAdmin ? [{ path: '/admin/dashboard', label: t('adminPanelSimple') }] : [])
      ], [t, isAdmin]);

      const adminNavItems = React.useMemo(() => [
        { path: '/admin/dashboard', label: t('adminDashboard') },
        { path: '/admin/users', label: t('userManagement') },
        { path: '/admin/prompts', label: t('promptManagement') },
        { path: '/admin/analytics', label: t('analytics') },
      ], [t]);

      return { mainNavItems, bottomNavItems, adminNavItems };
    };
  