import { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Clock, Mail, MapPin, Shield, Calendar, RefreshCw } from 'lucide-react';

interface ContactSectionProps {
  initialData?: {
    projectType: string;
    timeline: string;
    estimatedCost: string;
    features: string[];
  } | null;
}

export function ContactSection({ initialData }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Custom Web Application',
    budget: '$5,000 - $10,000',
    details: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync initialData if estimator applied
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        projectType: initialData.projectType,
        budget: initialData.estimatedCost,
        details: `Calculated Scope:
- Project: ${initialData.projectType}
- Target Timeline: ${initialData.timeline}
- Estimated Range: ${initialData.estimatedCost}
- Add-ons: ${initialData.features.join(', ')}

Project Overview & Goals:
`
      }));
    }
  }, [initialData]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your full name';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide a valid business email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.details.trim() || formData.details.length < 15) {
      errs.details = 'Please provide at least 15 characters of project context';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate real network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      company: '',
      projectType: 'Custom Web Application',
      budget: '$5,000 - $10,000',
      details: '',
    });
    setErrors({});
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#0A0D17]">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-cyan-500/10 via-teal-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & Value Prop */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Initiate Project Discovery
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display text-balance">
                Let's Build Something Exceptional Together.
              </h2>
              <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed text-balance">
                Have a new project, redesign, or engineering challenge? We review inquiries within 4 hours and schedule an exploratory strategy call.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-md">
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Direct Inquiries</p>
                  <p className="text-sm font-semibold text-white font-mono">
                    partnerships@nexadigital.design
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-md">
                <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Guaranteed Response SLA</p>
                  <p className="text-sm font-semibold text-white">
                    Under 4 business hours · Mutual NDA ready
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-md">
                <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Studio Locations</p>
                  <p className="text-sm font-semibold text-white">
                    London (Soho) · San Francisco (Financial District)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.06] text-xs text-slate-400 flex items-center gap-3">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All conversations are protected under our standard Mutual Non-Disclosure Agreement.</span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-white/[0.1] bg-[#0E1526]/85 p-7 sm:p-10 backdrop-blur-xl shadow-2xl">
              {isSubmitted ? (
                <div className="text-center py-10 space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-display">
                      Discovery Request Confirmed!
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                      Thank you, <span className="text-white font-semibold">{formData.name}</span>. Our lead technical partner is reviewing your brief and will respond to <span className="text-cyan-300 font-mono">{formData.email}</span> within 4 hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.08] text-xs text-slate-300 max-w-md mx-auto space-y-1 text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Project Type:</span>
                      <span className="font-semibold text-white">{formData.projectType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Budget Range:</span>
                      <span className="font-semibold text-cyan-300 font-mono">{formData.budget}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Submit Another Inquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder="Marcus Vance"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all ${
                          errors.name ? 'border-rose-500' : 'border-white/[0.08] hover:border-white/[0.15]'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Business Email <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        placeholder="marcus@company.com"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all ${
                          errors.email ? 'border-rose-500' : 'border-white/[0.08] hover:border-white/[0.15]'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Project Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/[0.08] text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all cursor-pointer"
                      >
                        <option value="Custom Web Application">Custom Web Application</option>
                        <option value="Brand & Marketing Site">Brand & Marketing Site</option>
                        <option value="Headless E-Commerce">Headless E-Commerce</option>
                        <option value="Enterprise Design System">Enterprise Design System</option>
                        <option value="Full Rebrand & Engineering">Full Rebrand & Engineering</option>
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Target Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/[0.08] text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all cursor-pointer"
                      >
                        <option value="Under $5,000">Under $5,000 (Sprint MVP)</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000 (Standard)</option>
                        <option value="$10,000 - $25,000">$10,000 - $25,000 (Full-Scale)</option>
                        <option value="$25,000+">$25,000+ (Enterprise / Retainer)</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Project Details & Timeline Goals <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.details}
                      onChange={(e) => {
                        setFormData({ ...formData, details: e.target.value });
                        if (errors.details) setErrors({ ...errors, details: '' });
                      }}
                      placeholder="Tell us about your brand, current bottlenecks, key deliverables, and target launch date..."
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all ${
                        errors.details ? 'border-rose-500' : 'border-white/[0.08] hover:border-white/[0.15]'
                      }`}
                    />
                    {errors.details && (
                      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.details}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching Brief...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Project Request</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
