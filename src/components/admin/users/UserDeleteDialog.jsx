
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
    import { Button } from '@/components/ui/button.jsx';
    import { Loader2 } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const UserDeleteDialog = ({ user, isOpen, onClose, onConfirmDelete, isDeleting }) => {
      const { t } = useTranslation();

      if (!user) return null;

      return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmUserDeletionTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('confirmUserDeletionMessage', { email: user.email })}
                <br />
                <strong className="text-red-500">{t('actionCannotBeUndone')}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={onClose}>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onConfirmDelete} 
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('deleteUser')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };

    export default UserDeleteDialog;
  