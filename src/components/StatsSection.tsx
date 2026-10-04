import { useState } from 'react';
import { Quote, Star, Award, Users, CheckCircle, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { TESTIMONIALS } from '../data/agencyData';

export function StatsSection() {
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const stats = [
    {
      value: '140+',
      label: 'Digital Experiences Shipped',
      detail: 'Across 12 countries globally',
      accent: 'from-cyan-400 to-teal-400',
    },
    {
      value: '99.4%',
      label: 'Client Retention & Satisfaction',
      detail: 'Measured across multi-year retainers',
      accent: 'from-teal-400 to-emerald-400',
    },
    {
      value: '$420M+',
      label: 'Client Market Valuation Created',
      detail: 'Direct enterprise revenue impact',
      accent: 'from-sky-400 to-cyan-400',
    },
    {
      value: '8+ Years',
      label: 'Of Specialized Engineering Craft',
      detail: 'Zero agency bloat, senior talent only',
      accent: 'from-emerald-400 to-teal-400',
    },
  ];

  const clientLogos = [
    'AETHER WEALTH',
    'KROMA LIVING',
    'VORTEX AI',
    'SOLSTICE HEALTH',
    'ARCADIA',
    'PULSE ATHLETICA'
  ];

  const currentTestimonial = TESTIMONIALS[activeTestimonialIdx];

  const nextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="proof" className="py-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[350px] bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Quantitative Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-7 rounded-2xl border border-white/[0.08] bg-[#0E1524]/60 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-200 group"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono tracking-tight text-white tabular-nums mb-2">
                <span className={`bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}>
                  {stat.value}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 font-display">
                {stat.label}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Client Brands Bar */}
        <div className="mt-16 py-8 border-y border-white/[0.07]">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            Trusted by Leaders at Fast-Growing Startups & Established Enterprises
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
            {clientLogos.map((logo, i) => (
              <span
                key={i}
                className="font-display font-extrabold tracking-wider text-sm sm:text-base text-slate-400 hover:text-cyan-300 transition-colors cursor-default"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials Showcase */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-white/[0.1] bg-[#0E1526]/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Top quote icon */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  <Quote className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Verified Client Partner
                </span>
              </div>

              {/* Verified Result Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{currentTestimonial.metric}</span>
              </div>
            </div>

            {/* Quote body */}
            <p className="text-lg sm:text-2xl font-medium text-slate-100 leading-relaxed font-display text-balance">
              "{currentTestimonial.quote}"
            </p>

            {/* Testimonial Author & Controls */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/30">
                  {currentTestimonial.avatarText}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {currentTestimonial.role}, <span className="text-cyan-300">{currentTestimonial.company}</span>
                  </p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevTestimonial}
                  className="p-2 rounded-lg bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400 px-1">
                  {activeTestimonialIdx + 1} / {TESTIMONIALS.length}
                </span>
                <button
                  type="button"
                  onClick={nextTestimonial}
                  className="p-2 rounded-lg bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
