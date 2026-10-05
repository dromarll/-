/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header, ThemeType } from './components/Header';
import { HeroMesh } from './components/HeroMesh';
import { BidirectionalTranslator } from './components/BidirectionalTranslator';
import { IPhone17AppPreview } from './components/IPhone17AppPreview';
import { InteractiveDevicePreview } from './components/InteractiveDevicePreview';
import { EnvironmentalRadar } from './components/EnvironmentalRadar';
import { AppleWatchSection } from './components/AppleWatchSection';
import { InteractiveStats } from './components/InteractiveStats';
import { InnovatorsSection } from './components/InnovatorsSection';
import { DeveloperPortal } from './components/DeveloperPortal';
import { OnboardingNameModal } from './components/OnboardingNameModal';
import { MueenLinkModal } from './components/MueenLinkModal';
import { DeviceSimulatorBar, DeviceMode } from './components/DeviceSimulatorBar';
import { SignDictionaryModal } from './components/SignDictionaryModal';
import { AppleCarPlayModal } from './components/AppleCarPlayModal';
import { Footer } from './components/Footer';
import { triggerHaptic } from './utils/haptics';
import { sounds } from './utils/soundEffects';

export default function App() {
  // 3 Distinct Themes: 'empathy' | 'dark' | 'vibrant'
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dark');

  // Device mode switcher ('desktop' | 'ipad' | 'mobile')
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');

  // Fullscreen standalone App state
  const [isAppFullscreen, setIsAppFullscreen] = useState(false);

  // Sign Dictionary modal state
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);

  // Apple CarPlay modal state
  const [isCarPlayOpen, setIsCarPlayOpen] = useState(false);

  // Developer Portal state (Password protected from 1 to 8: '12345678')
  const [isDeveloperPortalOpen, setIsDeveloperPortalOpen] = useState(false);

  // Mueen Diamond Link Modal state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // User Name Onboarding state (Triple name entry on first visit)
  const [userName, setUserName] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('mueen_user_name') || '';
      }
    } catch {
      return '';
    }
    return '';
  });

  // Open modal automatically if user name is not yet saved
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return !localStorage.getItem('mueen_user_name');
      }
    } catch {
      return false;
    }
    return false;
  });

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-empathy', 'theme-dark', 'theme-vibrant', 'theme-medical', 'theme-oasis', 'dark');

    if (currentTheme === 'dark') {
      root.classList.add('theme-dark', 'dark');
    } else if (currentTheme === 'empathy') {
      root.classList.add('theme-empathy');
    } else if (currentTheme === 'vibrant') {
      root.classList.add('theme-vibrant');
    } else if (currentTheme === 'medical') {
      root.classList.add('theme-medical', 'dark');
    } else if (currentTheme === 'oasis') {
      root.classList.add('theme-oasis', 'dark');
    }
  }, [currentTheme]);

  // Smooth scroll or open fullscreen app
  const handleScrollToIPhone = () => {
    triggerHaptic('medium');
    sounds.playTap();
    setIsAppFullscreen(true);
  };

  const handleOpenRadar = () => {
    triggerHaptic('radarPing');
    sounds.playTap();
    const el = document.getElementById('radar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDevice = (device: DeviceMode) => {
    triggerHaptic('selection');
    sounds.playTap();
    setDeviceMode(device);

    if (device === 'mobile') {
      handleScrollToIPhone();
    } else {
      const el = document.getElementById('device-simulator');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOnboardingComplete = (name: string) => {
    setUserName(name);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('mueen_user_name', name);
      }
    } catch {
      // safe fallback
    }
    setIsOnboardingOpen(false);
  };

  // Return to homepage anytime 'برنامج معين' is clicked
  const handleNavigateHome = () => {
    triggerHaptic('medium');
    sounds.playTap();
    setIsDeveloperPortalOpen(false);
    setIsDictionaryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Small logout action to clear name and re-open entry modal
  const handleLogout = () => {
    triggerHaptic('medium');
    sounds.playTap();
    sounds.speakArabic('تم تسجيل الخروج');
    setUserName('');
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('mueen_user_name');
      }
    } catch {
      // safe fallback
    }
    setIsOnboardingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-300 font-sans antialiased relative pb-28">
      {/* 1. Onboarding Name Modal (أول ما يفتح الرابط يطلب الاسم الثلاثي) */}
      <OnboardingNameModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
      />

      {/* 2. Full Dedicated Developer Portal (شاشة ثانية مستقلة بكلمة مرور 12345678 لسحابة فايربيز) */}
      {isDeveloperPortalOpen && (
        <DeveloperPortal onClose={() => setIsDeveloperPortalOpen(false)} />
      )}

      {/* 2.5 Mueen Diamond Link Modal (رابط ومشاركة تطبيق معين بشكله المعين والباركود 🔷) */}
      <MueenLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />

      {/* 3. Top Professional Header */}
      <Header
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        onOpenDictionary={() => {
          triggerHaptic('selection');
          sounds.playTap();
          setIsDictionaryOpen(true);
        }}
        onOpenRadar={handleOpenRadar}
        onOpenCarPlay={() => {
          triggerHaptic('medium');
          sounds.playTap();
          setIsCarPlayOpen(true);
        }}
        onNavigateHome={handleNavigateHome}
        userName={userName}
        onLogout={handleLogout}
        onOpenLinkModal={() => setIsLinkModalOpen(true)}
      />

      {/* Main Content (Pristine public showcase without raw Firebase database blocks) */}
      <main className="space-y-16 sm:space-y-24">
        {/* 4. Hero Section with Glow and Personalized Explanation */}
        <HeroMesh
          onScrollToIPhone={handleScrollToIPhone}
          userName={userName}
          onOpenNameModal={() => setIsOnboardingOpen(true)}
          onOpenLinkModal={() => setIsLinkModalOpen(true)}
        />

        {/* 5. Bidirectional Translator Section */}
        <BidirectionalTranslator />

        {/* 6. True iPhone 17 App Preview */}
        <IPhone17AppPreview
          onOpenDictionaryModal={() => setIsDictionaryOpen(true)}
          onOpenRadarModal={handleOpenRadar}
          onOpenCarPlayModal={() => setIsCarPlayOpen(true)}
          isFullscreenOpen={isAppFullscreen}
          onToggleFullscreen={setIsAppFullscreen}
        />

        {/* 7. iPad & Desktop Simulator Preview */}
        <InteractiveDevicePreview
          device={deviceMode}
          onOpenDictionary={() => setIsDictionaryOpen(true)}
          onOpenRadar={handleOpenRadar}
        />

        {/* 8. Environmental Audio Radar */}
        <EnvironmentalRadar />

        {/* 9. Apple Watch Section */}
        <AppleWatchSection />

        {/* 10. Interactive Impact Statistics */}
        <InteractiveStats />

        {/* 11. Innovators Section: د. عمر سلمان الشمري & د. ضي شايع الحربي */}
        <InnovatorsSection />
      </main>

      {/* 12. Footer with discreet 'للمطورين فقط' button */}
      <Footer onOpenDeveloperPortal={() => setIsDeveloperPortalOpen(true)} />

      {/* 13. Persistent Bottom Dock */}
      <DeviceSimulatorBar
        currentDevice={deviceMode}
        onSelectDevice={handleSelectDevice}
        onOpenDictionary={() => {
          triggerHaptic('selection');
          setIsDictionaryOpen(true);
        }}
        onOpenRadar={handleOpenRadar}
      />

      {/* 14. Sign Dictionary Modal */}
      <SignDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
      />

      {/* 15. Apple CarPlay Modal (وضع شاشة السيارة: نور أحمر وامض للطوارئ وتنبيهات الأذان) */}
      <AppleCarPlayModal
        isOpen={isCarPlayOpen}
        onClose={() => setIsCarPlayOpen(false)}
      />
    </div>
  );
}
