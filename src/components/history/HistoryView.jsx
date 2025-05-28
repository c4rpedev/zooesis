
    import React from 'react';
    import HistoryTable from '@/components/history/HistoryTable.jsx';
    import HistoryEmptyState from '@/components/history/HistoryEmptyState.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const HistoryView = ({ analyses, searchTerm, onConfirmDelete }) => {
      const { t } = useTranslation();

      if (analyses.length === 0) {
        return <HistoryEmptyState searchTerm={searchTerm} />;
      }

      return (
        <HistoryTable analyses={analyses} onConfirmDelete={onConfirmDelete} />
      );
    };

    export default HistoryView;
  