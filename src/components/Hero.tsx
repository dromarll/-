import { useState } from 'react';
import { ArrowRight, Sparkles, Monitor, Tablet, Smartphone, ShieldCheck, Zap, Activity, Layers, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onStartProject: () => void;
  onExploreWork: () => void;
}

export function Hero({ onStartProject, onExploreWork }: HeroProps) {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'tokens' | 'perf'>('preview');
  const [activeColorTheme, setActiveColorTheme] = useState<'cyan' | 'emerald' | 'amber'>('cyan');

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-[380px] h-[380px] bg-blue-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-5 w-[420px] h-[300px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Subtle background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Subtle announcement pill / status */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-medium tracking-wide">Accepting Q2/Q3 Design & Engineering Retainers</span>
            <span className="text-cyan-500/60">·</span>
            <span className="text-slate-400">London & San Francisco</span>
          </div>

          {/* Catchy headline with balance wrap */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] font-display text-balance">
            Engineering High-Impact{' '}
            <span className="bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#10B981] bg-clip-text text-transparent">
              Digital Experiences
            </span>{' '}
            for Visionary Brands.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-normal text-balance">
            We partner with hyper-growth startups and market leaders to design bespoke web applications, 
            high-converting storefronts, and elevated brand identities that command attention and drive revenue.
          </p>

          {/* Dual CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onStartProject();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold tracking-wide text-slate-950 bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00F2FE] rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                onExploreWork();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-white/[0.1] hover:border-cyan-500/40 rounded-xl backdrop-blur-md transition-all duration-200"
            >
              <span>Explore Featured Work</span>
            </a>
          </div>

          {/* Social Proof Line */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Sub-400ms Guaranteed Load Times</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>100% Custom Headless Engineering</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>WCAG AA Accessibility Standard</span>
            </div>
          </div>
        </div>

        {/* Abstract Tech Graphic / Interactive Mockup Preview */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          {/* Glowing container border */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-blue-500/30 rounded-2xl blur-xl opacity-60"></div>

          {/* Main Mockup Frame */}
          <div className="relative rounded-2xl border border-white/[0.12] bg-[#0E1424]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
            {/* Mockup Window Header */}
            <div className="px-4 py-3 border-b border-white/[0.08] bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/70 border border-rose-400/40" />
                <span className="w-3 h-3 rounded-full bg-amber-500/70 border border-amber-400/40" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/70 border border-emerald-400/40" />
                <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">preview.nexadigital.design</span>
              </div>

              {/* Responsive Device Viewport Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    deviceView === 'desktop' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('tablet')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    deviceView === 'tablet' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    deviceView === 'mobile' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interactive Tab Switcher */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    activeTab === 'preview' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  UI Canvas
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('perf')}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors hidden sm:block ${
                    activeTab === 'perf' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lighthouse 100
                </button>
              </div>
            </div>

            {/* Mockup Canvas Body */}
            <div className="p-4 sm:p-6 md:p-8 transition-all duration-300 flex justify-center bg-gradient-to-b from-[#0E1424] to-[#0A0D17]">
              <div
                className={`transition-all duration-300 w-full ${
                  deviceView === 'desktop'
                    ? 'max-w-4xl'
                    : deviceView === 'tablet'
                    ? 'max-w-xl'
                    : 'max-w-sm'
                }`}
              >
                {activeTab === 'preview' ? (
                  <div className="space-y-4">
                    {/* Simulated High-End Client Interface Top Bar */}
                    <div className="rounded-xl border border-white/[0.08] bg-slate-900/60 p-4 backdrop-blur-md flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md shadow-cyan-500/30">
                          A
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Aether Institutional Asset Portal</p>
                          <p className="text-[11px] text-slate-400">Live Client Workspace · v3.4</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ONLINE
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Simulated Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {/* Metric Card 1 */}
                      <div className="rounded-xl border border-white/[0.07] bg-slate-900/40 p-4 hover:border-cyan-500/40 transition-colors group">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span>Portfolio Yield</span>
                          <span className="text-emerald-400 font-mono text-[11px]">+32.4%</span>
                        </div>
                        <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
                          $14,892,400
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 w-4/5 rounded-full"></div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">Zero slippage execution</p>
                      </div>

                      {/* Metric Card 2 */}
                      <div className="rounded-xl border border-white/[0.07] bg-slate-900/40 p-4 hover:border-cyan-500/40 transition-colors">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span>Edge Latency</span>
                          <span className="text-cyan-400 font-mono text-[11px]">OPTIMIZED</span>
                        </div>
                        <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums flex items-baseline gap-1">
                          18 <span className="text-xs font-normal text-slate-400">ms</span>
                        </div>
                        <div className="mt-3 flex items-center gap-1">
                          {[40, 60, 30, 80, 45, 90, 75, 100].map((val, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-cyan-500/30 rounded-t"
                              style={{ height: `${val * 0.16}px` }}
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">Distributed globally</p>
                      </div>

                      {/* Metric Card 3 */}
                      <div className="rounded-xl border border-white/[0.07] bg-slate-900/40 p-4 hover:border-cyan-500/40 transition-colors">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span>Client Retention</span>
                          <span className="text-teal-400 font-mono text-[11px]">TOP 1%</span>
                        </div>
                        <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
                          99.4%
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 w-[99%] rounded-full"></div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">NPS score 94 / 100</p>
                      </div>
                    </div>

                    {/* Interactive Showcase Banner */}
                    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900/50 to-teal-950/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Full-Stack Architecture Demonstration</p>
                          <p className="text-[11px] text-slate-400">Next.js 15, Tailwind CSS, TypeScript, and Edge API Middleware</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30">
                          100% Reactive
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Lighthouse / Performance Inspection Tab */
                  <div className="rounded-xl border border-white/[0.08] bg-slate-900/60 p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-sm font-semibold text-white">Lighthouse Performance Audit</h4>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                        PERFECT 100 SCORE
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.04]">
                        <div className="text-2xl font-bold font-mono text-emerald-400">100</div>
                        <div className="text-[11px] text-slate-400 mt-1">Performance</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.04]">
                        <div className="text-2xl font-bold font-mono text-emerald-400">100</div>
                        <div className="text-[11px] text-slate-400 mt-1">Accessibility</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.04]">
                        <div className="text-2xl font-bold font-mono text-emerald-400">100</div>
                        <div className="text-[11px] text-slate-400 mt-1">Best Practices</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.04]">
                        <div className="text-2xl font-bold font-mono text-emerald-400">100</div>
                        <div className="text-[11px] text-slate-400 mt-1">SEO Structure</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1.5 pt-2">
                      <div className="flex justify-between">
                        <span>First Contentful Paint (FCP):</span>
                        <span className="font-mono text-emerald-400">0.24s (Sub-300ms)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Largest Contentful Paint (LCP):</span>
                        <span className="font-mono text-emerald-400">0.68s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cumulative Layout Shift (CLS):</span>
                        <span className="font-mono text-emerald-400">0.000</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
