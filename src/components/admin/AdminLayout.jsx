
    import React, { useState, useEffect } from 'react';
    import { Outlet, Link, useLocation } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu.jsx';
    import { Menu, Sun, Moon, LogOut, User, LayoutDashboard, Users, FileText, BarChart2, ChevronLeft, ChevronRight, Shield, Globe } from 'lucide-react';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { getPageTitle } from '@/lib/pageTitleUtils.jsx';
    import { cn } from "@/lib/utils";
    import { useNavItems } from '@/hooks/useNavItems.jsx';


    const AdminSidebar = ({ isCollapsed, toggleSidebar }) => {
      const { t } = useTranslation();
      const location = useLocation();
      const { adminNavItems } = useNavItems();


      return (
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-all duration-300 ease-in-out print:hidden",
          isCollapsed ? "w-20" : "w-64"
        )}>
          <div className={cn(
            "flex items-center border-b border-slate-200 dark:border-slate-700 p-4 h-16",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <Link to="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary">
                <Shield className="h-7 w-7" />
                <span>{t('adminPanel')}</span>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn(isCollapsed && "mx-auto")}>
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-700 dark:text-slate-300 transition-all hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20",
                  location.pathname.startsWith(item.to) && "bg-primary/10 text-primary dark:bg-primary/20 font-medium",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </aside>
      );
    };

    const AdminHeader = ({ onMenuToggle, theme, toggleTheme, isSidebarCollapsed }) => {
      const { user, logout, isAdmin } = useAuth();
      const { t, currentLanguage, changeLanguage } = useTranslation();
      const location = useLocation();
      const { adminNavItems } = useNavItems();
      const pageTitle = getPageTitle(location.pathname, t, currentLanguage, user, isAdmin, adminNavItems);


      const handleLogout = async () => {
        await logout();
      };
      
      const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'pt', name: 'Português' },
      ];

      return (
        <header className={cn(
          "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 sm:px-6 print:hidden transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:pl-24" : "lg:pl-72" 
        )}>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={onMenuToggle}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">{t('toggleNavigation')}</span>
            </Button>
            <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">{pageTitle}</h1>
          </div>

          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title={t('changeLanguage')}>
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">{t('changeLanguage')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)} className={currentLanguage === lang.code ? 'bg-slate-100 dark:bg-slate-700' : ''}>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'dark' ? t('switchToLightMode') : t('switchToDarkMode')}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">{theme === 'dark' ? t('switchToLightMode') : t('switchToDarkMode')}</span>
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user.email}.png`} alt={user.user_metadata?.full_name || user.email} />
                      <AvatarFallback>{(user.user_metadata?.full_name || user.email || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || t('user')}</p>
                      <p className="text-xs leading-none text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t('userDashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
      );
    };

    const AdminLayout = () => {
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
      const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

      useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
      }, [theme]);

      const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
      };

      const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
      const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

      return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
          <AdminSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
          <div className={cn(
            "flex-1 flex flex-col transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          )}>
            <AdminHeader 
              onMenuToggle={toggleMobileMenu} 
              theme={theme} 
              toggleTheme={toggleTheme}
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      );
    };

    export default AdminLayout;
  