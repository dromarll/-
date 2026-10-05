import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RefreshCw, Volume2, Hand, Eye } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { triggerHaptic } from '../utils/haptics';

export type GestureType =
  | 'open-palm'   // مرحباً / أهلاً
  | 'peace'       // سلام / نصر
  | 'pointing'    // هنا / موضع الألم
  | 'heart-touch' // طبيب / نبض / فحص
  | 'pinch-med'   // دواء / قرص
  | 'fist-yes'    // نعم / موافق
  | 'open-give'   // شكراً / تفضل
  | 'wave';       // إلى اللقاء

interface ThreeDHandSignAvatarProps {
  currentWord?: string;
  gesture?: GestureType;
  isDoctorMode?: boolean;
  onGestureChange?: (gesture: GestureType) => void;
  className?: string;
}

export function ThreeDHandSignAvatar({
  currentWord = 'سلام',
  gesture: externalGesture,
  isDoctorMode = false,
  onGestureChange,
  className = '',
}: ThreeDHandSignAvatarProps) {
  const [internalGesture, setInternalGesture] = useState<GestureType>('peace');
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  const activeGesture = externalGesture || internalGesture;

  // Map words to gestures automatically
  useEffect(() => {
    if (!currentWord) return;
    const lower = currentWord.trim();
    if (lower.includes('طبيب') || lower.includes('فحص') || lower.includes('قلب') || lower.includes('صدر') || lower.includes('ضغط')) {
      setInternalGesture('heart-touch');
    } else if (lower.includes('دواء') || lower.includes('حبوب') || lower.includes('علاج') || lower.includes('صيدلية')) {
      setInternalGesture('pinch-med');
    } else if (lower.includes('ألم') || lower.includes('وجع') || lower.includes('هنا') || lower.includes('موضع')) {
      setInternalGesture('pointing');
    } else if (lower.includes('مرحبا') || lower.includes('أهلا') || lower.includes('صباح') || lower.includes('مساء')) {
      setInternalGesture('open-palm');
    } else if (lower.includes('نعم') || lower.includes('موافق') || lower.includes('أكيد')) {
      setInternalGesture('fist-yes');
    } else if (lower.includes('شكرا') || lower.includes('تفضل') || lower.includes('عفوا')) {
      setInternalGesture('open-give');
    } else if (lower.includes('وداعا') || lower.includes('مع السلامة')) {
      setInternalGesture('wave');
    } else {
      setInternalGesture('peace');
    }

    // Trigger gesture animation step
    setIsAnimating(true);
    setStepIdx(1);
    const t = setTimeout(() => {
      setStepIdx(2);
      setTimeout(() => setIsAnimating(false), 600);
    }, 450);

    return () => clearTimeout(t);
  }, [currentWord]);

  const handleSelectGesture = (g: GestureType, label: string) => {
    triggerHaptic('selection');
    sounds.playTap();
    setInternalGesture(g);
    onGestureChange?.(g);
    sounds.speakArabic(label);
  };

  // Gesture definitions with human descriptive data
  const gestureDetails: Record<
    GestureType,
    { label: string; action: string; fingers: { thumb: number; index: number; middle: number; ring: number; pinky: number }; rotation: number }
  > = {
    'open-palm': {
      label: 'كف مبسوط (ترحيب / أهلاً)',
      action: 'فتح الأصابع الخمسة للأمام بحركة أفقية متزنة',
      fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
      rotation: 0,
    },
    'peace': {
      label: 'إشارة السلام (سبابة ووسطى)',
      action: 'رفع السبابة والوسطى على شكل V مع ثني البنصر والخنصر',
      fingers: { thumb: 60, index: 0, middle: 0, ring: 80, pinky: 80 },
      rotation: 5,
    },
    'pointing': {
      label: 'تحديد موضع الشكوى (سبابة ممدودة)',
      action: 'توجيه السبابة لموضع الألم أو العضو المعني',
      fingers: { thumb: 60, index: 0, middle: 85, ring: 85, pinky: 85 },
      rotation: -10,
    },
    'heart-touch': {
      label: 'إشارة الطبيب / القلب والنبض',
      action: 'ثني خفيف للكف وتحريكه باتجاه الصدر لفحص النبض',
      fingers: { thumb: 20, index: 15, middle: 20, ring: 25, pinky: 30 },
      rotation: -25,
    },
    'pinch-med': {
      label: 'إشارة الدواء والجرعة (قرص دوائي)',
      action: 'ملامسة رأس الإبهام مع السبابة كما يُمسك القرص الدوائي',
      fingers: { thumb: 45, index: 55, middle: 75, ring: 80, pinky: 85 },
      rotation: 15,
    },
    'fist-yes': {
      label: 'إشارة التأكيد والموافقة (قبضة نعم)',
      action: 'إطباق الأصابع في قبضة متماسكة مع إيماءة للأمام',
      fingers: { thumb: 80, index: 90, middle: 90, ring: 90, pinky: 90 },
      rotation: 0,
    },
    'open-give': {
      label: 'إشارة الامتنان والشكر (عطاء)',
      action: 'بسط الكف وتحريكه من أسفل الذقن للأمام باتجاه المستمع',
      fingers: { thumb: 10, index: 5, middle: 5, ring: 10, pinky: 15 },
      rotation: -15,
    },
    'wave': {
      label: 'إشارة التحية والتوديع',
      action: 'تلويح الكف يمنة ويسرة بانسيابية',
      fingers: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
      rotation: 20,
    },
  };

  const currentDetail = gestureDetails[activeGesture];

  return (
    <div className={`relative rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#0B1712] via-[#07110C] to-[#040806] p-4 sm:p-5 overflow-hidden text-white select-none shadow-2xl flex flex-col justify-between ${className}`}>
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-lg shadow-inner">
            🤟
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black font-thmanyah text-white">
                {isDoctorMode ? 'محاكي اليد الإشارية ثلاثي الأبعاد للطبيب' : 'المحاكي العصبي الحركي للغة الإشارة'}
              </h4>
              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                3D Avatar Live
              </span>
            </div>
            <p className="text-[10px] text-slate-300 mt-0.5">
              تتحرك مفاصل اليد والأصابع بدقة تحاكي حركة الكف الطبيعية للأصم
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            sounds.playTap();
            sounds.speakArabic(currentWord);
          }}
          className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 text-xs font-bold font-thmanyah flex items-center gap-1 border border-white/10 transition-colors cursor-pointer"
          title="استماع للنطق العربي الفصيح"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">نطق الكلمة</span>
        </button>
      </div>

      {/* 3D Kinetic Hand Canvas Viewport */}
      <div className="relative my-3 h-52 sm:h-64 rounded-2xl bg-black/50 border border-emerald-500/30 overflow-hidden flex items-center justify-center">
        {/* Kinetic Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Neural Depth Rings */}
        <div className="absolute w-44 h-44 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none" />
        <div className="absolute w-60 h-60 rounded-full border border-cyan-500/15 pointer-events-none" />

        {/* 3D Hand Vector Model with Kinetic Joint Rotation */}
        <div
          className="relative transition-all duration-500 ease-out transform"
          style={{
            transform: `perspective(600px) rotateY(${currentDetail.rotation * 1.5}deg) rotateZ(${currentDetail.rotation * 0.5}deg) scale(${isAnimating ? 1.05 : 1})`,
          }}
        >
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            className="filter drop-shadow-[0_10px_25px_rgba(16,185,129,0.35)]"
          >
            <defs>
              <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <linearGradient id="jointGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Arm / Wrist Base */}
            <path
              d="M 90 200 L 85 155 Q 110 150 135 155 L 130 200 Z"
              fill="url(#handGradient)"
              stroke="#6ee7b7"
              strokeWidth="2"
              opacity="0.9"
            />
            {/* Wrist Joint Bar */}
            <ellipse cx="110" cy="155" rx="25" ry="6" fill="#047857" stroke="#34d399" strokeWidth="1.5" />

            {/* Palm Main Body */}
            <path
              d="M 72 150 Q 65 110 80 95 Q 110 88 140 95 Q 155 110 148 150 Z"
              fill="url(#handGradient)"
              stroke="#6ee7b7"
              strokeWidth="2.5"
            />

            {/* Palm Contour Lines */}
            <path d="M 85 130 Q 110 135 135 125" fill="none" stroke="#a7f3d0" strokeWidth="1.2" opacity="0.6" />
            <path d="M 88 115 Q 110 120 132 110" fill="none" stroke="#a7f3d0" strokeWidth="1.2" opacity="0.6" />

            {/* Pinky Finger */}
            <g
              transform={`translate(142, 100) rotate(${currentDetail.fingers.pinky * 0.7}) translate(-142, -100)`}
              className="transition-transform duration-500 ease-out origin-bottom"
            >
              <rect x="138" y="45" width="12" height="55" rx="6" fill="url(#handGradient)" stroke="#6ee7b7" strokeWidth="1.5" />
              <circle cx="144" cy="65" r="3" fill="url(#jointGradient)" />
              <circle cx="144" cy="85" r="3" fill="url(#jointGradient)" />
            </g>

            {/* Ring Finger */}
            <g
              transform={`translate(124, 95) rotate(${currentDetail.fingers.ring * 0.7}) translate(-124, -95)`}
              className="transition-transform duration-500 ease-out origin-bottom"
            >
              <rect x="120" y="32" width="13" height="65" rx="6.5" fill="url(#handGradient)" stroke="#6ee7b7" strokeWidth="1.5" />
              <circle cx="126.5" cy="55" r="3" fill="url(#jointGradient)" />
              <circle cx="126.5" cy="78" r="3" fill="url(#jointGradient)" />
            </g>

            {/* Middle Finger */}
            <g
              transform={`translate(104, 92) rotate(${currentDetail.fingers.middle * 0.7}) translate(-104, -92)`}
              className="transition-transform duration-500 ease-out origin-bottom"
            >
              <rect x="100" y="24" width="14" height="70" rx="7" fill="url(#handGradient)" stroke="#6ee7b7" strokeWidth="1.5" />
              <circle cx="107" cy="48" r="3" fill="url(#jointGradient)" />
              <circle cx="107" cy="72" r="3" fill="url(#jointGradient)" />
            </g>

            {/* Index Finger */}
            <g
              transform={`translate(84, 96) rotate(${currentDetail.fingers.index * 0.7}) translate(-84, -96)`}
              className="transition-transform duration-500 ease-out origin-bottom"
            >
              <rect x="80" y="32" width="13" height="65" rx="6.5" fill="url(#handGradient)" stroke="#6ee7b7" strokeWidth="1.5" />
              <circle cx="86.5" cy="55" r="3" fill="url(#jointGradient)" />
              <circle cx="86.5" cy="78" r="3" fill="url(#jointGradient)" />
            </g>

            {/* Thumb */}
            <g
              transform={`translate(68, 135) rotate(${-25 + currentDetail.fingers.thumb * 0.6}) translate(-68, -135)`}
              className="transition-transform duration-500 ease-out origin-bottom"
            >
              <rect x="52" y="90" width="14" height="48" rx="7" fill="url(#handGradient)" stroke="#6ee7b7" strokeWidth="1.8" />
              <circle cx="59" cy="108" r="3.5" fill="url(#jointGradient)" />
              <circle cx="59" cy="124" r="3.5" fill="url(#jointGradient)" />
            </g>

            {/* Hand Landmark Tracking Points (HUD Overlay) */}
            <circle cx="110" cy="120" r="4" fill="#a7f3d0" className="animate-ping" />
            <circle cx="110" cy="120" r="2.5" fill="#ffffff" />
          </svg>
        </div>

        {/* Live Tracking HUD Banner */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-emerald-500/40 text-[9px] font-mono text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>مفاصل الكف نشطة · تتبع 21 نقطة عصبية</span>
        </div>

        {/* Current Gesture Title & Word */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold font-thmanyah">الكلمة المنطوقة:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 font-black font-thmanyah">
              "{currentWord}"
            </span>
          </div>
          <span className="text-[10px] text-slate-300 truncate max-w-[160px]">
            {currentDetail.label}
          </span>
        </div>
      </div>

      {/* Gesture Action Explanation */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-right space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-bold font-thmanyah">طريقة أداء الإشارة للأصم:</span>
          <span className="text-[10px] font-mono text-slate-400">انسيابية حركية</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          {currentDetail.action}
        </p>
      </div>

      {/* Quick Interactive Gesture Triggers (For testing and physician use) */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <p className="text-[10px] text-slate-400 font-thmanyah mb-2 text-right">
          اختر إشارة لتجربة حركة اليد التفاعلية ثلاثية الأبعاد:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => handleSelectGesture('heart-touch', 'فحص النبض والقلب')}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold font-thmanyah border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGesture === 'heart-touch'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-[1.02]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <span>🩺</span>
            <span className="truncate">طبيب / فحص</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectGesture('pinch-med', 'تناول الدواء')}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold font-thmanyah border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGesture === 'pinch-med'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-[1.02]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <span>💊</span>
            <span className="truncate">دواء / جرعة</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectGesture('pointing', 'موضع الألم')}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold font-thmanyah border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGesture === 'pointing'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-[1.02]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <span>👉</span>
            <span className="truncate">موضع الألم</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectGesture('peace', 'سلام عليكم')}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold font-thmanyah border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGesture === 'peace'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-[1.02]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <span>✌️</span>
            <span className="truncate">سلام / تحية</span>
          </button>
        </div>

        {/* Doctor Live Input Box (يكتب الكلمة وتتحرك اليد تباعاً) */}
        <div className="mt-3 pt-2 border-t border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold font-thmanyah text-emerald-300">
            <span>✍️ كتابة الطبيب للتحويل الحركي الفوري:</span>
            <span className="text-[9px] text-slate-400">تتحرك اليد تباعاً مع كل حرف وكلمة</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="اكتب كلمة للطبيب (مثال: ألم، قلب، دواء، فحص، شكراً)..."
              value={currentWord}
              onChange={(e) => {
                const val = e.target.value;
                onGestureChange?.(activeGesture);
                sounds.speakArabic(val);
              }}
              className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 text-white text-xs font-thmanyah focus:outline-none focus:border-emerald-400 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                sounds.playTap();
                sounds.speakArabic(currentWord);
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 800);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-thmanyah flex items-center gap-1 shadow-md cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>تحريك</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
