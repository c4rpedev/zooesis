
    import React from 'react';
    import { Outlet, useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { BarChart3 } from 'lucide-react';
    import Sidebar from '@/components/layout/Sidebar.jsx';
    import Header from '@/components/layout/Header.jsx';
    import MobileMenu from '@/components/layout/MobileMenu.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const Layout = () => {
      const location = useLocation();
      const { user, loading: authLoading, isAdmin } = useAuth();
      const { t, language } = useTranslation();
      const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

      const navItems = React.useMemo(() => [
        { path: '/dashboard', label: t('dashboard')},
        { path: '/new-analysis', label: t('newAnalysis')},
        { path: '/history', label: t('history')},
        { path: '/subscription', label: t('subscription') },
        { path: '/profile', label: t('profile') },
        ...(isAdmin ? [{ path: '/admin/dashboard', label: t('adminDashboard') }] : [])
      ], [t, isAdmin]);

      const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
      const isLandingPage = location.pathname === '/';
      const isAdminSection = location.pathname.startsWith('/admin');
      
      // Show app shell if user is logged in, not on landing, not on auth page, and not in admin section
      const showAppShell = user && !isLandingPage && !isAuthPage && !isAdminSection;


      const getPageTitle = React.useCallback(() => {
        if (isLandingPage && !user) return t('siteTitle');
        if (isAuthPage) {
          if (location.pathname === '/login') return t('login');
          if (location.pathname === '/signup') return t('signUp');
          if (location.pathname === '/forgot-password') return t('forgotPasswordTitle');
        }
        
        const currentNavItem = navItems.find(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
        if (currentNavItem) return currentNavItem.label;

        if (location.pathname.startsWith('/review/hemogram/')) return t('reviewHemogramTitle');
        if (location.pathname.startsWith('/review/biochemistry/')) return t('reviewBiochemistryTitle');
        if (location.pathname.startsWith('/review/urinalysis/')) return t('reviewUrinalysisTitle');
        if (location.pathname.startsWith('/report/hemogram/')) return t('hemogramReportTitle');
        if (location.pathname.startsWith('/report/biochemistry/')) return t('biochemistryReportTitle');
        if (location.pathname.startsWith('/report/urinalysis/')) return t('urinalysisReportTitle');
        
        return t('dashboard'); 
      }, [isLandingPage, user, isAuthPage, location.pathname, navItems, t]);

      const pageTitle = getPageTitle();
      
      if (authLoading) {
        return (
          <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-950">
            <BarChart3 className="h-16 w-16 text-primary animate-pulse" />
          </div>
        );
      }

      if (isLandingPage && !user) {
        return <Outlet />; 
      }
      
      if (isAdminSection) { // Admin layout handles its own structure
        return <Outlet />;
      }

      return (
        <div className={`flex h-screen bg-gradient-to-br ${showAppShell ? 'from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-950' : 'from-white to-slate-50 dark:from-slate-850 dark:to-slate-900'}`}>
          {showAppShell && <Sidebar />}
          <div className="flex-1 flex flex-col overflow-hidden">
            {(showAppShell || isAuthPage) && (
              <Header 
                pageTitle={pageTitle} 
                onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                showMobileMenuButton={showAppShell} 
              />
            )}
            {showAppShell && <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />}
            <main className={`flex-1 overflow-x-hidden overflow-y-auto ${ (showAppShell || isAuthPage) ? 'p-6' : ''}`}>
              <motion.div
                key={location.pathname + language} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
        </div>
      );
    };

    export default Layout;
  