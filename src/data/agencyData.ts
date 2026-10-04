export interface Project {
  id: string;
  title: string;
  category: 'web-apps' | 'ecommerce' | 'saas-ai' | 'brand';
  client: string;
  year: string;
  summary: string;
  metrics: string;
  tags: string[];
  deliverables: string[];
  challenge: string;
  solution: string;
  color: string;
  accent: string;
  type: string;
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  deliverables: string[];
  tools: string[];
  timeline: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  metric: string;
  quote: string;
  avatarText: string;
}

export const AGENCY_SERVICES: Service[] = [
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    tagline: 'Interfaces that convert curiosity into retention',
    description: 'We craft human-centric, high-fidelity design systems and user flows rooted in behavioral psychology, rapid usability testing, and pixel perfection.',
    icon: 'Layout',
    deliverables: [
      'Interactive Design Systems & Tokens',
      'High-Fidelity Figma Prototypes',
      'User Journey Mapping & Information Architecture',
      'Responsive Mobile & Desktop Viewports',
      'Micro-Interactions & Animation Specs'
    ],
    tools: ['Figma', 'Principle', 'Tokens Studio', 'Framer'],
    timeline: '2–4 Weeks'
  },
  {
    id: 'full-stack',
    title: 'Full-Stack Development',
    tagline: 'Modern engineering built for blistering speed & scale',
    description: 'Bespoke web applications built with modern frontend frameworks and resilient backends. Engineered for sub-second page loads, SEO dominance, and fluid responsiveness.',
    icon: 'Code2',
    deliverables: [
      'Next.js / React Modern Architectures',
      'Headless CMS & Dynamic Content Modeling',
      'Edge API & Database Integrations',
      'Lighthouse 95+ Performance Guarantee',
      'Full WCAG AA Accessibility Compliance'
    ],
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vercel / Cloud Run'],
    timeline: '3–6 Weeks'
  },
  {
    id: 'brand-identity',
    title: 'Brand Identity',
    tagline: 'Distinctive visual DNA that sets industry standards',
    description: 'We define cohesive brand identities that stand apart from noisy digital marketplaces. From logomarks and typographic systems to brand motion guidelines.',
    icon: 'Sparkles',
    deliverables: [
      'Primary & Secondary Logomarks',
      'Domain Typographic System & Scale',
      'Color Harmonies & Contrast Matrix',
      'Brand Collateral & Social Media Kits',
      'Comprehensive Brand Guideline Bible'
    ],
    tools: ['Illustrator', 'Glyphs', 'Photoshop', 'After Effects'],
    timeline: '2–3 Weeks'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    tagline: 'High-converting storefronts engineered for revenue',
    description: 'Tailored digital storefronts designed to maximize average order value (AOV) and eliminate checkout friction with custom architectures and rapid fulfillment integration.',
    icon: 'ShoppingBag',
    deliverables: [
      'Custom Shopify Plus & Headless Commerce',
      'High-Velocity Checkout Funnels',
      'Real-Time Inventory & ERP Synchronization',
      'Conversion Rate Optimization (CRO)',
      'Sub-500ms Product Catalog Browsing'
    ],
    tools: ['Shopify Plus', 'Stripe', 'Sanity CMS', 'Medusa', 'Tailwind'],
    timeline: '4–7 Weeks'
  }
];

