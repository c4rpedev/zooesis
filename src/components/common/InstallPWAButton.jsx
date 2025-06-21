import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming this path is correct

const InstallPWAButton = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const beforeInstallPromptHandler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setDeferredPrompt(e);
    };

    const appInstalledHandler = () => {
      setSupportsPWA(false);
      setDeferredPrompt(null);
      // Optionally, you can log that the app was installed
      console.log('PWA was installed');
    };

    // Check if the app is already running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setSupportsPWA(false);
    } else {
      window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    }
    
    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, discard it
    setSupportsPWA(false); // Hide button after prompting, or after successful install
    setDeferredPrompt(null);
  };

  if (!supportsPWA) {
    return null;
  }

  return (
    <Button onClick={handleInstallClick} variant="outline" size="sm">
      Install App
    </Button>
  );
};

export default InstallPWAButton;
