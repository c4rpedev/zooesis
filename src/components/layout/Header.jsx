
    import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
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
    import { Menu, Sun, Moon, LogOut, User, Shield, Globe } from 'lucide-react';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { getPageTitle } from '@/lib/pageTitleUtils.jsx';
    import { useNavItems } from '@/hooks/useNavItems.jsx';

    const Header = ({ onMenuToggle, theme, toggleTheme }) => {
      const { user, signOut, isAdmin, loading } = useAuth();
      const { t, language: currentLanguage, setLanguage } = useTranslation();
      const location = useLocation();
      const navItems = useNavItems();

      const pageTitle = getPageTitle(location.pathname, t, currentLanguage, user, isAdmin, navItems);

      const handleLogout = async () => {
        try {
          // Llama a la función signOut obtenida del contexto
          await signOut();
          // Opcional: redirigir al usuario después de cerrar sesión si es necesario
          // Considera redirigir dentro de useAuthSessionManagement después de un signOut exitoso
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
          // Aquí podrías mostrar un mensaje de error al usuario, por ejemplo, usando un toast
        }
      };

      const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'pt', name: 'Português' },
      ];

      return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 sm:px-6 print:hidden">
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
                  <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)} className={currentLanguage === lang.code ? 'bg-slate-100 dark:bg-slate-700' : ''}>
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
                  {isAdmin && (
                     <DropdownMenuItem asChild>
                       <Link to="/admin/dashboard">
                         <Shield className="mr-2 h-4 w-4" />
                         <span>{t('adminDashboard')}</span>
                       </Link>
                     </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={loading}>
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

    export default Header;
  