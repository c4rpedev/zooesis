
    import React from 'react';
    import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';

    const NewAnalysisPageHeader = ({ title, description, icon }) => {
      return (
        <CardHeader className="bg-gradient-to-r from-primary/10 to-sky-500/10 dark:from-primary/20 dark:to-sky-700/20 p-6 rounded-t-lg">
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">{title}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      );
    };

    export default NewAnalysisPageHeader;
  