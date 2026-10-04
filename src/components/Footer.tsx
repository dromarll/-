import { ArrowUp, Shield, Lock } from 'lucide-react';
import { MueenLogo } from './MueenLogo';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

interface FooterProps {
  onOpenDeveloperPortal?: () => void;
}

export function Footer({ onOpenDeveloperPortal }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--border-subtle)] py-12 text-xs transition-colors bg-[var(--bg-surface)] text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[var(--border-subtle)]">
          {/* Logo & Brief */}
          <div className="md:col-span-5 space-y-3">
            <MueenLogo size="md" showSubtitle={true} />
            <p className="text-xs leading-relaxed max-w-sm">
              مبادرة وطنية تقنية لتمكين الصم وضعاف السمع في المملكة العربية السعودية، صُممت لتكون الأذن والصوت المُمكّن وفق رؤية 2030.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--brand-accent)]">
              <Shield className="w-3.5 h-3.5" />
              <span>خصوصية طبية تامة · تشفير محلي للإشارات والبيانات</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-2">
            <p className="font-bold text-[var(--text-primary)]">أقسام الموقع</p>
            <ul className="space-y-1 text-xs">
              <li><a href="#translator" className="hover:text-[var(--brand-accent)] transition-colors">الترجمة الثنائية</a></li>
              <li><a href="#iphone-app" className="hover:text-[var(--brand-accent)] transition-colors">تطبيق الجوال (آيفون 17)</a></li>
              <li><a href="#radar" className="hover:text-[var(--brand-accent)] transition-colors">رادار الصم الحساس</a></li>
              <li><a href="#watch" className="hover:text-[var(--brand-accent)] transition-colors">ساعة أبل واتش</a></li>
              <li><a href="#stats" className="hover:text-[var(--brand-accent)] transition-colors">إحصائيات الأثر الوطني</a></li>
              <li><a href="#innovators" className="hover:text-[var(--brand-accent)] transition-colors">فريق المبتكرين</a></li>
            </ul>
          </div>

          {/* Citations */}
          <div className="md:col-span-4 space-y-2">
            <p className="font-bold text-[var(--text-primary)]">المصادر والدراسات المعتمدة</p>
            <ul className="space-y-1 text-[11px] opacity-80">
              <li>منظمة الصحة العالمية (WHO) — تقرير السمع العالمي</li>
              <li>وزارة الصحة السعودية — مبادرات الوصول الشامل</li>
              <li>اليوم الدولي للغات الإشارة — الأمم المتحدة</li>
              <li>National Center for Biotechnology Information (NCBI)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Rights, Developer Tab, and Scroll Up */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} برنامج مُعِين لتمكين الصم وضعاف السمع. جميع الحقوق محفوظة.</p>

          {/* تبويب صغير تحت آخر شيء اسمه: للمطورين فقط */}
          {onOpenDeveloperPortal && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                sounds.playTap();
                onOpenDeveloperPortal();
              }}
              className="px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 font-bold font-thmanyah flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>للمطورين فقط</span>
            </button>
          )}

          <button
            type="button"
            onClick={scrollToTop}
            className="lift-3d px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] flex items-center gap-1 hover:text-[var(--brand-accent)]"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