export const AGENCY_PROJECTS: Project[] = [
  {
    id: 'aether-fintech',
    title: 'Aether Wealth',
    category: 'web-apps',
    client: 'Aether Capital Partners',
    year: '2026',
    type: 'FinTech Web App',
    summary: 'Institutional-grade asset management portal with real-time portfolio telemetry and predictive risk simulation.',
    metrics: '+184% Onboarding Completion',
    tags: ['FinTech', 'Web App', 'React / TypeScript'],
    deliverables: ['Design System', 'Full-Stack Portal', 'Real-Time WebSocket Feeds', 'Security Hardening'],
    challenge: 'Aether struggled with complex financial table legibility and a 62% drop-off during multi-step institutional client verification.',
    solution: 'Designed an obsidian-themed modular cockpit with tabular figures, micro-stepper onboarding with instant document verification, and sub-100ms charting.',
    color: 'from-cyan-500/20 to-blue-500/10',
    accent: '#00F2FE'
  },
  {
    id: 'kroma-living',
    title: 'Kroma Living',
    category: 'ecommerce',
    client: 'Kroma Nordic Furniture',
    year: '2026',
    type: 'Luxury E-Commerce',
    summary: 'Minimalist direct-to-consumer flagship storefront with spatial room configurator and custom Shopify Plus checkout.',
    metrics: '+240% Direct Sales Volume',
    tags: ['E-Commerce', 'Shopify Plus', 'Headless'],
    deliverables: ['Custom Theme', '3D Furniture Preview', 'Checkout Funnel Optimization', 'ERP Sync'],
    challenge: 'High customer drop-off on high-ticket custom modular sofas due to lack of dimension visualization and slow mobile catalog loading.',
    solution: 'Engineered a headless storefront with instantaneous client-side fabric selection, real-time lighting previews, and a 1-page checkout.',
    color: 'from-teal-500/20 to-emerald-500/10',
    accent: '#10B981'
  },
  {
    id: 'vortex-ai',
    title: 'Vortex Intelligence',
    category: 'saas-ai',
    client: 'Vortex Systems',
    year: '2025',
    type: 'AI SaaS Platform',
    summary: 'Neural workflow orchestration interface for machine learning engineering teams and automated pipeline observability.',
    metrics: '$3.2M Seed Round Closed',
    tags: ['SaaS', 'AI Analytics', 'Design System'],
    deliverables: ['Visual Identity', 'Node-Based Workflow Canvas', 'Dark Mode Web App', 'Marketing Site'],
    challenge: 'The founders needed to translate high-dimensional neural weights and complex pipeline orchestration into an intuitive drag-and-drop tool.',
    solution: 'Built an interactive node canvas with fluid glassmorphic inspection cards, contextual error hints, and instantaneous execution simulation.',
    color: 'from-cyan-400/20 to-teal-600/10',
    accent: '#06B6D4'
  },
  {
    id: 'solstice-health',
    title: 'Solstice Health',
    category: 'web-apps',
    client: 'Solstice Medical Group',
    year: '2025',
    type: 'Healthcare Portal',
    summary: 'Next-generation patient telehealth portal and appointment booking experience with end-to-end HIPAA compliance.',
    metrics: '99.4% Patient Approval Score',
    tags: ['Healthcare', 'Web App', 'Accessibility'],
    deliverables: ['WCAG AA Accessible UI', 'Telehealth Video Integration', 'Patient Portal', 'Mobile App Companion'],
    challenge: 'Elderly patients found previous booking software unintuitive, resulting in phone support congestion and 35% missed appointments.',
    solution: 'Created high-contrast typography, large touch targets, single-action booking flows with automated SMS confirmations and one-tap video joins.',
    color: 'from-emerald-500/20 to-cyan-500/10',
    accent: '#34D399'
  },
  {
    id: 'arcadia-atelier',
    title: 'Arcadia Atelier',
    category: 'brand',
    client: 'Arcadia Architecture Studio',
    year: '2025',
    type: 'Brand & Editorial',
    summary: 'High-contrast editorial portfolio and digital monograph celebrating contemporary sustainable Scandinavian architecture.',
    metrics: 'Awwwards Site of the Day',
    tags: ['Brand Identity', 'Editorial Design', 'Interactive'],
    deliverables: ['Brand Identity Suite', 'Monograph Website', 'Custom Typography Pairing', 'Case Study Showcases'],
    challenge: 'Arcadia needed a digital home that matched the tactile refinement of their physical architectural projects without feeling like a generic portfolio.',
    solution: 'Curated a cinematic, monochromatic grid with dynamic whitespace pacing, subtle parallax transitions, and deep editorial typography.',
    color: 'from-blue-500/20 to-cyan-500/10',
    accent: '#38BDF8'
  },
  {
    id: 'pulse-athletica',
    title: 'Pulse Athletica',
    category: 'ecommerce',
    client: 'Pulse Performance Labs',
    year: '2025',
    type: 'High-Velocity Storefront',
    summary: 'Technical athletic wear brand experience built for high-traffic limited edition product drops and instantaneous cart reserve.',
    metrics: 'Sub-320ms Page Load Speed',
    tags: ['E-Commerce', 'Performance', 'Cart Engineering'],
    deliverables: ['Custom Product Drop Engine', 'Zero-Latency Search', 'Mobile First Navigation', 'Conversion Testing'],
    challenge: 'Flash drops with 50,000 concurrent visitors previously crashed server instances and created duplicate checkout charges.',
    solution: 'Deployed static edge-rendered catalog pages, client-side cart reservation queue, and frictionless Apple Pay / Google Pay checkouts.',
    color: 'from-teal-400/20 to-blue-600/10',
    accent: '#00F2FE'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Marcus Vance',
    role: 'Founder & CEO',
    company: 'Aether Wealth',
    metric: '+184% Onboarding Rate',
    quote: 'Nexa did not just redesign our app—they fundamentally transformed how institutional clients perceive our brand. Our onboarding completion surged from 38% to over 80% within 60 days of launch.',
    avatarText: 'MV'
  },
  {
    id: '2',
    name: 'Elena Rostova',
    role: 'Head of Digital Commerce',
    company: 'Kroma Living',
    metric: '2.4x Revenue in Q4',
    quote: 'The level of craftsmanship Nexa brings is unmatched. Our custom Shopify Plus flagship feels like a luxury gallery while delivering lightning-fast sub-second interactions that drive record sales.',
    avatarText: 'ER'
  },
  {
    id: '3',
    name: 'Dr. Julian Thorne',
    role: 'Co-Founder & CTO',
    company: 'Vortex Intelligence',
    metric: '$3.2M Seed Closed',
    quote: 'Investors repeatedly cited our product UI as a standout differentiator during our seed round. Nexa translated deep technical complexity into pure, effortless software elegance.',
    avatarText: 'JT'
  }
];

export const FAQS = [
  {
    question: 'How long does a typical web design and development project take?',
    answer: 'Most custom agency websites and web applications take between 3 to 8 weeks depending on scope. Simple brand launch sites typically take 3-4 weeks, while complex full-stack web applications with authentication, databases, and custom animations take 6-8 weeks.'
  },
  {
    question: 'What is your technology stack?',
    answer: 'We specialize in modern frontend ecosystems including React, Next.js, TypeScript, and Tailwind CSS, backed by Node.js, edge compute, and headless CMS platforms (Sanity, Strapi, or Supabase). For e-commerce, we specialize in Shopify Plus and custom headless checkouts.'
  },
  {
    question: 'Do you provide full design files and ownership?',
    answer: 'Yes, 100%. Upon final project delivery, all intellectual property, production Figma design systems, tokens, assets, source code repositories, and documentation belong completely to your team.'
  },
  {
    question: 'What happens after launch? Do you offer ongoing support?',
    answer: 'Every project includes 30 days of post-launch warranty, monitoring, and hypercare support. We also provide ongoing monthly retainer partnerships for continuous feature expansion, conversion rate optimization (CRO), and engineering support.'
  }
];
