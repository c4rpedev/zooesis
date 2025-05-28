
    import React from 'react';
    import { motion } from 'framer-motion';

    const ReportSection = ({ title, children, icon }) => (
      <motion.div 
        className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-primary mb-4 pb-2 border-b-2 border-primary/30 flex items-center">
          {icon && React.cloneElement(icon, { className: "mr-3 h-7 w-7" })}
          {title}
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </motion.div>
    );

    export default ReportSection;
  