
    import React from 'react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { PlusCircle } from 'lucide-react';

    const PromptHeader = ({ onHandleCreateNewPrompt }) => {
      const { t } = useTranslation();

      return (
        <CardHeader className="px-0 pt-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">{t('promptManagement')}</CardTitle>
              <CardDescription>{t('promptManagementDescription')}</CardDescription>
            </div>
            <Button onClick={onHandleCreateNewPrompt} className="bg-primary hover:bg-primary/90 text-white">
              <PlusCircle className="mr-2 h-5 w-5" /> {t('createNewPrompt')}
            </Button>
          </div>
        </CardHeader>
      );
    };

    export default PromptHeader;
  