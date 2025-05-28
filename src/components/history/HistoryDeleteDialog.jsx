
    import React from 'react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog.jsx";
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const HistoryDeleteDialog = ({ isOpen, onOpenChange, analysisToDelete, onConfirmDelete, onCancelDelete, analyses }) => {
      const { t } = useTranslation();

      if (!analysisToDelete) return null;

      const analysisDetails = analyses.find(a => a.id === analysisToDelete);
      const patientName = analysisDetails?.patient_name || t('thisAnalysisFallback');

      return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
          <AlertDialogContent className="bg-white dark:bg-slate-800 rounded-lg shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">{t('areYouSure')}</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 dark:text-slate-300">
                {t('deleteConfirmationMessage', { patientName })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel onClick={onCancelDelete} className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">
                {t('cancel')}
              </AlertDialogCancel>
              <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                {t('yesDeleteAnalysis')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };

    export default HistoryDeleteDialog;
  