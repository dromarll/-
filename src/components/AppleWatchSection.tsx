import { useState } from 'react';
import { Watch, Heart, BellRing, Activity, Radio, Sparkles, Volume2, Shield, Clock, Waves } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { useHaptics } from '../utils/haptics';

export type WatchView = 'radar-alert' | 'prayer-times' | 'vibration-types' | 'heart' | 'sign-quick';

interface VibrationPattern {
  id: string;
  name: string;
  scenario: string;
  patternLabel: string;
  vibrateMs: number[];
  color: string;
  icon: string;
}

const VIBRATION_PATTERNS: VibrationPattern[] = [
  {
    id: 'name-call',
    name: 'نبضة مزدوجة سريعة',
    scenario: 'نداء الشخص بالاسم (مثل نداء: "يا أحمد" بالعيادة)',
    patternLabel: 'Pulse-Pulse (100ms - 80ms - 100ms)',
    vibrateMs: [100, 80, 100],
    color: 'border-emerald-500 bg-emerald-500/15 text-emerald-400',
    icon: '📢'
  },
  {
    id: 'prayer-adhan',
    name: 'نبضة متناغمة هادئة',
    scenario: 'دخول وقت الأذان ومواقيت الصلوات الخمس',
    patternLabel: 'Harmonic Pulse (200ms - 100ms - 200ms)',
    vibrateMs: [200, 100, 200],
    color: 'border-amber-500 bg-amber-500/15 text-amber-400',
    icon: '🕌'
  },
  {
    id: 'doorbell',
    name: 'نقرة مزدوجة خفيفة',
    scenario: 'رنين جرس الباب الخارجي للمنزل أو المكتب',
    patternLabel: 'Gentle Tap (80ms - 60ms - 80ms)',
    vibrateMs: [80, 60, 80],
    color: 'border-cyan-500 bg-cyan-500/15 text-cyan-400',
    icon: '🔔'
  },
  {
    id: 'car-horn',
    name: 'نبضة تحذيرية متقطعة',
    scenario: 'تنبيه بوق سيارة أو اقتراب مركبة في الشارع',
    patternLabel: 'Warning Burst (150ms - 50ms - 150ms)',
    vibrateMs: [150, 50, 150],
    color: 'border-orange-500 bg-orange-500/15 text-orange-400',
    icon: '🚗'
  },
  {
    id: 'emergency-siren',
    name: 'اهتزاز نبضي مكثف متواصل',
    scenario: 'إنذار حريق أو طوارئ إخلاء عاجل',
    patternLabel: 'Urgent Alarm (300ms - 80ms - 300ms - 80ms - 300ms)',
    vibrateMs: [300, 80, 300, 80, 300],
    color: 'border-rose-500 bg-rose-500/15 text-rose-400',
    icon: '🚨'
  }
];

