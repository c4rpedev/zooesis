
    import React from 'react';

    const AdminPageHeader = ({ title, children }) => {
      return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{title}</h1>
          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      );
    };

    export default AdminPageHeader;
  