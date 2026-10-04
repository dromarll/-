import { useState } from 'react';
import { HeartPulse, Brain, DollarSign, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

export function InteractiveStats() {
  const [activeCard, setActiveCard] = useState<'world' | 'arab' | 'saudi' | null>('saudi');

  // List of all Arab League countries flags
  const arabFlags = [
    { code: 'sa', flag: '🇸🇦', name: 'السعودية' },
    { code: 'ae', flag: '🇦🇪', name: 'الإمارات' },
    { code: 'kw', flag: '🇰🇼', name: 'الكويت' },
    { code: 'qa', flag: '🇶🇦', name: 'قطر' },
    { code: 'bh', flag: '🇧🇭', name: 'البحرين' },
    { code: 'om', flag: '🇴🇲', name: 'عمان' },
    { code: 'eg', flag: '🇪🇬', name: 'مصر' },
    { code: 'jo', flag: '🇯🇴', name: 'الأردن' },
    { code: 'iq', flag: '🇮🇶', name: 'العراق' },
    { code: 'ma', flag: '🇲🇦', name: 'المغرب' },
    { code: 'dz', flag: '🇩🇿', name: 'الجزائر' },
    { code: 'tn', flag: '🇹🇳', name: 'تونس' },
    { code: 'ye', flag: '🇾🇪', name: 'اليمن' },
    { code: 'lb', flag: '🇱🇧', name: 'لبنان' },
    { code: 'ps', flag: '🇵🇸', name: 'فلسطين' },
    { code: 'sd', flag: '🇸🇩', name: 'السودان' },
    { code: 'sy', flag: '🇸🇾', name: 'سوريا' },
    { code: 'ly', flag: '🇱🇾', name: 'ليبيا' },
  ];

  const handleHover = (cardKey: 'world' | 'arab' | 'saudi') => {
    if (activeCard !== cardKey) {
      triggerHaptic('selection');
      setActiveCard(cardKey);
    }
  };

  return (
    <section id="stats" className="py-16 sm:py-24 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>أرقام وأبعاد القضية</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-thmanyah tracking-tight mt-1">
            إحصائيات تدفعنا للابتكار والتمكين
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            مرر المؤشر أو اضغط على أي بطاقة لرؤية التفاعل البصري المخصص.
          </p>
        </div>

        {/* 3 Core Interactive Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* ========================================================================= */}
          {/* 1. بطاقة العالم: صورة كوكب الأرض الواضحة + تموج وظل أزرق فضائي          */}
          {/* ========================================================================= */}
          <div
            onMouseEnter={() => handleHover('world')}
            onClick={() => handleHover('world')}
            className={`lift-3d p-7 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer text-center relative overflow-hidden group ${
              activeCard === 'world'
                ? 'bg-gradient-to-b from-[#06182C] via-[#034A75] to-[#0284C7] text-white border-cyan-400 shadow-[0_20px_50px_-10px_rgba(2,132,199,0.7)] scale-[1.03]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-cyan-500/50 hover:shadow-[0_15px_35px_-10px_rgba(2,132,199,0.4)]'
            }`}
          >
            {/* Ambient Blue Ripple Wave Effect in Background */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                activeCard === 'world' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* High-Definition 3D Planet Earth Graphic */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 flex items-center justify-center">
                {/* Outer Planet Atmosphere Glow */}
                <div
                  className={`absolute inset-0 rounded-full blur-md transition-all duration-500 ${
                    activeCard === 'world'
                      ? 'bg-cyan-400/50 scale-110'
                      : 'bg-cyan-500/20'
                  }`}
                />

                {/* Planet Earth Sphere Visual */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-2 border-cyan-300/40 bg-[#0F2B48] flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full transform scale-110"
                  >
                    {/* Deep Blue Ocean */}
                    <circle cx="50" cy="50" r="48" fill="url(#oceanGrad)" />
                    {/* Continents (Americas, Eurasia, Africa, Australia) */}
                    <path
                      d="M25,25 Q35,15 48,22 Q52,30 45,40 Q38,48 30,45 Q22,40 25,25 Z"
                      fill="#10B981"
                      opacity="0.85"
                    />
                    <path
                      d="M55,20 Q70,18 80,30 Q85,45 75,55 Q65,60 55,48 Q50,35 55,20 Z"
                      fill="#059669"
                      opacity="0.9"
                    />
                    <path
                      d="M40,55 Q55,50 60,65 Q62,80 50,85 Q40,82 38,70 Q35,60 40,55 Z"
                      fill="#34D399"
                      opacity="0.85"
                    />
                    <path
                      d="M72,65 Q85,62 88,72 Q85,82 75,80 Q70,75 72,65 Z"
                      fill="#10B981"
                      opacity="0.8"
                    />
                    {/* Cloud atmosphere swirls */}
                    <path
                      d="M15,35 Q40,25 65,38 Q85,48 90,40"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20,65 Q45,75 75,68"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Sphere shading */}
                    <radialGradient id="oceanGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#0C4A6E" />
                    </radialGradient>
                  </svg>

                  {/* Surface Glass Highlight */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none" />
                </div>
              </div>

              {/* Number */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-thmanyah tabular-nums tracking-tight">
                70,000,000
              </div>

              <h4 className="text-base sm:text-lg font-black font-thmanyah mt-2">
                أصم حول العالم
              </h4>

              <p className={`text-xs mt-1 transition-colors ${
                activeCard === 'world' ? 'text-cyan-100' : 'text-[var(--text-secondary)]'
              }`}>
                يعيشون في مختلف قارات الأرض بحاجة لتقنيات تمكين سمعية فورية
              </p>

              {/* World Tag */}
              <div className={`mt-3 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                activeCard === 'world'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
              }`}>
                <span>🌍 إحصائية منظمة الصحة العالمية (WHO)</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. بطاقة الوطن العربي: أعلام الدول العربية تظهر عند التأشير + تموج أزرق ملكي */}
          {/* ========================================================================= */}
          <div
            onMouseEnter={() => handleHover('arab')}
            onClick={() => handleHover('arab')}
            className={`lift-3d p-7 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer text-center relative overflow-hidden group ${
              activeCard === 'arab'
                ? 'bg-gradient-to-b from-[#091528] via-[#1E3A8A] to-[#1E40AF] text-white border-blue-400 shadow-[0_20px_50px_-10px_rgba(30,58,138,0.7)] scale-[1.03]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-blue-500/50 hover:shadow-[0_15px_35px_-10px_rgba(30,58,138,0.4)]'
            }`}
          >
            {/* Ambient Arab Blue Ripple Wave Effect in Background */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                activeCard === 'arab' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute -top-12 -left-12 w-52 h-52 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Arab League Icon with flags ring */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 flex items-center justify-center">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-all duration-300 ${
                    activeCard === 'arab'
                      ? 'bg-white/15 text-white scale-110 border border-white/20'
                      : 'bg-blue-600/15 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  🌐
                </div>
              </div>

              {/* Number */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-thmanyah tabular-nums tracking-tight">
                3,709,028
              </div>

              <h4 className="text-base sm:text-lg font-black font-thmanyah mt-2">
                أصم في الوطن العربي
              </h4>

              <p className={`text-xs mt-1 transition-colors ${
                activeCard === 'arab' ? 'text-blue-100' : 'text-[var(--text-secondary)]'
              }`}>
                يتشاركون قاموس لغة الإشارة العربية الموحدة في 22 دولة
              </p>

              {/* Arab Flags Showcase (تطلع عند التأشير كما طلب المستخدم تماماً) */}
              <div className="mt-3 w-full">
                <span className={`block text-[10px] font-bold mb-1.5 transition-colors ${
                  activeCard === 'arab' ? 'text-blue-200' : 'text-slate-400'
                }`}>
                  {activeCard === 'arab' ? 'أعلام الدول العربية الشقيقة:' : 'مرر لرؤية أعلام الدول العربية'}
                </span>

                <div className="flex flex-wrap items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl bg-black/20 border border-white/10">
                  {arabFlags.map((c) => (
                    <span
                      key={c.code}
                      className="text-base sm:text-lg hover:scale-130 transition-transform cursor-pointer"
                      title={c.name}
                    >
                      {c.flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. بطاقة السعودية (239 ألف): خلفية خضراء + علم السعودية وشعار السيفين والنخلة */}
          {/* ========================================================================= */}
          <div
            onMouseEnter={() => handleHover('saudi')}
            onClick={() => handleHover('saudi')}
            className={`lift-3d p-7 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer text-center relative overflow-hidden group ${
              activeCard === 'saudi'
                ? 'bg-gradient-to-b from-[#004B23] via-[#006C35] to-[#01411C] text-white border-emerald-400 shadow-[0_20px_50px_-10px_rgba(0,108,53,0.75)] scale-[1.03]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-emerald-500/50 hover:shadow-[0_15px_35px_-10px_rgba(0,108,53,0.4)]'
            }`}
          >
            {/* Ambient Saudi Green Ripple Wave in Background */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                activeCard === 'saudi' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-emerald-400/25 blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-emerald-600/25 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Saudi Flag & Emblem Badge (عناصر علم وشعار المملكة العربية السعودية) */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 flex items-center justify-center">
                {/* Waving Saudi Flag Container */}
                <div
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all duration-300 border ${
                    activeCard === 'saudi'
                      ? 'bg-white/15 text-white scale-110 border-emerald-300/40'
                      : 'bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl drop-shadow">🇸🇦</span>
                  <span className="text-[10px] font-black font-thmanyah mt-0.5 text-emerald-200">
                    رؤية 2030
                  </span>
                </div>
              </div>

              {/* Number: 239,541 (نحو 239 ألف أصم في السعودية) */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-thmanyah tabular-nums tracking-tight">
                239,541
              </div>

              <h4 className="text-base sm:text-lg font-black font-thmanyah mt-2 flex items-center justify-center gap-1.5">
                <span>أصم في السعودية</span>
                <span>🇸🇦</span>
              </h4>

              <p className={`text-xs mt-1 transition-colors ${
                activeCard === 'saudi' ? 'text-emerald-100' : 'text-[var(--text-secondary)]'
              }`}>
                نحو 239 ألف مواطن ومواطنة مشمولين بمستهدفات التمكين الشامل
              </p>

              {/* Saudi Emblem: السيفين والنخلة */}
              <div className={`mt-3 px-3 py-1.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold font-thmanyah transition-all ${
                activeCard === 'saudi'
                  ? 'bg-black/25 text-emerald-100 border-emerald-400/40'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}>
                <span className="text-sm">🌴⚔️</span>
                <span>المملكة العربية السعودية · وصول شامل</span>
              </div>
            </div>
          </div>

        </div>

        {/* Brief Challenge Highlights with 3D lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="lift-3d p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <HeartPulse className="w-6 h-6 text-rose-500 mb-2" />
            <h4 className="text-sm font-bold font-thmanyah">الفجوة الصحية والخصوصية</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              حفظ خصوصية المريض الأصم في العيادات الطبية دون الحاجة لمترجم بشري.
            </p>
          </div>

          <div className="lift-3d p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <Brain className="w-6 h-6 text-amber-500 mb-2" />
            <h4 className="text-sm font-bold font-thmanyah">الدمج وتكافؤ الفرص</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              كسر العزلة المجتمعية وتسهيل التعامل في الجامعات والمؤسسات الحكومية.
            </p>
          </div>

          <div className="lift-3d p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <DollarSign className="w-6 h-6 text-emerald-500 mb-2" />
            <h4 className="text-sm font-bold font-thmanyah">الحد من الخسائر العالمية</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              تقليل عبء 980 مليار دولار سنوياً على الاقتصاد العالمي بتوفير أدوات تمكين فورية.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
