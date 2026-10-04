import { Phone, MessageCircle, Sparkles, Award, ShieldCheck, GraduationCap, Stethoscope, BookOpen } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

// Official X (Twitter) Icon
function XTwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className || "w-3.5 h-3.5"} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InnovatorsSection() {
  return (
    <section id="innovators" className="py-14 sm:py-20 relative overflow-hidden select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-sm mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>فريق الابتكار والتطوير الطبي</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-thmanyah tracking-tight">
            مبتكرو وقادة برنامج مُعِين
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5">
            رؤية طبية وطنية تسخر الذكاء الاصطناعي لتمكين الصم وضعاف السمع وفق رؤية السعودية 2030.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 1. النجوم المميزون: عمر سلمان الشمري & ضي شايع الحربي (تصميم استثنائي فاخر) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          
          {/* 🌟 عمر سلمان الشمري (المبتكر والمؤسس) */}
          <div className="lift-3d relative overflow-hidden p-6 sm:p-7 rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-surface)] to-emerald-500/10 shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] flex flex-col justify-between space-y-5">
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white shadow-md font-thmanyah">
                  <Sparkles className="w-3 h-3" />
                  <span>المبتكر والمطور 💡</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  رؤية 2030
                </span>
              </div>

              {/* Profile Main */}
              <div className="flex items-center gap-4 pt-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white font-black font-thmanyah text-3xl flex items-center justify-center shadow-xl shrink-0 border-2 border-emerald-300 lift-3d-subtle">
                  ع
                </div>

                <div className="space-y-1 text-right flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black font-thmanyah text-[var(--text-primary)]">
                    عمر سلمان الشمري
                  </h3>

                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 font-thmanyah">
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>طب وجراحة · مقر مليدا</span>
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">
                    صاحب الفكرة والابتكار لمنظومة مُعِين الذكية للصم
                  </p>
                </div>
              </div>

              {/* Social & Contact Card */}
              <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-[var(--text-secondary)] font-thmanyah">
                    رقم التواصل المباشر:
                  </span>
                  <a
                    href="tel:0553008966"
                    className="font-mono text-sm font-black text-emerald-500 hover:underline"
                    dir="ltr"
                  >
                    055 300 8966
                  </a>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:0553008966"
                    onClick={() => {
                      triggerHaptic('medium');
                      sounds.playTap();
                    }}
                    className="lift-3d py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs font-thmanyah flex items-center justify-center gap-1.5 shadow-md text-center"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال</span>
                  </a>

                  <a
                    href="https://wa.me/966553008966"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      triggerHaptic('medium');
                      sounds.playTap();
                    }}
                    className="lift-3d py-2 px-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-black font-thmanyah flex items-center justify-center gap-1.5 text-center text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>واتساب</span>
                  </a>

                  {/* X (Twitter) Account */}
                  <a
                    href="https://x.com/3mr_saa"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      triggerHaptic('selection');
                      sounds.playTap();
                    }}
                    className="lift-3d py-2 px-3 rounded-xl bg-black hover:bg-slate-900 text-white border border-white/20 font-bold text-xs font-thmanyah flex items-center justify-center gap-2 text-center col-span-2 shadow-sm"
                  >
                    <XTwitterIcon className="w-3.5 h-3.5 text-white" />
                    <span>حساب إكس الرسمي (@3mr_saa)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-thmanyah">
              <span className="flex items-center gap-1 text-emerald-500 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>مبادرة طبية وطنية معتمدة</span>
              </span>
              <span>المملكة العربية السعودية 🇸🇦</span>
            </div>
          </div>

          {/* 🌟 ضي شايع الحربي (المبتكرة والمطورة) */}
          <div className="lift-3d relative overflow-hidden p-6 sm:p-7 rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-surface)] to-cyan-500/10 shadow-[0_20px_50px_-10px_rgba(6,182,212,0.3)] flex flex-col justify-between space-y-5">
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-cyan-500 text-white shadow-md font-thmanyah">
                  <Sparkles className="w-3 h-3" />
                  <span>المبتكرة والمطورة 🌟</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  رؤية 2030
                </span>
              </div>

              {/* Profile Main */}
              <div className="flex items-center gap-4 pt-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-500 to-teal-400 text-white font-black font-thmanyah text-3xl flex items-center justify-center shadow-xl shrink-0 border-2 border-cyan-300 lift-3d-subtle">
                  ض
                </div>

                <div className="space-y-1 text-right flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black font-thmanyah text-[var(--text-primary)]">
                    ضي شايع الحربي
                  </h3>

                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 font-thmanyah">
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>طب وجراحة · مقر عنيزة</span>
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">
                    شريكة الابتكار والتطوير الإكلينيكي لمنظومة مُعِين
                  </p>
                </div>
              </div>

              {/* Social & Contact Card */}
              <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-[var(--text-secondary)] font-thmanyah">
                    رقم التواصل المباشر:
                  </span>
                  <a
                    href="tel:0559787161"
                    className="font-mono text-sm font-black text-cyan-400 hover:underline"
                    dir="ltr"
                  >
                    055 978 7161
                  </a>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:0559787161"
                    onClick={() => {
                      triggerHaptic('medium');
                      sounds.playTap();
                    }}
                    className="lift-3d py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs font-thmanyah flex items-center justify-center gap-1.5 shadow-md text-center"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال</span>
                  </a>

                  <a
                    href="https://wa.me/966559787161"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      triggerHaptic('medium');
                      sounds.playTap();
                    }}
                    className="lift-3d py-2 px-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-black font-thmanyah flex items-center justify-center gap-1.5 text-center text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-thmanyah">
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>مبادرة طبية وطنية معتمدة</span>
              </span>
              <span>المملكة العربية السعودية 🇸🇦</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. المشرف على الابتكار: البروفيسور أحمد وفيق الزيني                       */}
        {/*    تصميم راقٍ وموجز وهادئ باللون الذهبي بدون مبالغة كما طلبت               */}
        {/* ========================================================================= */}
        <div className="max-w-4xl mx-auto">
          <div className="lift-3d rounded-2xl border border-amber-500/40 bg-[var(--bg-card)] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            
            <div className="flex items-center gap-3.5 text-right w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-500 font-black font-thmanyah text-xl flex items-center justify-center shrink-0">
                أ
              </div>

              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 font-thmanyah">
                  <Award className="w-3.5 h-3.5" />
                  <span>المشرف على الابتكار</span>
                </div>

                <h4 className="text-base sm:text-lg font-black font-thmanyah text-[var(--text-primary)]">
                  البروفيسور أحمد وفيق الزيني
                </h4>

                <p className="text-xs text-[var(--text-secondary)] font-thmanyah">
                  عضو هيئة تدريس جامعة القصيم · كلية الطب والجراحة (التشريح)
                </p>
              </div>
            </div>

            {/* Contact Actions for Professor */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-subtle)]">
              <span className="font-mono text-xs font-bold text-amber-500 pl-2 hidden md:inline" dir="ltr">
                054 151 5988
              </span>

              <a
                href="tel:0541515988"
                onClick={() => {
                  triggerHaptic('medium');
                  sounds.playTap();
                }}
                className="lift-3d py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-thmanyah flex items-center gap-1 shadow-sm"
              >
                <Phone className="w-3 h-3" />
                <span>اتصال</span>
              </a>

              <a
                href="https://wa.me/966541515988"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  triggerHaptic('medium');
                  sounds.playTap();
                }}
                className="lift-3d py-1.5 px-3 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-black text-xs font-thmanyah flex items-center gap-1 shadow-sm"
              >
                <MessageCircle className="w-3 h-3" />
                <span>واتساب</span>
              </a>
            </div>

          </div>
        </div>

        {/* Back to Top Click Link (زي الكليك تحت يضغط ويرجع لبداية التطبيق) */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              sounds.playTap();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="lift-3d inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black font-thmanyah text-xs sm:text-sm shadow-xl shadow-emerald-950/30 cursor-pointer transition-all border border-white/20"
          >
            <span>الرجوع لبداية التطبيق ⬆️</span>
          </button>
        </div>

      </div>
    </section>
  );
}
