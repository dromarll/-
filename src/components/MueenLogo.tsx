import { useState } from 'react';

interface MueenLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export function MueenLogo({ size = 'md', showSubtitle = true }: MueenLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeMap = {
    sm: {
      wrapper: 'w-9 h-9',
      subtitleText: 'text-[10px]',
      line: 'w-7',
      mt: 'mt-1',
    },
    md: {
      wrapper: 'w-13 h-13',
      subtitleText: 'text-xs',
      line: 'w-10',
      mt: 'mt-1.5',
    },
    lg: {
      wrapper: 'w-18 h-18',
      subtitleText: 'text-sm',
      line: 'w-14',
      mt: 'mt-2',
    },
    xl: {
      wrapper: 'w-28 h-28 sm:w-32 sm:h-32',
      subtitleText: 'text-base sm:text-lg',
      line: 'w-20 sm:w-24',
      mt: 'mt-3',
    },
  };

  const current = sizeMap[size];

  return (
    <div
      className="inline-flex flex-col items-center select-none group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 
        The Innovative Squircle Logo:
        - Modern Arabic Architectural 'مُ' (Meem with Dammah)
        - Loop of the Meem is hollowed out (مفرغة) with glass transparency
        - The tail gracefully extends outside the squircle boundary (نصها طالع للخارج بتقنية الأبعاد الثلاثية)
        - Integrated neural soundwave symbolizing voice & sign fusion
      */}
      <div
        className={`${current.wrapper} relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full overflow-visible drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 1. Squircle Background Gradient */}
            <linearGradient id="mueenSquircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-primary, #1D3557)" />
              <stop offset="55%" stopColor="var(--brand-accent, #2A9D8F)" />
              <stop offset="100%" stopColor="#0B525B" />
            </linearGradient>

            {/* 2. Apple Gloss Highlight */}
            <linearGradient id="mueenGlossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
            </linearGradient>

            {/* 3. Meem Hollow Stroke Gradient */}
            <linearGradient id="meemStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2F9F5" />
              <stop offset="100%" stopColor="#A7F3D0" />
            </linearGradient>

            {/* 4. Dammah Golden/Cyan Glow */}
            <linearGradient id="dammahGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            {/* 5. Drop Shadow Filter for the protruding tail */}
            <filter id="tailShadow" x="-20%" y="-20%" width="160%" height="160%">
              <feDropShadow dx="-2" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* SQUIRCLE BASE (مربع تطبيقات الآيفون المستدير الحواف) */}
          <rect
            x="8"
            y="8"
            width="104"
            height="104"
            rx="28"
            fill="url(#mueenSquircleGrad)"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="1.75"
          />

          {/* INNER GRID LINES (خطوط دقيقة ترمز للذكاء الاصطناعي وشبكة التواصل) */}
          <g opacity="0.18">
            <line x1="8" y1="42" x2="112" y2="42" stroke="#FFFFFF" strokeDasharray="3 3" />
            <line x1="8" y1="78" x2="112" y2="78" stroke="#FFFFFF" strokeDasharray="3 3" />
            <line x1="42" y1="8" x2="42" y2="112" stroke="#FFFFFF" strokeDasharray="3 3" />
            <line x1="78" y1="8" x2="78" y2="112" stroke="#FFFFFF" strokeDasharray="3 3" />
          </g>

          {/* ACOUSTIC SOUNDWAVE / RADAR PULSE (نبضات صوتية ورادار داخل الأيقونة) */}
          <path
            d="M22 68 Q 34 68 40 56 T 54 68 T 68 80 T 82 68 T 98 68"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* APPLE GLOSS LAYER */}
          <rect
            x="9"
            y="9"
            width="102"
            height="102"
            rx="27"
            fill="url(#mueenGlossGrad)"
            pointerEvents="none"
          />

          {/* ===================================================================== */}
          {/* THE MEEM GLYPH (مُ) - DESIGNED WITH HOLLOW LOOP & PROTRUDING TAIL    */}
          {/* ===================================================================== */}

          {/* A. Outer Protruding Tail (الذيل الخارج من إطار الأيقونة ليعطي بُعداً ثلاثياً مذهلاً) */}
          <path
            d="M 44 76 Q 30 92 12 114 Q 2 124 -4 126"
            stroke="url(#meemStrokeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#tailShadow)"
          />

          {/* B. Main Architectural Meem Head Loop (الميم المفرغة ذات التصميم العصري الجميل) */}
          {/* Hollow Meem Loop with Transparent Center (مفرغة من الداخل) */}
          <circle
            cx="66"
            cy="55"
            r="20"
            fill="none"
            stroke="url(#meemStrokeGrad)"
            strokeWidth="11"
            className="transition-all duration-300"
          />

          {/* Inner Light Window inside Meem Loop (نافذة الضوء المفرغة) */}
          <circle
            cx="66"
            cy="55"
            r="12"
            fill="rgba(0, 0, 0, 0.22)"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.5"
          />

          {/* Subtle center sparkle */}
          <circle cx="66" cy="55" r="3.5" fill="#34D399" opacity="0.9" />

          {/* C. Bridge connecting Meem loop to the sweeping tail */}
          <path
            d="M 64 68 C 60 76 52 79 42 77"
            stroke="url(#meemStrokeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />

          {/* D. Elegant Curved DAMMAH (الضمة المرفوعة بأناقة وتدرج حيوي) */}
          <g transform="translate(62, 17) scale(1.15)">
            {/* Dammah head */}
            <circle
              cx="10"
              cy="8"
              r="4.5"
              fill="url(#dammahGrad)"
              filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
            />
            {/* Dammah curve */}
            <path
              d="M 12 10 C 13 14 10 17 6 19"
              stroke="url(#dammahGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* SPECULAR SHINE ON TOP OF MEEM (لمعة ضوئية عاكسة ثلاثية الأبعاد) */}
          <path
            d="M 52 42 Q 66 38 78 44"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>

        {/* Ambient Glow Aura behind logo on Hover */}
        <div
          className={`absolute -inset-3 rounded-full blur-xl pointer-events-none transition-opacity duration-500 ${
            isHovered ? 'opacity-70' : 'opacity-20'
          }`}
          style={{ background: 'var(--brand-glow, rgba(42, 157, 143, 0.35))' }}
        />
      </div>

      {/* 2. Small line underneath with 'مُـعِـيـن' */}
      {showSubtitle && (
        <div className={`flex flex-col items-center ${current.mt}`}>
          <div
            className={`${current.line} h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-accent)] to-transparent rounded-full mb-1 transition-all duration-300 group-hover:scale-x-125`}
          />
          <span
            className={`${current.subtitleText} font-black font-thmanyah text-[var(--text-primary)] tracking-tight drop-shadow-sm`}
            style={{ fontFamily: 'Thmanyah-Bold, sans-serif' }}
          >
            مُعِـين
          </span>
        </div>
      )}
    </div>
  );
}
