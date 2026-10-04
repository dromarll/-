import { useState } from 'react';
import { Calculator, Check, ArrowRight, Sparkles, Clock, ShieldCheck, DollarSign } from 'lucide-react';

interface ProjectEstimatorProps {
  onApplyEstimate: (data: {
    projectType: string;
    timeline: string;
    estimatedCost: string;
    features: string[];
  }) => void;
}

export function ProjectEstimator({ onApplyEstimate }: ProjectEstimatorProps) {
  const [projectType, setProjectType] = useState<'marketing' | 'webapp' | 'ecommerce' | 'design-system'>('webapp');
  const [scale, setScale] = useState<'compact' | 'standard' | 'enterprise'>('standard');
  const [timeline, setTimeline] = useState<'standard' | 'rush'>('standard');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'Design System Tokens',
    'WCAG AA Accessibility'
  ]);

  const projectTypes = [
    {
      id: 'marketing',
      label: 'Brand & Marketing Site',
      basePrice: 4500,
      baseWeeks: 3,
      desc: 'High-converting agency/corporate landing site with bespoke motion and CMS.'
    },
    {
      id: 'webapp',
      label: 'Custom Web Application',
      basePrice: 8500,
      baseWeeks: 5,
      desc: 'Full-stack application with authentication, interactive dashboards & APIs.'
    },
    {
      id: 'ecommerce',
      label: 'Headless E-Commerce',
      basePrice: 9500,
      baseWeeks: 6,
      desc: 'Shopify Plus or headless store engineered for sub-second conversions.'
    },
    {
      id: 'design-system',
      label: 'Enterprise Design System',
      basePrice: 6000,
      baseWeeks: 4,
      desc: 'Comprehensive multi-platform tokenized design system & component library.'
    }
  ];

  const addonsList = [
    { id: 'Design System Tokens', label: 'Design System & Tokens Library', price: 1500 },
    { id: 'WCAG AA Accessibility', label: 'WCAG AA Accessibility Guarantee', price: 1200 },
    { id: 'Advanced 3D WebGL', label: 'Interactive 3D / WebGL Canvas Elements', price: 2800 },
    { id: 'Headless CMS', label: 'Headless CMS Integration (Sanity / Strapi)', price: 1800 },
    { id: 'Speed SEO Audit', label: 'Lighthouse 98+ Speed & Technical SEO Engine', price: 1400 },
  ];

  const currentType = projectTypes.find((t) => t.id === projectType)!;

  // Scale multiplier
  const scaleMultiplier = scale === 'compact' ? 0.75 : scale === 'standard' ? 1.0 : 1.5;
  const scaleWeeks = scale === 'compact' ? -1 : scale === 'standard' ? 0 : 2;

  // Addons total
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const found = addonsList.find((a) => a.id === addonId);
    return sum + (found ? found.price : 0);
  }, 0);

  // Timeline rush multiplier
  const rushMultiplier = timeline === 'rush' ? 1.25 : 1.0;
  const estimatedWeeks = Math.max(
    2,
    Math.round((currentType.baseWeeks + scaleWeeks) * (timeline === 'rush' ? 0.65 : 1.0))
  );

  const calculatedBase = (currentType.basePrice * scaleMultiplier + addonsTotal) * rushMultiplier;
  const minCost = Math.round(calculatedBase * 0.9 / 500) * 500;
  const maxCost = Math.round(calculatedBase * 1.15 / 500) * 500;

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handleApply = () => {
    onApplyEstimate({
      projectType: currentType.label,
      timeline: `${estimatedWeeks} Weeks (${timeline === 'rush' ? 'Expedited Delivery' : 'Standard Delivery'})`,
      estimatedCost: `$${minCost.toLocaleString()} - $${maxCost.toLocaleString()}`,
      features: selectedAddons
    });
  };

  return (
    <section id="estimator" className="py-24 relative overflow-hidden bg-[#0A0E18]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-cyan-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Project Scope Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display text-balance">
            Estimate Your Investment & Delivery Timeline in Real Time.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed text-balance">
            Transparent pricing based on actual engineering hours, design complexity, and scope requirements. No hidden retainer fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8 rounded-3xl border border-white/[0.08] bg-[#0E1524]/70 p-6 sm:p-8 backdrop-blur-xl">
            {/* Step 1: Project Type */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-3">
                1. Select Architecture & Project Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setProjectType(type.id as any)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      projectType === type.id
                        ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-md shadow-cyan-500/15'
                        : 'border-white/[0.07] bg-slate-900/60 text-slate-300 hover:border-white/[0.15] hover:text-white'
                    }`}
                  >
                    <div className="text-sm font-bold flex items-center justify-between">
                      <span>{type.label}</span>
                      {projectType === type.id && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {type.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Scale & Surface Complexity */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-3">
                2. Surface Scope & Scale
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'compact', label: 'Focused MVP', sub: '1–4 Unique Screens' },
                  { id: 'standard', label: 'Standard Scale', sub: '5–12 Key Views' },
                  { id: 'enterprise', label: 'Enterprise Platform', sub: '15+ Views & Flows' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScale(s.id as any)}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      scale === s.id
                        ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-sm'
                        : 'border-white/[0.07] bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold">{s.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Add-on Capabilities */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-3">
                3. Technical Add-Ons & Enhancements
              </label>
              <div className="space-y-2">
                {addonsList.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-colors ${
                        isChecked
                          ? 'border-teal-500/40 bg-teal-950/30 text-white'
                          : 'border-white/[0.06] bg-slate-900/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-teal-400 border-teal-400 text-slate-950'
                              : 'border-slate-600 bg-slate-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{addon.label}</span>
                      </div>
                      <span className="font-mono text-slate-400 tabular-nums">
                        +${addon.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Speed / Turnaround */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-3">
                4. Production Velocity
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTimeline('standard')}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    timeline === 'standard'
                      ? 'border-cyan-400 bg-cyan-950/40 text-white'
                      : 'border-white/[0.07] bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-semibold">Standard Cadence</p>
                  <p className="text-[11px] text-slate-400">Natural sprint delivery</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTimeline('rush')}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    timeline === 'rush'
                      ? 'border-cyan-400 bg-cyan-950/40 text-white'
                      : 'border-white/[0.07] bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-semibold flex items-center gap-1">
                    <span>Expedited Sprint</span>
                    <span className="text-[10px] text-cyan-400 font-mono">+25%</span>
                  </p>
                  <p className="text-[11px] text-slate-400">Dedicated overtime engineering</p>
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Estimate Summary Card */}
          <div className="lg:col-span-5 sticky top-28 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] p-7 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-950/50">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Scope Summary
              </span>
              <span className="text-xs text-slate-400">
                Guaranteed Fixed-Price
              </span>
            </div>

            {/* Calculated Price */}
            <div className="mt-6">
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                Estimated Investment Range
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  ${minCost.toLocaleString()}
                </span>
                <span className="text-slate-500 text-2xl font-light mx-2">–</span>
                <span className="text-white">
                  ${maxCost.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Inclusive of design, engineering, staging, and 30-day hypercare support.
              </p>
            </div>

            {/* Turnaround Time */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Estimated Turnaround</p>
                  <p className="text-[11px] text-slate-400">Based on sprint velocity</p>
                </div>
              </div>
              <span className="text-base font-bold font-mono text-cyan-300 tabular-nums">
                {estimatedWeeks} Weeks
              </span>
            </div>

            {/* Breakdown Highlights */}
            <div className="mt-6 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span>Architecture: {currentType.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span>Scope: {scale === 'compact' ? 'MVP Launch' : scale === 'standard' ? 'Full Scale' : 'Enterprise'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span>{selectedAddons.length} Additional Feature Packages</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Strict IP Ownership & Code Guarantee</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <a
                href="#contact"
                onClick={handleApply}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200"
              >
                <span>Apply to Project Brief</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="mt-2.5 text-center text-[11px] text-slate-500">
                Locks in your configuration and pre-fills the contact form below.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
