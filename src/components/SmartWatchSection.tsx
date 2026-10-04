import { Watch, Heart, ShieldAlert, Vibrate, BellRing, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

interface SmartWatchSectionProps {
  isDark: boolean;
}

export function SmartWatchSection({ isDark }: SmartWatchSectionProps) {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`rounded-3xl border p-8 sm:p-12 ${
          isDark ? 'bg-[#0E1713] border-emerald-500/25 text-white' : 'bg-white border-[#E0D8C8] text-slate-900'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Context & Features */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <Watch className="w-3.5 h-3.5" />
                <span>الارتباط بالساعات الذكية والإنذار المبكر</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-thmanyah text-balance">
                نبضات ذكية على المعصم تسبق الخطر وتصون السلامة.
              </h3>

              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                بما أن الأصم لا يسمع صفارات الإنذار، منبهات الطوارئ، أو نداءات الاستغاثة، يقوم تطبيق مُعِين بالاقتران المباشر مع الساعات الذكية (Apple Watch / Wear OS) لإرسال اهتزازات بنمط مخصص حسب نوع التنبيه الصوتي المرصود في الرادار.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-inherit bg-slate-500/5 space-y-1">
                  <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                    <Heart className="w-4 h-4" />
                    <span>مراقبة المؤشرات الحيوية</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    رصد نبضات القلب والتوتر الفجائي وتوجيه إشعار للأقارب أو الطوارئ.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-inherit bg-slate-500/5 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                    <Activity className="w-4 h-4" />
                    <span>أنماط اهتزاز مخصصة (Haptic)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    نمط متقطع للنداء في العيادة، ونمط مستمر لصافرة الإنذار أو حوادث السير.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Smartwatch Graphic Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-80 rounded-[44px] bg-slate-900 border-[6px] border-slate-700 shadow-2xl p-4 flex flex-col justify-between text-white">
                {/* Watch Strap Top */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-t-xl" />
                
                {/* Watch Crown button */}
                <div className="absolute -right-3 top-16 w-2.5 h-9 bg-slate-700 rounded-r-md" />

                {/* Watch Screen Content */}
                <div className="flex-1 rounded-[32px] bg-black p-4 flex flex-col justify-between border border-white/10 text-center">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>مُعِين WATCH</span>
                    <span className="text-emerald-400 font-mono font-bold">10:42 ص</span>
                  </div>

                  {/* Active Watch Alert Card */}
                  <div className="my-auto p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-center animate-pulse">
                    <BellRing className="w-8 h-8 text-rose-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-rose-200 font-thmanyah">
                      إنذار رادار بيئي!
                    </p>
                    <p className="text-[10px] text-slate-300 mt-1">
                      صوت مرتفع في المحيط (92 dB)
                    </p>
                    <div className="mt-2 text-[9px] font-mono text-emerald-400 bg-black/60 py-0.5 rounded">
                      اهتزاز Haptic نشط على المعصم
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>72 bpm</span>
                    </span>
                    <span>متصل عبر BLE</span>
                  </div>
                </div>

                {/* Watch Strap Bottom */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
