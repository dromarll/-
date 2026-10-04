import { Search, Compass, Terminal, Rocket, CheckCircle2 } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Commercial Discovery & Strategy',
      duration: 'Week 1',
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      description: 'We audit your customer acquisition funnels, competitor interfaces, and performance bottlenecks to define high-impact architectural requirements.',
      deliverables: ['Conversion Architecture Spec', 'Information Hierarchy', 'Competitive UX Benchmark']
    },
    {
      num: '02',
      title: 'High-Fidelity Prototyping & Design Systems',
      duration: 'Weeks 2–3',
      icon: <Compass className="w-5 h-5 text-teal-400" />,
      description: 'We craft comprehensive Figma design systems, tactile micro-interactions, and responsive viewports with zero ambiguity for engineering.',
      deliverables: ['Figma Tokenized Library', 'Clickable Prototype', 'Responsive Viewport Matrix']
    },
    {
      num: '03',
      title: 'Modern Full-Stack Engineering',
      duration: 'Weeks 4–5',
      icon: <Terminal className="w-5 h-5 text-sky-400" />,
      description: 'We write clean, strictly-typed TypeScript components using modern React frameworks. Every screen is optimized for sub-second interactions and high availability.',
      deliverables: ['Clean Git Repository', 'Headless CMS Setup', 'Edge API Middleware']
    },
    {
      num: '04',
      title: 'Performance Hardening & Launch Hypercare',
      duration: 'Week 6+',
      icon: <Rocket className="w-5 h-5 text-emerald-400" />,
      description: 'Rigorous cross-browser QA, Lighthouse 100 validation, WCAG AA compliance checks, and a 30-day post-launch hypercare monitoring window.',
      deliverables: ['Lighthouse 100 Audit', 'WCAG AA Compliance', '30-Day Hypercare Warranty']
    }
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-[#0A0D17]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Our Delivery Blueprint
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display text-balance">
            Disciplined Execution. Transparent Velocity.
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed text-balance">
            We operate with the agility of an elite internal product team. No bureaucratic layers or radio silence—just weekly testable builds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative rounded-2xl border border-white/[0.08] bg-[#0E1524]/60 p-6 sm:p-7 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.08] group-hover:border-cyan-500/40 transition-colors">
                    {step.icon}
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                    {step.num}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-cyan-400 mb-1">
                  {step.duration}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-1.5">
                {step.deliverables.map((deliv, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
