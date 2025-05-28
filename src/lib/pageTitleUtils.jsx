
    import React from "react";

    export const getPageTitle = (pathname, t, currentLanguage, user, isAdmin, itemsToSearch) => {
      const isLandingPage = pathname === '/';
      const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);

      if (isLandingPage && !user) return t('siteTitle');
      if (isAuthPage) {
        if (pathname === '/login') return t('login');
        if (pathname === '/signup') return t('signUp');
        if (pathname === '/forgot-password') return t('forgotPasswordTitle');
      }
      
      if (Array.isArray(itemsToSearch)) {
        const currentNavItem = itemsToSearch.find(item => {
          if (!item || !item.path) return false;
          return pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/' && pathname.charAt(item.path.length) === '/');
        });
        if (currentNavItem) return currentNavItem.label;
      }


      if (pathname.startsWith('/review/hemogram/')) return t('reviewHemogramTitle');
      if (pathname.startsWith('/review/biochemistry/')) return t('reviewBiochemistryTitle');
      if (pathname.startsWith('/review/urinalysis/')) return t('reviewUrinalysisTitle');
      if (pathname.startsWith('/report/hemogram/')) return t('hemogramReportTitle');
      if (pathname.startsWith('/report/biochemistry/')) return t('biochemistryReportTitle');
      if (pathname.startsWith('/report/urinalysis/')) return t('urinalysisReportTitle');
      
      if (isAdmin && pathname.startsWith('/admin')) {
        if (pathname === '/admin/dashboard') return t('adminDashboard');
        if (pathname === '/admin/users') return t('userManagement');
        if (pathname === '/admin/prompts') return t('promptManagement');
        if (pathname === '/admin/analytics') return t('analytics');
        return t('adminPanel'); 
      }

      if (pathname === '/dashboard') return t('dashboard');
      if (pathname === '/new-analysis') return t('newAnalysis');
      if (pathname === '/history') return t('history');
      if (pathname === '/subscription') return t('subscription');
      if (pathname === '/profile') return t('profile');


      return user ? t('dashboard') : t('siteTitle'); 
    };
  