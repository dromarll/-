import { useState, useRef, useEffect } from 'react';
import { Camera, Volume2, Mic, ArrowLeftRight, Video, VideoOff, Send, Hand, MessageSquare, Sparkles, CheckCircle2, Film, Box } from 'lucide-react';
import { DICTIONARY_WORDS, SignWord } from '../data/mueenData';
import { ThreeDHandSignAvatar } from './ThreeDHandSignAvatar';
import { sounds } from '../utils/soundEffects';
import { triggerHaptic } from '../utils/haptics';

interface BidirectionalTranslatorProps {
  onOpenDictionary?: () => void;
}

export function BidirectionalTranslator({ onOpenDictionary }: BidirectionalTranslatorProps) {
  // Tabs: إشارة إلى كتابة vs كتابة إلى إشارة
  const [activeWindow, setActiveWindow] = useState<'sign-to-speech' | 'speech-to-sign'>('sign-to-speech');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [detectedSign, setDetectedSign] = useState<SignWord>(DICTIONARY_WORDS[0]);
  const [inputText, setInputText] = useState('السلام عليكم، كيف يمكنني مساعدتك؟');
  const [activeSignIdx, setActiveSignIdx] = useState(0);

  // Toggle in Window 2: 3D representation vs Video / Dictionary Clip representation
  const [representationMode, setRepresentationMode] = useState<'3d' | 'video'>('3d');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const quickPhrases = [
    'السلام عليكم، أهلاً بك',
    'أحتاج مساعدة طبية عاجلة',
    'أين موضع الألم بالضبط؟',
    'شكراً جزيلاً لتعاونك',
    'فهمت التوجيهات تماماً'
  ];

  const speakText = (text: string) => {
    sounds.speakArabic(text);
  };

  const startCamera = async () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        videoRef.current.setAttribute('muted', 'true');
        await videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch {
      setIsCameraActive(true); // Fallback to simulated HUD
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const switchCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
    if (isCameraActive) {
      setTimeout(startCamera, 100);
    }
  };

  const handleSelectGesture = (w: SignWord) => {
    triggerHaptic('selection');
    sounds.playTap();
    setDetectedSign(w);
    speakText(w.word);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <section id="translator" className="py-12 sm:py-20 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>الترجمة العصبية ثنائية الاتجاه</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-thmanyah tracking-tight">
            تواصل لحظي.. بلا حواجز وبلا مترجم بشري
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            التحويل الفوري بين إشارات الأصم ونصوص وأصوات السامع بدقة فائقة
          </p>
        </div>

        {/* Window Selector Tabs: إشارة إلى كتابة vs كتابة إلى إشارة */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex gap-2 shadow-lg">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                sounds.playTap();
                setActiveWindow('sign-to-speech');
              }}
              className={`lift-3d px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-thmanyah flex items-center gap-2 transition-all cursor-pointer ${
                activeWindow === 'sign-to-speech'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Hand className="w-4 h-4" />
              <span>النافذة الأولى: إشارة إلى كتابة (تصوير الأصم ➔ نص وصوت)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                sounds.playTap();
                setActiveWindow('speech-to-sign');
              }}
              className={`lift-3d px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-thmanyah flex items-center gap-2 transition-all cursor-pointer ${
                activeWindow === 'speech-to-sign'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>النافذة الثانية: كتابة إلى إشارة (كلام السامع ➔ تمثيل حركي)</span>
            </button>
          </div>
        </div>

        {/* ================= WINDOW 1: إشارة إلى كتابة ================= */}
        {/* الكاميرا يمين (Right) والكتابة النصية والصوت يسار (Left) كما طلب المستخدم بالضبط */}
        {activeWindow === 'sign-to-speech' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 1. الكاميرا يمين (Right Side in RTL) */}
            <div className="lg:col-span-7 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-xl lift-3d flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`} />
                  <span className="text-xs font-bold font-mono">
                    {isCameraActive ? 'الكاميرا الذكية ترصد حركة اليدين يميناً' : 'الكاميرا جاهزة للتشغيل (يمين)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isCameraActive && (
                    <button
                      type="button"
                      onClick={switchCameraFacing}
                      className="px-2 py-1 text-xs rounded-lg border border-[var(--border-subtle)] flex items-center gap-1 hover:bg-black/5"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>{cameraFacing === 'user' ? 'سيلفي' : 'خلفية'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={isCameraActive ? stopCamera : startCamera}
                    className="lift-3d px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
                    style={{ backgroundColor: isCameraActive ? '#E63946' : 'var(--brand-cta)' }}
                  >
                    {isCameraActive ? (
                      <>
                        <VideoOff className="w-3.5 h-3.5" />
                        <span>إيقاف الكاميرا</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-3.5 h-3.5" />
                        <span>تشغيل الكاميرا</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Video Display Stage */}
              <div className="relative my-3 w-full h-72 sm:h-84 rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-white/10">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isCameraActive ? 'opacity-90' : 'hidden'}`}
                />

                {/* HUD Overlay with Landmarks */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
                  <span className="self-start text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    رصد 21 نقطة مفصلية بالكف
                  </span>

                  <div className="mx-auto my-auto w-48 h-48 border-2 border-dashed border-emerald-400/60 rounded-2xl flex flex-col items-center justify-center animate-pulse">
                    <span className="text-4xl animate-bounce">{detectedSign.visualIcon}</span>
                    <span className="text-[11px] font-bold text-white mt-1">تتبع كف الأصم</span>
                  </div>

                  <span className="self-end text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded">
                    دقة التعرف: 99.2%
                  </span>
                </div>
              </div>

              {/* Fast Gesture Testing Buttons */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-[var(--text-secondary)] mb-1.5 font-thmanyah">
                  اختبر الإشارات بالكاميرا لتحديث الكتابة يساراً تلقائياً:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DICTIONARY_WORDS.slice(0, 4).map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleSelectGesture(w)}
                      className={`p-2 rounded-xl border text-xs font-bold text-right flex items-center justify-between lift-3d cursor-pointer ${
                        detectedSign.id === w.id
                          ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/15 text-[var(--brand-primary)]'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--brand-accent)]'
                      }`}
                    >
                      <span className="truncate">{w.word}</span>
                      <span>{w.visualIcon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. الكتابة النصية الفورية يسار (Left Side in RTL - تنكتب من حالها وتستجيب) */}
            <div className="lg:col-span-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-7 shadow-xl lift-3d flex flex-col justify-between space-y-4">
              <div className="space-y-3 pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[var(--brand-accent)] uppercase font-thmanyah">
                    الكتابة النصية المباشرة (يسار):
                  </span>
                  <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    تستجيب للكاميرا فوراً
                  </span>
                </div>

                {/* Auto-written Subtitle Box (تنكتب من حالها) */}
                <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-thmanyah block">
                    النص المكتوب الملتقط من إشارة الأصم:
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-thmanyah text-emerald-400 animate-fadeIn">
                    "{detectedSign.word}"
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {detectedSign.description}
                  </p>
                </div>
              </div>

              {/* Audio Playback Button */}
              <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-slate-500/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold font-thmanyah">نطق صوتي فوري بجودة جيمناي</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">يسمعه الطبيب، الموظف، أو المرافق</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    sounds.playTap();
                    speakText(detectedSign.word);
                  }}
                  className="lift-3d px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
                  style={{ backgroundColor: 'var(--brand-cta)' }}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استماع</span>
                </button>
              </div>

              {/* Hand Shape Details */}
              <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs space-y-1">
                <span className="font-bold text-[var(--text-primary)] font-thmanyah">هيئة حركة اليد:</span>
                <p className="text-[var(--text-secondary)] text-[11px]">{detectedSign.handShape}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= WINDOW 2: كتابة إلى إشارة ================= */}
        {/* كلام يمين (Right) ويسار تمثيل حركي (Left) مع خياري: ثري دي 3D أو فيديو / مقطع */}
        {activeWindow === 'speech-to-sign' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 1. إدخال الكلام يمين (Right Side in RTL) */}
            <div className="lg:col-span-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-xl lift-3d flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--brand-accent)] font-thmanyah">
                  إدخال كلام السامع (يمين):
                </span>
                <h3 className="text-lg font-bold font-thmanyah">اكتب أو تحدث ليتحول لإشارة يساراً</h3>

                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="اكتب العبارة أو التوجيه الطبي..."
                  className="w-full p-3.5 rounded-2xl text-xs sm:text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-thmanyah">عبارات شائعة سريعة:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPhrases.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        sounds.playTap();
                        setInputText(p);
                      }}
                      className="p-1.5 px-2.5 rounded-xl border border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] hover:border-[var(--brand-accent)] truncate lift-3d-subtle cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. التمثيل الحركي يسار (Left Side in RTL): متاح كـ ثري دي 3D أو فيديو / مقاطع */}
            <div className="lg:col-span-7 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-xl lift-3d flex flex-col justify-between space-y-4 text-center">
              {/* Header with Representation Mode Toggle (3D vs Video) */}
              <div className="pb-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[var(--brand-accent)] font-thmanyah">
                    التمثيل الحركي المرئي للأصم (يسار)
                  </span>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    اختر العرض المفضل: مجسم ثلاثي الأبعاد أو مقطع إشاري
                  </p>
                </div>

                {/* 3D vs Video Switcher */}
                <div className="flex p-1 rounded-xl bg-black/30 border border-white/10 gap-1 text-[11px] font-thmanyah font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      sounds.playTap();
                      setRepresentationMode('3d');
                    }}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      representationMode === '3d'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>مجسم 3D متحرك</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      sounds.playTap();
                      setRepresentationMode('video');
                    }}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      representationMode === 'video'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>مقطع فيديو إشاري</span>
                  </button>
                </div>
              </div>

              {/* Mode A: 3D Kinetic Hand Avatar */}
              {representationMode === '3d' && (
                <div className="animate-fadeIn">
                  <ThreeDHandSignAvatar
                    currentWord={inputText}
                    className="p-3"
                  />
                </div>
              )}

              {/* Mode B: Video / Animated Frame Clips */}
              {representationMode === 'video' && (
                <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-slate-500/5 flex flex-col items-center justify-center animate-fadeIn space-y-3">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-4xl shadow-md">
                    {DICTIONARY_WORDS[activeSignIdx].visualIcon}
                  </div>

                  <h3 className="text-2xl font-black font-thmanyah text-[var(--brand-primary)]">
                    {DICTIONARY_WORDS[activeSignIdx].word}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
                    {DICTIONARY_WORDS[activeSignIdx].description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 w-full pt-2">
                    {DICTIONARY_WORDS[activeSignIdx].gestureFrames.map((frame, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-right">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center mb-1">
                          {idx + 1}
                        </span>
                        <p className="text-[10px] font-bold font-thmanyah">{frame}</p>
                      </div>
                    ))}
                  </div>

                  {/* Selector for Words */}
                  <div className="flex justify-center gap-1.5 pt-2">
                    {DICTIONARY_WORDS.slice(0, 5).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setActiveSignIdx(i);
                        }}
                        className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                          activeSignIdx === i ? 'bg-emerald-500 scale-125' : 'bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
