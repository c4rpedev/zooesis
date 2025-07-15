
    import React from 'react';
    import LandingPageHeader from '@/components/landing/LandingPageHeader.jsx';
    import HeroSection from '@/components/landing/HeroSection.jsx';
    import WhatIsZooesisSection from '@/components/landing/WhatIsZooesisSection.jsx';
    import BenefitsSection from '@/components/landing/BenefitsSection.jsx';
    import GrowingSection from '@/components/landing/GrowingSection.jsx';
    import PricingSection from '@/components/landing/PricingSection.jsx'; // Adde
    import ScreenshotsSection from '@/components/landing/ScreenshotsSection.jsx';
    import RegistrationSection from '@/components/landing/RegistrationSection.jsx';
    import TrustSection from '@/components/landing/TrustSection.jsx';
    import LandingPageFooter from '@/components/landing/LandingPageFooter.jsx';

    const LandingPage = () => {
      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50 dark:from-slate-900 dark:via-slate-850 dark:to-green-900/30 text-slate-700 dark:text-slate-200">
          <LandingPageHeader />
          <HeroSection />
          <WhatIsZooesisSection />
          <BenefitsSection />
          <ScreenshotsSection />
          
          {/* <GrowingSection /> */}
          <RegistrationSection />
          <PricingSection /> 
         
          {/* <TrustSection />*/}
          <LandingPageFooter />
        </div>
      );
    };

    export default LandingPage;
  