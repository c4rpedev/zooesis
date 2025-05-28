
    import React from 'react';
    import { AlertTriangle } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Link } from 'react-router-dom';

    const NotFoundMessage = ({ message, showGoHomeButton = true }) => {
      const { t } = useTranslation();

      return (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
          <h2 className="text-2xl font-semibold text-destructive mb-2">{t('errorTitle') || 'Error'}</h2>
          <p className="text-lg text-muted-foreground mb-8">{message || t('unexpectedError')}</p>
          {showGoHomeButton && (
            <Button asChild>
              <Link to="/">{t('goHome')}</Link>
            </Button>
          )}
        </div>
      );
    };

    export default NotFoundMessage;
  