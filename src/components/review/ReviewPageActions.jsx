
    import React from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { CardFooter } from '@/components/ui/card.jsx';
    import { Loader2, Save, SendToBack, Brain } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ReviewPageActions = ({ isSaving, isInterpreting, onSaveReview, onConfirmAndInterpret, onBackToHistory }) => {
      const { t } = useTranslation();

      return (
        <CardFooter className="p-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t border-slate-200 dark:border-slate-700">
          <Button variant="outline" onClick={onBackToHistory} disabled={isSaving || isInterpreting}>
            <SendToBack className="mr-2 h-4 w-4" /> {t('backToHistory')}
          </Button>
          <Button onClick={onSaveReview} disabled={isSaving || isInterpreting} className="bg-amber-500 hover:bg-amber-600 text-white">
            {isSaving && !isInterpreting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t('saveReview')}
          </Button>
          <Button onClick={onConfirmAndInterpret} disabled={isSaving || isInterpreting} className="bg-green-600 hover:bg-green-700 text-white">
            {isInterpreting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
            {t('confirmAndInterpret')}
          </Button>
        </CardFooter>
      );
    };

    export default ReviewPageActions;
  