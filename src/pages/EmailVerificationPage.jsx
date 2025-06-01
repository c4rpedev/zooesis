import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { MailCheck } from 'lucide-react'; // Icono de chequeo de correo
import { motion } from 'framer-motion';
import { useTranslation } from '@/contexts/TranslationContext.jsx';

const EmailVerificationPage = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex items-center justify-center min-h-[calc(100vh-10rem)] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-950 p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-center">
        <CardHeader className="p-8 bg-blue-500/10 dark:bg-blue-600/20 rounded-t-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <MailCheck className="mx-auto h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">{t('verifyEmailTitle')}</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300 pt-1">
            {t('verifyEmailDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            {t('checkInboxMessage')}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('spamFolderMessage')}
          </p>
          {/* Opcional: Agregar un botón para reenviar correo si implementas esa lógica */}
          {/* <Button variant="link" className="text-primary dark:text-sky-400">
              {t('resendEmailButton')}
          </Button> */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmailVerificationPage;
