
    import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { cn } from '@/lib/utils.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { useNavItems } from '@/hooks/useNavItems.jsx';

    const LOGO_URL = "https://storage.googleapis.com/hostinger-horizons-assets-prod/eb530bef-47a9-4fae-b305-64f5c47c846e/a083547c1ef271b97839001599f6287c.png";

    const Sidebar = () => {
      const location = useLocation();
      const { t } = useTranslation();
      const { mainNavItems, bottomNavItems } = useNavItems();

      const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path) && path !== '/');

      return (
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-slate-800 shadow-lg border-r border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center h-20 border-b border-slate-200 dark:border-slate-700">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src={LOGO_URL} alt={t('zooesisLogoAlt')} className="h-10 object-contain" />
            </Link>
          </div>
          <nav className="flex-1 py-6 px-4 space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 text-sm font-medium",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="py-6 px-4 space-y-1 border-t border-slate-200 dark:border-slate-700">
            {bottomNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 text-sm font-medium",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-100"
                )}
              >
                 <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </aside>
      );
    };

    export default Sidebar;
  