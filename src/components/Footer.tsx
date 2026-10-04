import { ArrowUp, Github, Twitter, Linkedin, Dribbble } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#070A12] py-14 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Col 1: Wordmark & Statement */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span className="font-display tracking-wider font-extrabold text-base text-white uppercase">
                Nexa Digital
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An independent web design and engineering agency crafting high-performance digital products, headless storefronts, and brand identities for ambitious companies.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-cyan-300 hover:bg-slate-800 transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-cyan-300 hover:bg-slate-800 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-cyan-300 hover:bg-slate-800 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-cyan-300 hover:bg-slate-800 transition-colors" aria-label="Dribbble">
                <Dribbble className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Mirror */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">
              Navigation
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:text-cyan-300 transition-colors">
                  Capabilities & Services
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-cyan-300 transition-colors">
                  Selected Work & Case Studies
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-cyan-300 transition-colors">
                  Engineering Blueprint
                </a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-cyan-300 transition-colors">
                  Scope & Investment Calculator
                </a>
              </li>
              <li>
                <a href="#proof" className="hover:text-cyan-300 transition-colors">
                  Social Proof & Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">
              Specialties
            </p>
            <ul className="space-y-2">
              <li className="hover:text-cyan-300 transition-colors">Interactive UI/UX Design</li>
              <li className="hover:text-cyan-300 transition-colors">Full-Stack React & Next.js</li>
              <li className="hover:text-cyan-300 transition-colors">Headless Shopify Plus Commerce</li>
              <li className="hover:text-cyan-300 transition-colors">Design Systems & Tokens</li>
              <li className="hover:text-cyan-300 transition-colors">Lighthouse Performance Engineering</li>
            </ul>
          </div>

          {/* Col 4: Studios */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">
              Offices
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-white font-medium">London</p>
                <p className="text-slate-400">Soho Square, W1D</p>
              </div>
              <div>
                <p className="text-white font-medium">San Francisco</p>
                <p className="text-slate-400">Montgomery St, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400">
            © {new Date().getFullYear()} Nexa Digital Agency Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
