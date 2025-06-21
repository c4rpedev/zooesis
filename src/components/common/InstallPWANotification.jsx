import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';


const InstallPWANotification = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not in standalone mode and PWA is not already installed (or installation not triggered from here)
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setIsVisible(true);
      }
    };

    const appInstalledHandler = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    // Initial check in case the event was missed or component mounted later
    if (window.deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
        setDeferredPrompt(window.deferredPrompt);
        setIsVisible(true);
    }


    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setIsVisible(false);
    setDeferredPrompt(null);
    if (onClose) onClose(); // Also call onClose if installed via notification
  };

  const handleCloseClick = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-800 text-white shadow-lg flex items-center justify-between z-50 print:hidden">
      <span className="mr-4">Install Zooesis App for a better experience!</span>
      <div className="flex items-center space-x-2">
        <Button onClick={handleInstallClick} variant="secondary" size="sm">
          Install
        </Button>
        <Button onClick={handleCloseClick} variant="ghost" size="icon">
          <X className="h-5 w-5" />
          <span className="sr-only">Close notification</span>
        </Button>
      </div>
    </div>
  );
};

export default InstallPWANotification;
