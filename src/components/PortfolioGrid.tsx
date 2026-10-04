import { useState } from 'react';
import { ArrowUpRight, ExternalLink, X, TrendingUp, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { AGENCY_PROJECTS, Project } from '../data/agencyData';

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web-apps', label: 'Web Applications' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'saas-ai', label: 'SaaS & AI' },
    { id: 'brand', label: 'Brand Systems' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? AGENCY_PROJECTS
    : AGENCY_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 relative overflow-hidden bg-[#0A0E17]/60">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with interactive filter bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              Selected Case Studies
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display text-balance">
              Engineered for Velocity. Designed for Distinction.
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed text-balance">
              Explore how we translate high-friction business operations into intuitive, conversion-optimized digital touchpoints.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 border border-white/[0.08] rounded-xl backdrop-blur-md self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-semibold shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-[#0E1524]/70 hover:border-cyan-500/40 hover:bg-[#121B2F]/90 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between"
            >
              {/* Project Preview Banner / Visual Stage */}
              <div className="relative h-56 sm:h-64 w-full bg-gradient-to-br from-slate-900 via-slate-950 to-[#0A0D17] border-b border-white/[0.06] overflow-hidden p-6 flex flex-col justify-between">
                {/* Visual Ambient Glow */}
                <div 
                  className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 60% 40%, ${project.accent}33, transparent 70%)`
                  }}
                />

                {/* Top Bar of Project Mockup */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-cyan-400 transition-colors" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {project.client}
                  </span>
                </div>

                {/* Abstract UI Representation inside card */}
                <div className="relative z-10 my-auto py-2 transform group-hover:scale-[1.03] transition-transform duration-300">
                  {project.category === 'web-apps' ? (
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-white/[0.08] shadow-lg space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Real-Time Yield Index</span>
                        <span className="text-cyan-400 font-mono">+184% Growth</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-8">
                        {[25, 45, 30, 60, 55, 80, 95, 100].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-cyan-500/40 to-cyan-400 rounded-t"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : project.category === 'ecommerce' ? (
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-white/[0.08] shadow-lg space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Shopify Plus Custom Engine</span>
                        <span className="text-teal-400 font-mono">0.32s Checkout</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-9 rounded bg-slate-800/80 border border-white/[0.05] flex items-center justify-center text-[10px] text-slate-300">
                          Catalog
                        </div>
                        <div className="h-9 rounded bg-slate-800/80 border border-white/[0.05] flex items-center justify-center text-[10px] text-slate-300">
                          3D Room
                        </div>
                        <div className="h-9 rounded bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-300 font-semibold">
                          Buy Now
                        </div>
                      </div>
                    </div>
                  ) : project.category === 'saas-ai' ? (
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-white/[0.08] shadow-lg space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Neural Graph Telemetry</span>
                        <span className="text-cyan-300 font-mono">99.98% Latency</span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800">Embeddings</span>
                        <span>→</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800">Weights</span>
                        <span>→</span>
                        <span className="px-1.5 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/40">Inference</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-slate-900/90 border border-white/[0.08] text-center shadow-lg">
                      <p className="font-display text-lg tracking-widest text-white uppercase font-bold">
                        {project.title}
                      </p>
                      <p className="text-[11px] text-cyan-400 tracking-wider uppercase mt-1">
                        Architecture & Identity Monograph
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Overlay Label */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{project.metrics}</span>
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-cyan-400 group-hover:text-slate-950 flex items-center justify-center text-slate-300 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Project Metadata & Description */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed tags with dot separators - Zero Pill Discipline */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
                    <span>{project.tags[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.tags[1]}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{project.year}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-slate-400">View In-Depth Case Study</span>
                  <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Read Story →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F1626] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-2">
                  <span>{selectedProject.client}</span>
                  <span>·</span>
                  <span>{selectedProject.type}</span>
                  <span>·</span>
                  <span>{selectedProject.year}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  {selectedProject.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  {selectedProject.summary}
                </p>
              </div>

              {/* Verified Result Metric Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-teal-950/60 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Verified Client Outcome</p>
                  <p className="text-xl font-bold text-cyan-300 font-mono mt-0.5">
                    {selectedProject.metrics}
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-teal-400" />
              </div>

              {/* Challenge & Solution */}
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1 text-rose-300">
                    The Commercial Challenge
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedProject.challenge}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1 text-teal-300">
                    The Nexa Engineering & Design Solution
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              {/* Deliverables List */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Key Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {selectedProject.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal CTA */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs text-slate-400">Ready for similar commercial outcomes?</span>
                <a
                  href="#contact"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-md transition-all"
                >
                  Discuss Your Project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
