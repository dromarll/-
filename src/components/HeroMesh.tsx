import { MueenLogo } from './MueenLogo';
import { ArrowDown, Smartphone, Sparkles, UserCheck, ShieldCheck, Heart } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeroMeshProps {
  onScrollToIPhone: () => void;
  userName: string;
  onOpenNameModal: () => void;
  onOpenLinkModal?: () => void;
}

export function HeroMesh({ onScrollToIPhone, userName, onOpenNameModal, onOpenLinkModal }: HeroMeshProps) {
  const handleClick = () => {
    sounds.playTap();
    onScrollToIPhone();
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden flex flex-col items-center justify-center text-center select-none">
      {/* 1. Animated Glowing Grid Mesh Lines behind Title */}
      <div className="absolute inset-0 bg-mesh-grid animate-mesh-flow opacity-60 pointer-events-none" />

      {/* 2. Traveling Shadow Beam that glides back and forth along the lines (كما طلب المستخدم: زي الظل يمشي معها ويرجع يمشي بحيث تكون حية الواجهة) */}
      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand-accent)] to-transparent animate-beam-travel pointer-events-none blur-[1px]" />
      <div className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[var(--brand-glow)] to-transparent animate-beam-travel pointer-events-none opacity-50 blur-2xl" />

      {/* 3. Ambient Living Floating Emojis / Medical Badges (الإيموشنات والعناصر الحية في الخلفية) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-6xl mx-auto">
        {/* Sign Language Hand 🤟 */}
        <div className="absolute top-16 right-8 sm:right-16 text-2xl sm:text-4xl opacity-40 animate-float-slow filter drop-shadow">
          🤟
        </div>

        {/* Vision & Empathy Branch 🌿 */}
        <div className="absolute top-28 left-8 sm:left-20 text-2xl sm:text-4xl opacity-50 animate-float-delayed filter drop-shadow">
          🌿
        </div>

        {/* Ear & Hearing 👂 */}
        <div className="absolute bottom-20 right-12 sm:right-28 text-xl sm:text-3xl opacity-35 animate-float-delayed filter drop-shadow">
          👂
        </div>

        {/* Stethoscope 🩺 */}
        <div className="absolute bottom-28 left-12 sm:left-32 text-xl sm:text-3xl opacity-40 animate-float-slow filter drop-shadow">
          🩺
        </div>

        {/* Saudi Flag & Vision 🇸🇦 */}
        <div className="absolute top-1/2 -left-3 sm:left-6 text-xl sm:text-2xl opacity-40 animate-float-slow filter drop-shadow">
          🇸🇦
        </div>

        {/* Neural AI Lightning ⚡ */}
        <div className="absolute top-1/3 -right-2 sm:right-8 text-xl sm:text-2xl opacity-45 animate-float-delayed filter drop-shadow">
          ⚡
        </div>
      </div>

      {/* 4. Ambient Radial Gradient Spotlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-colors duration-500"
        style={{ background: 'var(--brand-glow)' }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        {/* Logo: حرف الميم مع الضمة (مُ) */}
        <div className="mb-4 lift-3d cursor-pointer" onClick={handleClick}>
          <MueenLogo size="xl" showSubtitle={false} />
        </div>

        {/* Big Name: مُعِـين */}
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-thmanyah tracking-tight mb-3 select-none lift-3d cursor-default drop-shadow-sm text-[var(--text-primary)]"
          style={{ fontFamily: 'Thmanyah-Black, Thmanyah-Bold, sans-serif' }}
        >
          مُعِـين
        </h1>

        {/* Short Clean Subtitle */}
        <p
          className="text-base sm:text-xl md:text-2xl font-bold font-thmanyah text-[var(--text-secondary)] text-balance max-w-xl mx-auto mb-6"
          style={{ fontFamily: 'Thmanyah-Bold, sans-serif' }}
        >
          جسر التواصل الذكي بين لغة الإشارة واللغة العربية
        </p>

        {/* Clean CTA Actions */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          <button
            type="button"
            onClick={handleClick}
            className="lift-3d px-6 py-3 rounded-2xl font-black font-thmanyah text-xs sm:text-sm text-white flex items-center gap-2 shadow-lg cursor-pointer"
            style={{ backgroundColor: 'var(--brand-cta)' }}
          >
            <Smartphone className="w-4 h-4" />
            <span>تجربة التطبيق الآن</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
