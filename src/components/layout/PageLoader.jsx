
    import React from 'react';
    import { Loader2 } from 'lucide-react';

    const PageLoader = () => {
      return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-950">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        </div>
      );
    };

    export default PageLoader;
  