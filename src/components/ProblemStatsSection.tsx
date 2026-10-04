import { Users, AlertCircle, HeartPulse, DollarSign, Brain, Shield, Award, ExternalLink } from 'lucide-react';
import { NATIONAL_STATISTICS, CORE_PILLARS } from '../data/mueenData';

interface ProblemStatsSectionProps {
  isDark: boolean;
}

export function ProblemStatsSection({ isDark }: ProblemStatsSectionProps) {
  const challenges = [
    {
      title: 'الفجوة الصحية والخصوصية الطبية',
      icon: <HeartPulse className="w-6 h-6 text-rose-500" />,
      desc: 'تسبب حواجز التواصل في العيادات الطبية أخطاءً غير مقصودة في التشخيص، وتؤدي إلى انتهاك خصوصية المريض بضرورة الاستعانة بمترجم بشري مستمر، فضلاً عن غياب آليات الإنذار السريع عند الحالات الحرجة.',
      stat: 'أخطاء تشخيصية وغياب الخصوصية'
    },
    {
      title: 'الضغوط النفسية والاجتماعية',
      icon: <Brain className="w-6 h-6 text-amber-500" />,
      desc: 'تؤكد الدراسات العلمية أن العوائق النفسية ونظرة المجتمع النمطية التي تقلل من كفاءة الصم تترك آثاراً سلبية بالغة على أدائهم لا تقل ضرراً عن الإعاقة ذاتها، مما يرفع مستويات القلق ويحد من فرص دمجهم الفاعل.',
      stat: 'عزلة مجتمعية ومحدودية فرص'
    },
    {
      title: 'الخسائر الاقتصادية والعالمية',
      icon: <DollarSign className="w-6 h-6 text-emerald-500" />,
      desc: 'تشير تقديرات منظمة الصحة العالمية إلى أن تكلفة نقص الرعاية السمعية على الاقتصاد العالمي تبلغ 980 مليار دولار سنوياً نتيجة انخفاض الإنتاجية والتكاليف الاجتماعية، مع توقع وصول المحتاجين لـ 700 مليون شخص بحلول 2050.',
      stat: '980 مليار دولار سنوياً'
    }
  ];

  return (
    <section id="problem" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            أبعاد القضية والأثر الوطني
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-thmanyah text-balance">
            لماذا وُجد برنامج مُعِين؟ التحديات الجوهرية والحل المُمكّن.
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            يواجه آلاف المواطنين والمواطنات من الصم وضعاف السمع في المملكة العربية السعودية تحديات جسيمة في التواصل مع محيطهم، مما يفرض حلولاً تقنية وطنية مستدامة تتماشى مع رؤية السعودية 2030.
          </p>
        </div>

        {/* Quantified Population Statistics (As in Presentation Page 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {/* Saudi Deaf */}
          <div className={`p-6 sm:p-8 rounded-3xl border text-center transition-all ${
            isDark ? 'bg-[#0E1713] border-emerald-500/30' : 'bg-white border-[#E0D8C8]'
          }`}>
            <div className="text-4xl sm:text-5xl font-extrabold font-thmanyah text-emerald-600 dark:text-emerald-400 tabular-nums">
              {NATIONAL_STATISTICS.saudiDeaf}
            </div>
            <p className="mt-2 text-base font-bold font-thmanyah">
              {NATIONAL_STATISTICS.saudiDeafLabel}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              في مختلف مناطق المملكة العربية السعودية
            </p>
          </div>

          {/* Arab Deaf */}
          <div className={`p-6 sm:p-8 rounded-3xl border text-center transition-all ${
            isDark ? 'bg-[#0E1713] border-emerald-500/30' : 'bg-white border-[#E0D8C8]'
          }`}>
            <div className="text-4xl sm:text-5xl font-extrabold font-thmanyah text-cyan-500 dark:text-cyan-400 tabular-nums">
              {NATIONAL_STATISTICS.arabDeaf}
            </div>
            <p className="mt-2 text-base font-bold font-thmanyah">
              {NATIONAL_STATISTICS.arabDeafLabel}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              يتحدثون لغة الإشارة العربية الموحدة
            </p>
          </div>

          {/* Global Deaf */}
          <div className={`p-6 sm:p-8 rounded-3xl border text-center transition-all ${
            isDark ? 'bg-[#0E1713] border-emerald-500/30' : 'bg-white border-[#E0D8C8]'
          }`}>
            <div className="text-4xl sm:text-5xl font-extrabold font-thmanyah text-emerald-700 dark:text-emerald-300 tabular-nums">
              {NATIONAL_STATISTICS.globalDeaf}
            </div>
            <p className="mt-2 text-base font-bold font-thmanyah">
              {NATIONAL_STATISTICS.globalDeafLabel}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              وفق إحصائيات منظمة الصحة العالمية (WHO)
            </p>
          </div>
        </div>

        {/* 3 Core Challenges Cards (Slide 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {challenges.map((c, idx) => (
            <div
              key={idx}
              className={`p-7 rounded-3xl border flex flex-col justify-between transition-all ${
                isDark ? 'bg-[#0E1713]/80 border-emerald-500/20' : 'bg-white border-[#E0D8C8]'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900/10 dark:bg-slate-900 flex items-center justify-center mb-5">
                  {c.icon}
                </div>
                <h3 className="text-xl font-bold font-thmanyah mb-3">
                  {c.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {c.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-inherit flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 font-thmanyah">
                <span>الأثر المعالج بواسطة مُعِين</span>
                <span>{c.stat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Vision 2030 Core Pillars (Slide 3) */}
        <div className={`p-8 sm:p-12 rounded-3xl border ${
          isDark ? 'bg-[#0F1B15] border-emerald-500/30' : 'bg-[#F4EFE6] border-[#DED6C4]'
        }`}>
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold font-thmanyah text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              مستهدفات رؤية المملكة 2030
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-thmanyah mt-3">
              مبادرة مُعِين: الصوت والأذن المُمكّنة للصم
            </h3>
            <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              تأتي مبادرة "مُعِين" كتطبيق ذكي متكامل مصمم لرفع جودة حياة ذوي الإعاقة وكشف طاقاتهم الكامنة ودعم الاندماج الشامل في بيئات العمل والتعليم والصحة.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CORE_PILLARS.map((pillar, i) => (
              <div
                key={i}
                className={`p-5 rounded-2xl border text-right transition-colors ${
                  isDark ? 'bg-slate-950/60 border-white/[0.08]' : 'bg-white border-[#E0D8C8]'
                }`}
              >
                <span className="text-xs font-bold text-emerald-500 block mb-1">
                  0{i + 1}. {pillar.tag}
                </span>
                <h4 className="text-base font-bold font-thmanyah mb-2">{pillar.title}</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {pillar.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* References & Scientific Documentation (Slide 4) */}
          <div className="mt-8 pt-6 border-t border-inherit flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>توثيق علمي معتمد: National Center for Biotechnology Information (NCBI) · WHO · وزارة الصحة السعودية</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">#معين_لتمكين_الصم</span>
          </div>
        </div>
      </div>
    </section>
  );
}