export function AppleWatchSection() {
  const haptics = useHaptics();
  const [activeWatchView, setActiveWatchView] = useState<WatchView>('radar-alert');
  const [selectedVibration, setSelectedVibration] = useState<VibrationPattern>(VIBRATION_PATTERNS[0]);
  const [isVibrating, setIsVibrating] = useState(false);
  const [heartBpm, setHeartBpm] = useState(74);

  const handleSelectView = (view: WatchView) => {
    sounds.playTap();
    setActiveWatchView(view);
    if (view === 'radar-alert') {
      haptics.notification();
      sounds.playAlert('radar');
    } else if (view === 'prayer-times') {
      haptics.notification();
      sounds.playHospitalChime();
    } else if (view === 'heart') {
      haptics.heartbeat();
    } else if (view === 'vibration-types') {
      haptics.selection();
    } else {
      haptics.warning();
    }
  };

  const testVibrationPattern = (pat: VibrationPattern) => {
    sounds.playTap();
    setSelectedVibration(pat);
    setIsVibrating(true);

    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pat.vibrateMs);
      } catch {}
    }

    if (pat.id === 'emergency-siren') {
      haptics.warning();
      sounds.playEmergencySiren();
    } else if (pat.id === 'prayer-adhan') {
      haptics.notification();
      sounds.playHospitalChime();
      sounds.speakArabic('موعد أذان العصر');
    } else if (pat.id === 'name-call') {
      haptics.notification();
      sounds.speakArabic('نداء المريض أحمد');
    } else if (pat.id === 'doorbell') {
      haptics.light();
      sounds.playDoorbell();
    } else {
      haptics.heavy();
      sounds.playCarHorn();
    }

    setTimeout(() => {
      setIsVibrating(false);
    }, 1800);
  };

  return (
    <section id="watch" className="py-16 sm:py-24 relative overflow-hidden flex flex-col items-center select-none font-thmanyah">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 sm:p-12 shadow-2xl lift-3d">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Text & Features */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-accent)]/15 text-[var(--brand-accent)]">
                <Watch className="w-3.5 h-3.5" />
                <span>ساعة مُعِين الذكية (Mueen Smart Watch)</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black font-thmanyah tracking-tight">
                اهتزازات حسية على المعصم تسبق الخطر وتنبّه للأذان
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                تصميم ذكي مخصص للأصم: تتصل ساعة مُعِين بالرادار لاسلكياً، وتصدر نبضات واهتزازات معصم متباينة تمكّن الأصم من تمييز نداء اسمه، ومواقيت الصلاة، ورنين الباب، وإنذارات الطوارئ دون الحاجة للنظر للشاشة.
              </p>

              {/* Watch Feature Tabs */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSelectView('radar-alert')}
                  className={`lift-3d px-3.5 py-2 rounded-xl text-xs font-bold font-thmanyah border transition-all cursor-pointer ${
                    activeWatchView === 'radar-alert'
                      ? 'bg-[var(--brand-primary)] text-white border-transparent shadow-md'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  تنبيه الرادار المباشر
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectView('prayer-times')}
                  className={`lift-3d px-3.5 py-2 rounded-xl text-xs font-bold font-thmanyah border transition-all cursor-pointer ${
                    activeWatchView === 'prayer-times'
                      ? 'bg-amber-600 text-white border-transparent shadow-md'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  مواعيد الصلاة والأذان
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectView('vibration-types')}
                  className={`lift-3d px-3.5 py-2 rounded-xl text-xs font-bold font-thmanyah border transition-all cursor-pointer ${
                    activeWatchView === 'vibration-types'
                      ? 'bg-emerald-600 text-white border-transparent shadow-md'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  أنواع اهتزازات المعصم
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectView('heart')}
                  className={`lift-3d px-3.5 py-2 rounded-xl text-xs font-bold font-thmanyah border transition-all cursor-pointer ${
                    activeWatchView === 'heart'
                      ? 'bg-rose-600 text-white border-transparent shadow-md'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  المؤشرات الحيوية والنبض
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectView('sign-quick')}
                  className={`lift-3d px-3.5 py-2 rounded-xl text-xs font-bold font-thmanyah border transition-all cursor-pointer ${
                    activeWatchView === 'sign-quick'
                      ? 'bg-cyan-600 text-white border-transparent shadow-md'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  إشارة الطوارئ (SOS)
                </button>
              </div>

              {/* Wrist Vibration Patterns Interactive Showcase (أنواع الاهتزازات عند المعصم) */}
              <div className="pt-2 p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black font-thmanyah">أنواع اهتزازات المعصم (انقر للاختبار والاهتزاز):</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Haptic Engine HD</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VIBRATION_PATTERNS.map((pat) => (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => testVibrationPattern(pat)}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between lift-3d-subtle cursor-pointer ${
                        selectedVibration.id === pat.id
                          ? `${pat.color} shadow-sm scale-[1.01]`
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-emerald-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{pat.icon}</span>
                        <div>
                          <p className="text-xs font-bold leading-tight">{pat.name}</p>
                          <p className="text-[9px] text-[var(--text-secondary)] mt-0.5">{pat.scenario}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">تجربة ⚡</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Smartwatch Case Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-[400px] flex items-center justify-center lift-3d cursor-pointer select-none">
                {/* Watch Strap Top */}
                <div className="absolute top-0 w-36 h-12 bg-[#1A222B] rounded-t-2xl border-t border-x border-[#333E4D] flex flex-col justify-around py-1 shadow-inner">
                  <div className="w-full h-1 bg-[#28323F] rounded-full" />
                  <div className="w-full h-1 bg-[#28323F] rounded-full" />
                </div>

                {/* Watch Strap Bottom */}
                <div className="absolute bottom-0 w-36 h-12 bg-[#1A222B] rounded-b-2xl border-b border-x border-[#333E4D] flex flex-col justify-around py-1 shadow-inner">
                  <div className="w-full h-1 bg-[#28323F] rounded-full" />
                  <div className="w-full h-1 bg-[#28323F] rounded-full" />
                </div>

                {/* Digital Crown & Button */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3.5 h-20 bg-[#2D3745] rounded-r-xl border border-[#48566A] flex flex-col items-center justify-between py-2 shadow-md z-30">
                  <div className="w-2.5 h-8 bg-[#1B222C] rounded-sm border border-[#52637B]" />
                  <div className="w-2 h-5 bg-[#1B222C] rounded-sm" />
                </div>

                {/* Smartwatch Titanium Case Body */}
                <div className={`relative z-20 w-64 h-80 rounded-[44px] bg-gradient-to-b from-[#2A3442] via-[#1D2530] to-[#141A22] border-[5px] border-[#3F4D62] shadow-2xl p-3 flex flex-col justify-between text-white transition-all duration-300 ${
                  isVibrating ? 'animate-bounce shadow-[0_0_35px_rgba(16,185,129,0.7)]' : ''
                }`}>
                  {/* Sapphire Screen */}
                  <div className="w-full h-full rounded-[34px] bg-black p-3.5 flex flex-col justify-between border border-white/10 overflow-hidden relative">
                    {/* Watch Top Bar */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ساعة مُعِين
                      </span>
                      <span className="font-bold text-white">03:45 م</span>
                    </div>

                    {/* View 1: Radar Alert View */}
                    {activeWatchView === 'radar-alert' && (
                      <div className="my-auto p-2.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-center animate-pulse">
                        <BellRing className="w-7 h-7 text-rose-400 mx-auto mb-1 animate-bounce" />
                        <p className="text-[11px] font-black font-thmanyah text-rose-100">
                          نداء مسموع بالعيادة!
                        </p>
                        <p className="text-[9px] text-rose-200 mt-0.5 font-bold">
                          "نداء المريض: أحمد"
                        </p>
                        <div className="mt-1.5 text-[8px] font-mono text-emerald-300 bg-black/60 py-0.5 px-1.5 rounded-full inline-block">
                          جهة اليمين ➡️ · اهتزاز نبضي مزدوج
                        </div>
                      </div>
                    )}

                    {/* View 2: Prayer Times View (مواعيد الصلاة) */}
                    {activeWatchView === 'prayer-times' && (
                      <div className="my-auto p-2.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-center space-y-1">
                        <div className="flex items-center justify-center gap-1 text-amber-300 text-sm">
                          <span>🕌</span>
                          <span className="text-[10px] font-bold font-thmanyah">صلاة العصر</span>
                        </div>
                        <div className="text-2xl font-black font-mono text-white">
                          03:45 <span className="text-[10px] font-normal text-amber-300">م</span>
                        </div>
                        <p className="text-[9px] text-emerald-300 font-thmanyah">
                          متبقي 20 دقيقة · وميض الأذان المرئي جاهز
                        </p>
                        <div className="text-[8px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded-full inline-block">
                          المغرب 06:12 م · العشاء 07:42 م
                        </div>
                      </div>
                    )}

                    {/* View 3: Vibration Types View */}
                    {activeWatchView === 'vibration-types' && (
                      <div className="my-auto p-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-1">
                        <span className="text-2xl">{selectedVibration.icon}</span>
                        <p className="text-[11px] font-black font-thmanyah text-white">
                          {selectedVibration.name}
                        </p>
                        <p className="text-[8px] text-emerald-300 font-mono">
                          {selectedVibration.patternLabel}
                        </p>
                        <div className="text-[8px] text-slate-300 mt-1">
                          {selectedVibration.scenario}
                        </div>
                      </div>
                    )}

                    {/* View 4: Heart Vitals View */}
                    {activeWatchView === 'heart' && (
                      <div className="my-auto p-2.5 rounded-2xl bg-[#141A22] border border-white/10 text-center">
                        <Heart className="w-7 h-7 text-rose-500 fill-rose-500 mx-auto mb-0.5 animate-pulse" />
                        <div className="text-2xl font-black font-mono text-white">
                          {heartBpm} <span className="text-[10px] font-normal text-slate-400">BPM</span>
                        </div>
                        <p className="text-[9px] text-emerald-400 font-thmanyah mt-0.5">
                          المؤشرات الحيوية مستقرة تماماً
                        </p>
                      </div>
                    )}

                    {/* View 5: Sign SOS View */}
                    {activeWatchView === 'sign-quick' && (
                      <div className="my-auto p-2.5 rounded-2xl bg-cyan-950/70 border border-cyan-500/50 text-center">
                        <span className="text-3xl animate-bounce">🆘</span>
                        <p className="text-[11px] font-bold text-cyan-200 font-thmanyah mt-0.5">
                          طلب مساعدة طبية عاجلة
                        </p>
                        <p className="text-[8px] text-slate-300 mt-0.5">
                          إرسال إشعار الطوارئ فوراً
                        </p>
                      </div>
                    )}

                    {/* Smartwatch Bottom Status Bar */}
                    <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-white/10">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Activity className="w-2.5 h-2.5" />
                        <span>BLE متصل</span>
                      </span>
                      <span className="text-slate-300">ساعة مُعِين</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
