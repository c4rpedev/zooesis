
    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card.jsx';
    import { History as HistoryIcon } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import useHistoryData from '@/hooks/useHistoryData.jsx';
    import HistoryControls from '@/components/history/HistoryControls.jsx';
    import HistoryView from '@/components/history/HistoryView.jsx';
    import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
    import HistoryDeleteDialog from '@/components/history/HistoryDeleteDialog.jsx';

    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const HistoryPage = () => {
      const { t } = useTranslation();
      const {
        analyses,
        loading,
        analysisToDelete,
        confirmDeleteAnalysis,
        cancelDeleteAnalysis,
        handleDeleteAnalysis,
        fetchAnalyses,
      } = useHistoryData();

      const [searchTerm, setSearchTerm] = useState('');
      const [initialLoading, setInitialLoading] = useState(true);

      useEffect(() => {
        if (!loading) {
          setInitialLoading(false);
        }
      }, [loading]);
      

      const filteredAnalyses = analyses.filter(analysis =>
        (analysis.patient_name && analysis.patient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (analysis.identifier && analysis.identifier.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (analysis.species && analysis.species.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      if (initialLoading) {
        return <LoadingSpinner fullScreen={true} text={t('loadingHistory')} />;
      }

      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 p-6 bg-gradient-to-r from-primary/10 to-sky-500/10 dark:from-primary/20 dark:to-sky-700/20">
              <div className="flex items-center space-x-4 mb-6">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <HistoryIcon className="h-12 w-12 text-primary dark:text-sky-400 p-2 bg-primary/10 dark:bg-sky-400/10 rounded-full" />
                </motion.div>
                <div>
                  <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">{t('history')}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    {t('historyDescription', { count: analyses.length })}
                  </CardDescription>
                </div>
              </div>
              <HistoryControls searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onRefresh={fetchAnalyses} />
            </CardHeader>
            <CardContent className="p-0">
             {loading && analyses.length > 0 ? (
                <div className="py-10"><LoadingSpinner text={t('refreshingHistory')}/></div>
             ) : (
                <HistoryView
                    analyses={filteredAnalyses}
                    searchTerm={searchTerm}
                    onConfirmDelete={confirmDeleteAnalysis}
                />
             )}
            </CardContent>
          </Card>
          
          <HistoryDeleteDialog
            isOpen={!!analysisToDelete}
            onOpenChange={(open) => !open && cancelDeleteAnalysis()}
            analysisToDelete={analysisToDelete}
            onConfirmDelete={handleDeleteAnalysis}
            onCancelDelete={cancelDeleteAnalysis}
            analyses={analyses}
          />
        </motion.div>
      );
    };

    export default HistoryPage;
  