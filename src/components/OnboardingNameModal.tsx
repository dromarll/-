import { useState } from 'react';
import { Sparkles, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

interface OnboardingNameModalProps {
  isOpen: boolean;
  onComplete: (name: string) => void;
}

export function OnboardingNameModal({ isOpen, onComplete }: OnboardingNameModalProps) {
  const [inputName, setInputName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setErrorMsg('فضلاً اكتب اسمك الثلاثي للمتابعة');
      triggerHaptic('error');
      sounds.playAlert();
      return;
    }

    if (trimmed.split(' ').length < 2) {
      setErrorMsg('فضلاً أدخل اسمك الثلاثي كاملاً');
      triggerHaptic('warning');
      sounds.playAlert();
      return;
    }

    triggerHaptic('success');
    sounds.playTap();
    sounds.speakArabic(`حياك الله يا ${trimmed}! يا مرحبا تراحيب المطر نورت برنامج مُعِين`);
    onComplete(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-lg rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-[#14231B] to-[#0A120E] p-6 sm:p-8 text-white text-center shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Welcome */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto text-3xl shadow-xl border border-white/20">
          🌿
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مبادرة طبية وطنية · رؤية 2030</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-thmanyah text-white">
            مرحباً بك في برنامج مُعِين لتمكين الصم
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            منظومة الذكاء الاصطناعي لترجمة لغة الإشارة والتواصل الطبي الفوري.
          </p>
        </div>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-right">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-200 font-thmanyah block">
              فضلاً اكتب اسمك الثلاثي لبدء استعراض الابتكار:
            </label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
                setErrorMsg('');
              }}
              placeholder="مثال: عمر سلمان الشمري"
              className="w-full p-3.5 rounded-2xl bg-black/60 border border-emerald-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 text-right font-medium"
              autoFocus
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 text-center font-bold font-thmanyah">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black font-thmanyah text-sm transition-all shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer lift-3d"
          >
            <span>دخول وبدء استعراض الابتكار</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              sounds.playTap();
              onComplete('زائر كريم');
            }}
            className="w-full py-2.5 rounded-xl border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white font-bold font-thmanyah text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>تخطي والدخول كزائر مباشرة ⚡</span>
          </button>
        </form>

        {/* Footer Credit */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ابتكار: د. عمر الشمري & د. ضي الحربي</span>
          </span>
        </div>
      </div>
    </div>
  );
}
