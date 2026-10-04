import { useState } from 'react';
import { Layout, Code2, Sparkles, ShoppingBag, ArrowRight, Check, ChevronDown, ChevronUp, Layers, Cpu, Palette, Store } from 'lucide-react';
import { AGENCY_SERVICES, Service } from '../data/agencyData';

interface ServicesGridProps {
  onSelectServiceForEstimate?: (serviceName: string) => void;
}

export function ServicesGrid({ onSelectServiceForEstimate }: ServicesGridProps) {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-6 h-6 text-cyan-400" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-teal-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-sky-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6 text-emerald-400" />;
      default:
        return <Layers className="w-6 h-6 text-cyan-400" />;
    }
  };

  const getNumberPrefix = (index: number) => {
    return `0${index + 1}.`;
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <span>Capabilities & Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display text-balance">
            Comprehensive Digital Craftsmanship from Concept to Scaled Production.
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed text-balance">
            We don't do templated solutions. Every interface, system architecture, and line of code is meticulously tailored to solve commercial bottlenecks and outpace your competitors.
          </p>
        </div>

        {/* Services Grid (4 Core Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {AGENCY_SERVICES.map((service, index) => {
            const isExpanded = expandedService === service.id;

            return (
              <div
                key={service.id}
                className="group relative rounded-2xl p-[1px] transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,242,254,0.15)]"
              >
                {/* Gradient border wrapper */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-teal-500/10 to-transparent opacity-60 group-hover:opacity-100 group-hover:from-cyan-400/60 group-hover:via-teal-400/30 transition-all duration-300" />

                {/* Card Interior */}
                <div className="relative rounded-2xl bg-[#0F1626]/90 p-7 sm:p-8 backdrop-blur-xl h-full flex flex-col justify-between">
                  <div>
                    {/* Top Row: Editorial Index & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.08] group-hover:border-cyan-500/40 group-hover:scale-105 transition-all duration-200">
                          {getServiceIcon(service.icon)}
                        </div>
                        <span className="font-mono text-xs text-slate-500 tracking-wider">
                          {getNumberPrefix(index)}
                        </span>
                      </div>

                      {/* Delivery Window text */}
                      <span className="text-xs font-mono text-slate-400">
                        {service.timeline}
                      </span>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {service.title}
                    </h3>

                    {/* Tagline */}
                    <p className="mt-1.5 text-sm font-medium text-cyan-400/90">
                      {service.tagline}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Key Deliverables List */}
                    <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-2.5">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Core Deliverables
                      </p>
                      <ul className="space-y-2">
                        {service.deliverables.slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Expanded deliverables if toggled */}
                      {isExpanded && (
                        <div className="pt-2 space-y-2 animate-fadeIn">
                          {service.deliverables.slice(3).map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                              <Check className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}

                          <div className="pt-3">
                            <span className="text-[11px] font-mono text-slate-400">Toolkit: </span>
                            <span className="text-xs text-slate-300">
                              {service.tools.join(' · ')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Controls */}
                  <div className="mt-7 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setExpandedService(isExpanded ? null : service.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>{isExpanded ? 'Less Details' : 'Full Scope & Tools'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href="#estimator"
                      onClick={() => onSelectServiceForEstimate?.(service.title)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-0.5 duration-200"
                    >
                      <span>Scope Estimate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
