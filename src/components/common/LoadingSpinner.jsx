
    import React from 'react';
    import { Loader2 } from 'lucide-react';

    const LoadingSpinner = ({ fullScreen = false, text }) => {
      const containerClasses = fullScreen 
        ? "flex flex-col justify-center items-center h-screen fixed inset-0 bg-background/80 backdrop-blur-sm z-50" 
        : "flex flex-col justify-center items-center py-10";

      return (
        <div className={containerClasses}>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          {text && <p className="mt-4 text-lg text-muted-foreground">{text}</p>}
        </div>
      );
    };

    export default LoadingSpinner;
  