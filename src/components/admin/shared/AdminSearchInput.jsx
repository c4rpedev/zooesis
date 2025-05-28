
    import React from 'react';
    import { Input } from '@/components/ui/input.jsx';
    import { Search } from 'lucide-react';

    const AdminSearchInput = ({ searchTerm, onSearchTermChange, placeholder }) => {
      return (
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 h-11 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-sky-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      );
    };

    export default AdminSearchInput;
  