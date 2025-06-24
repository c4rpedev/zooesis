
    import React from 'react';
    import { Outlet, useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import Sidebar from '@/components/layout/Sidebar.jsx';
    import Header from '@/components/layout/Header.jsx';
    import MobileMenu from '@/components/layout/MobileMenu.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import PageLoader from '@/components/layout/PageLoader.jsx'; 
    import { getPageTitle } from '@/lib/pageTitleUtils.jsx';
    import { useNavItems } from '@/hooks/useNavItems.jsx';
    import InstallPWANotification from '@/components/common/InstallPWANotification.jsx';


    const Layout = () => {
      const location = useLocation();
      const { user, loading: authLoading, isAdmin } = useAuth();
      const { t, currentLanguage } = useTranslation();
      const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
      const [showInstallPrompt, setShowInstallPrompt] = React.useState(true);

      const { mainNavItems, bottomNavItems } = useNavItems();
      const allAppNavItems = React.useMemo(() => [...mainNavItems, ...bottomNavItems], [mainNavItems, bottomNavItems]);
      
      const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
      const isLandingPage = location.pathname === '/';
      const isAdminSection = location.pathname.startsWith('/admin');
      
      const showAppShell = user && !isLandingPage && !isAuthPage && !isAdminSection;

      const pageTitle = getPageTitle(location.pathname, t, currentLanguage, user, isAdmin, allAppNavItems);
      
      if (authLoading) { 
        return <PageLoader />;
      }

      if (isLandingPage && !user) {
        return <Outlet />; 
      }
      
      if (isAdminSection) { 
        return <Outlet />;
      }

      return (
        <div className={`flex h-screen bg-gradient-to-br ${showAppShell ? 'from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-950' : 'from-white to-slate-50 dark:from-slate-850 dark:to-slate-900'}`}>
          {showAppShell && <Sidebar />}
          <div className="flex-1 flex flex-col overflow-hidden">
            {(showAppShell || isAuthPage) && (
              <Header 
                onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                theme={localStorage.getItem('theme') || 'light'} 
                toggleTheme={() => {
                  const newTheme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
                  localStorage.setItem('theme', newTheme);
                  document.documentElement.classList.toggle('dark', newTheme === 'dark');
                }}
              />
            )}
            {showAppShell && <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />}
            <main className={`flex-1 overflow-x-hidden overflow-y-auto ${ (showAppShell || isAuthPage) ? 'p-4 sm:p-6' : ''}`}>
              <motion.div
                key={location.pathname + currentLanguage} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
          {showInstallPrompt && (
            <InstallPWANotification onClose={() => setShowInstallPrompt(false)} />
          )}
        </div>
      );
    };

    export default Layout;
  