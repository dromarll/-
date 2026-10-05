import { useState } from 'react';
import { MueenLogo } from './MueenLogo';
import { Palette, Sparkles, BookOpen, Radio, Menu, X, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

export type ThemeType = 'empathy' | 'dark' | 'vibrant' | 'medical' | 'oasis';

interface HeaderProps {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
  onOpenDictionary: () => void;
  onOpenRadar: () => void;
  onOpenCarPlay?: () => void;
  onNavigateHome?: () => void;
  userName?: string;
  onLogout?: () => void;
  onOpenLinkModal?: () => void;
}

export function Header({ currentTheme, onSelectTheme, onOpenDictionary, onOpenRadar, onOpenCarPlay, onNavigateHome, userName, onLogout, onOpenLinkModal }: HeaderProps) {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const themes = [
    {
      id: 'empathy',
      name: 'الإنساني الهادئ',
      subtitle: 'أزرق بحري & تركواز هادئ',
      colorPreview: '#1D3557',
      accentPreview: '#2A9D8F',
      bgPreview: '#F8F9FA',
    },
    {
      id: 'dark',
      name: 'الليلي الحديث',
      subtitle: 'داكن مريح & أزرق نيون',
      colorPreview: '#00B4D8',
      accentPreview: '#BB86FC',
      bgPreview: '#121212',
    },
    {
      id: 'vibrant',
      name: 'الطاقة والأمل',
      subtitle: 'بنفسجي عميق & ذهبي مشرق',
      colorPreview: '#5A189A',
      accentPreview: '#FFB703',
      bgPreview: '#FFFBF5',
    },
    {
      id: 'medical',
      name: 'النمط الطبي عالي التباين',
      subtitle: 'كحلي استشفائي & تركواز نقي',
      colorPreview: '#5BC0BE',
      accentPreview: '#6FFFE9',
      bgPreview: '#0B132B',
    },
    {
      id: 'oasis',
      name: 'الواحة الزمردية',
      subtitle: 'أخضر زمردي & ذهبي طبيعي',
      colorPreview: '#10B981',
      accentPreview: '#34D399',
      bgPreview: '#051F18',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 bg-[var(--bg-surface)]/90 border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with (مُ) and Name: Only Mueen and Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onNavigateHome) {
                  onNavigateHome();
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-2.5 lift-3d-subtle cursor-pointer text-right bg-transparent border-0 p-0"
              title="العودة للصفحة الرئيسية"
            >
              <MueenLogo size="md" />
              <span className="text-2xl sm:text-3xl font-black font-thmanyah tracking-tight text-[var(--text-primary)]">
                مُعِين
              </span>
            </button>
          </div>

          {/* Center Links (Clean & uncluttered) */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold font-thmanyah">
            <a href="#translator" className="hover:text-[var(--brand-accent)] transition-colors lift-3d-subtle">
              الترجمة الفورية
            </a>
            <a href="#iphone-app" className="hover:text-[var(--brand-accent)] transition-colors lift-3d-subtle">
              تطبيق الجوال
            </a>
            <a href="#radar" className="hover:text-[var(--brand-accent)] transition-colors lift-3d-subtle">
              رادار الصم
            </a>
            <a href="#watch" className="hover:text-[var(--brand-accent)] transition-colors lift-3d-subtle">
              الساعة الذكية
            </a>
          </nav>

          {/* Right: Only 2 essential simple tools - Theme & Link */}
          <div className="flex items-center gap-2">
            {/* Branded Diamond Link Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                sounds.playTap();
                onOpenLinkModal?.();
              }}
              className="lift-3d px-3 py-1.5 sm:py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-thmanyah flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="مشاركة ورابط مُعِين"
            >
              <span>🔷</span>
              <span className="font-bold">رابط مُعِين</span>
            </button>

            {/* Theme Selector Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="lift-3d p-2 sm:px-3 sm:py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-bold font-thmanyah flex items-center gap-2 cursor-pointer"
                title="اختيار المظهر"
              >
                <Palette className="w-4 h-4 text-[var(--brand-accent)]" />
                <span className="hidden sm:inline">
                  {themes.find((t) => t.id === currentTheme)?.name}
                </span>
              </button>

              {/* Theme Dropdown Menu */}
              {themeMenuOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 shadow-2xl z-50 animate-fadeIn">
                  <p className="text-[11px] font-bold text-[var(--text-secondary)] px-3 py-1.5 border-b border-[var(--border-subtle)] mb-1">
                    اختر المظهر المفضل:
                  </p>
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        onSelectTheme(th.id as ThemeType);
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full text-right p-2.5 rounded-xl text-xs font-bold font-thmanyah flex items-center justify-between transition-colors ${
                        currentTheme === th.id
                          ? 'bg-[var(--brand-accent)]/15 text-[var(--brand-primary)]'
                          : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-sm"
                          style={{ backgroundColor: th.colorPreview }}
                        />
                        <div>
                          <p>{th.name}</p>
                          <p className="text-[10px] text-[var(--text-secondary)] font-normal">
                            {th.subtitle}
                          </p>
                        </div>
                      </div>
                      {currentTheme === th.id && (
                        <Check className="w-4 h-4 text-[var(--brand-accent)]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick CarPlay Button */}
            {onOpenCarPlay && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  sounds.playTap();
                  onOpenCarPlay();
                }}
                className="lift-3d hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-thmanyah text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-colors cursor-pointer"
                title="شاشة السيارة وأبل كار بلاي: نور أحمر للطوارئ وتنبيهات الأذان"
              >
                <span>🚗</span>
                <span>شاشة السيارة (CarPlay)</span>
              </button>
            )}

            {/* Quick Dictionary Button */}
            <button
              type="button"
              onClick={onOpenDictionary}
              className="lift-3d hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-thmanyah text-white shadow-sm"
              style={{ backgroundColor: 'var(--brand-cta)' }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>القاموس الإشاري</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[var(--text-secondary)]"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 border-t border-[var(--border-subtle)] space-y-2 bg-[var(--bg-surface)]">
          <a
            href="#translator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold font-thmanyah hover:bg-black/5 dark:hover:bg-white/5"
          >
            الترجمة الثنائية
          </a>
          <a
            href="#iphone-app"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold font-thmanyah hover:bg-black/5 dark:hover:bg-white/5"
          >
            تطبيق الجوال (آيفون 17)
          </a>
          <a
            href="#radar"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold font-thmanyah hover:bg-black/5 dark:hover:bg-white/5"
          >
            رادار الصم الحساس
          </a>
          <a
            href="#watch"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold font-thmanyah hover:bg-black/5 dark:hover:bg-white/5"
          >
            الساعة الذكية
          </a>
          <a
            href="#stats"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold font-thmanyah hover:bg-black/5 dark:hover:bg-white/5"
          >
            إحصائيات الصم
          </a>
          <a
            href="#innovators"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold font-thmanyah text-emerald-500 hover:bg-black/5 dark:hover:bg-white/5"
          >
            فريق المبتكرين (عمر الشمري & ضي الحربي)
          </a>
          <div className="pt-2 flex flex-col gap-2">
            {onOpenCarPlay && (
              <button
                type="button"
                onClick={() => {
                  onOpenCarPlay();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 text-center flex items-center justify-center gap-1.5"
              >
                <span>🚗</span>
                <span>شاشة السيارة (Apple CarPlay)</span>
              </button>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onOpenDictionary();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-[var(--border-subtle)] text-center"
              >
                تطبيق القاموس
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenRadar();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white text-center"
                style={{ backgroundColor: 'var(--brand-cta)' }}
              >
                الرادار الصوتي
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
