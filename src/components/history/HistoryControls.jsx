
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Search, PlusCircle } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const HistoryControls = ({ searchTerm, onSearchTermChange }) => {
      const { t } = useTranslation();

      return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
            <Input
              type="text"
              placeholder={t('searchHistoryPlaceholder')}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10 w-full md:w-80 lg:w-96 h-11 rounded-lg focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <Button asChild className="shadow-md hover:shadow-lg transition-shadow w-full md:w-auto">
            <Link to="/new-analysis">
              <PlusCircle className="mr-2 h-5 w-5" /> {t('newAnalysis')}
            </Link>
          </Button>
        </div>
      );
    };

    export default HistoryControls;
  