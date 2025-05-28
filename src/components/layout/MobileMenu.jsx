
    import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { Home, PlusSquare, History, Zap, UserCircle, Settings, X, BarChart3 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { cn } from '@/lib/utils.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const LOGO_URL = "https://storage.googleapis.com/hostinger-horizons-assets-prod/eb530bef-47a9-4fae-b305-64f5c47c846e/a083547c1ef271b97839001599f6287c.png";

    const MobileMenu = ({ isOpen, onClose }) => {
      const location = useLocation();
      const { t } = useTranslation();

      const navItems = [
        { path: '/dashboard', label: t('dashboard'), icon: Home },
        { path: '/new-analysis', label: t('newAnalysis'), icon: PlusSquare },
        { path: '/history', label: t('history'), icon: History },
        { path: '/subscription', label: t('subscription'), icon: Zap },
        { path: '/profile', label: t('profile'), icon: UserCircle },
        // { path: '/settings', label: t('settings'), icon: Settings },
      ];

      const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

      const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };

      const menuVariants = {
        hidden: { x: '-100%' },
        visible: { x: '0%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { x: '-100%', transition: { duration: 0.2 } },
      };

      return (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={onClose}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                aria-hidden="true"
              />
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-xl z-50 flex flex-col md:hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
              >
                <div className="flex items-center justify-between h-20 px-4 border-b border-slate-200 dark:border-slate-700">
                  <Link to="/dashboard" className="flex items-center space-x-2" onClick={onClose}>
                    <img src={LOGO_URL} alt="Zooesis Logo" className="h-10 object-contain" />
                  </Link>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Close mobile menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex-1 py-6 px-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150",
                        isActive(item.path)
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-semibold shadow-sm"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-100"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      );
    };

    export default MobileMenu;
  