import { useState } from 'react';
import { Watch, Heart, BellRing, Activity, Radio, Sparkles, Volume2, Shield } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { useHaptics } from '../utils/haptics';

export function AppleWatchSection() {
  const haptics = useHaptics();
  const [activeWatchView, setActiveWatchView] = useState<'radar-alert' | 'heart' | 'sign-quick'>('radar-alert');
  const [heartBpm, setHeartBpm] = useState(74);

  const handleSelectView = (view: 'radar-alert' | 'heart' | 'sign-quick') => {
    sounds.playTap();
    setActiveWatchView(view);
    if (view === 'radar-alert') {
      haptics.notification();
      sounds.playAlert('radar');
    } else if (view === 'heart') {
      haptics.heartbeat();
    } else {
      haptics.warning();
    }
  };

  return (
    <section id="watch" className="py-16 sm:py-24 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 sm:p-12 shadow-2xl lift-3d">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Text & Features */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-accent)]/15 text-[var(--brand-accent)]">
                <Watch className="w-3.5 h-3.5" />
                <span>ساعة أبل الذكية (Apple Watch Ultra)</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black font-thmanyah tracking-tight">
                نبضات واهتزازات ذكية على المعصم تسبق الخطر
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                تصميم حقيقي مطابق لساعة أبل الذكية: بمجرد أن يلتقط رادار مُعِين أي نداء بالاسم أو رنين جرس أو صافرة إنذار، تصدر الساعة اهتزازات حسية مميزة (Haptic Feedback) تنبه الأصم فوراً على معصمه.
              </p>

              {/* Watch Feature Tabs with 3D lift */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSelectView('radar-alert')}
                  className={`lift-3d px-3.5 py-2 rounded-xl text-xs font-bold font-thmanyah border transition-all ${
                    activeWatchView === 'radar-alert'
                      ? 'bg-[var(--brand-primary)] text-white border-transparent shadow-md'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  تنبيه الرادار واهتزاز المعصم
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectView('heart')}
                  className={`lift-3d px-3.5 py-2 rounded-xl text-xs font-bold font-thmanyah border transition-all ${
                    activeWatchView === 'heart'
                      ? 'bg-[var(--brand-primary)] text-white border-transparent shadow-md'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  مراقبة النبض والمؤشرات الحيوية
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectView('sign-quick')}
                  className={`lift-3d px-3.5 py-2 rounded-xl text-xs font-bold font-thmanyah border transition-all ${
                    activeWatchView === 'sign-quick'
                      ? 'bg-[var(--brand-primary)] text-white border-transparent shadow-md'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  إشارة الطوارئ السريعة (SOS)
                </button>
              </div>
            </div>

            {/* Right Column: Unmistakable Apple Watch Ultra Case Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-[380px] flex items-center justify-center lift-3d cursor-pointer select-none">
                {/* Watch Strap Top (Apple Alpine Loop / Ocean Band with ribbing) */}
                <div className="absolute top-0 w-36 h-12 bg-[#20242B] rounded-t-2xl border-t border-x border-[#3F4450] flex flex-col justify-around py-1 shadow-inner">
                  <div className="w-full h-1 bg-[#2C313C] rounded-full" />
                  <div className="w-full h-1 bg-[#2C313C] rounded-full" />
                </div>

                {/* Watch Strap Bottom */}
                <div className="absolute bottom-0 w-36 h-12 bg-[#20242B] rounded-b-2xl border-b border-x border-[#3F4450] flex flex-col justify-around py-1 shadow-inner">
                  <div className="w-full h-1 bg-[#2C313C] rounded-full" />
                  <div className="w-full h-1 bg-[#2C313C] rounded-full" />
                </div>

                {/* Left Side: International Orange Action Button (Apple Watch Ultra Signature) */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-3 h-14 bg-[#FF5E00] rounded-l-md border-y border-l border-[#D94C00] shadow-md z-30" />

                {/* Right Side: Protruding Crown Guard + Digital Crown + Side Button */}
                <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-4 h-24 bg-[#3E434F] rounded-r-xl border border-[#525867] flex flex-col items-center justify-between py-2 shadow-md z-30">
                  {/* Digital Crown with tactile knurling */}
                  <div className="w-3.5 h-10 bg-[#292D35] rounded-sm border border-[#5F6575] flex flex-col justify-around py-0.5">
                    <div className="w-full h-[1px] bg-[#6B7280]" />
                    <div className="w-full h-[1px] bg-[#6B7280]" />
                    <div className="w-full h-[1px] bg-[#6B7280]" />
                    <div className="w-full h-[1px] bg-[#6B7280]" />
                  </div>
                  {/* Flush Side Button */}
                  <div className="w-2.5 h-7 bg-[#2E323B] rounded-sm border border-[#4B515F]" />
                </div>

                {/* Apple Watch Titanium Case Body */}
                <div className="relative z-20 w-64 h-76 rounded-[48px] bg-gradient-to-b from-[#3E434F] via-[#323640] to-[#252830] border-[6px] border-[#4D5362] shadow-2xl p-3 flex flex-col justify-between text-white">
                  {/* Flat Sapphire Screen Bezel */}
                  <div className="w-full h-full rounded-[38px] bg-black p-3.5 flex flex-col justify-between border border-white/10 overflow-hidden relative">
                    {/* watchOS Top Bar */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        مُعِين
                      </span>
                      <span className="font-bold text-white">10:42 ص</span>
                    </div>

                    {/* View 1: Radar Alert View */}
                    {activeWatchView === 'radar-alert' && (
                      <div className="my-auto p-2.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-center animate-pulse">
                        <BellRing className="w-7 h-7 text-rose-400 mx-auto mb-1 animate-bounce" />
                        <p className="text-[11px] font-black font-thmanyah text-rose-100">
                          نداء مسموع بالعيادة!
                        </p>
                        <p className="text-[9px] text-rose-200 mt-0.5 font-bold">
                          "نداء المريض أحمد"
                        </p>
                        <div className="mt-1.5 text-[8px] font-mono text-emerald-300 bg-black/60 py-0.5 px-1.5 rounded-full inline-block">
                          اهتزاز Haptic على المعصم
                        </div>
                      </div>
                    )}

                    {/* View 2: Heart Vitals View */}
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

                    {/* View 3: Sign SOS View */}
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

                    {/* watchOS Bottom Complication Bar */}
                    <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-white/10">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Activity className="w-2.5 h-2.5" />
                        <span>BLE نشط</span>
                      </span>
                      <span className="text-slate-300">Apple Watch Ultra</span>
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
