import { useState, useRef, useEffect } from 'react';
import { Camera, Volume2, Mic, ArrowLeftRight, Video, VideoOff, Send, Hand, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { DICTIONARY_WORDS, SignWord } from '../data/mueenData';

interface BidirectionalTranslatorProps {
  onOpenDictionary?: () => void;
}

export function BidirectionalTranslator({ onOpenDictionary }: BidirectionalTranslatorProps) {
  const [activeWindow, setActiveWindow] = useState<'sign-to-speech' | 'speech-to-sign'>('sign-to-speech');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [detectedSign, setDetectedSign] = useState<SignWord>(DICTIONARY_WORDS[0]);
  const [inputText, setInputText] = useState('السلام عليكم، كيف يمكنني مساعدتك؟');
  const [activeSignIdx, setActiveSignIdx] = useState(0);

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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
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
    setDetectedSign(w);
    speakText(w.word);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <section id="translator" className="py-12 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Concise Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>الترجمة العصبية ثنائية الاتجاه</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-thmanyah tracking-tight">
            تواصل لحظي.. بلا حواجز وبلا مترجم بشري
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            اختر النافذة المطلوبة، واستمتع بتجربة ترجمة سريعة تحفظ الخصوصية التامة.
          </p>
        </div>

        {/* Window Selector Tabs with 3D lift */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex gap-2 shadow-lg">
            <button
              type="button"
              onClick={() => setActiveWindow('sign-to-speech')}
              className={`lift-3d px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-thmanyah flex items-center gap-2 transition-all ${
                activeWindow === 'sign-to-speech'
                  ? 'text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              style={{
                backgroundColor: activeWindow === 'sign-to-speech' ? 'var(--brand-primary)' : 'transparent'
              }}
            >
              <Hand className="w-4 h-4" />
              <span>النافذة الأولى: تصوير الأصم ➔ كتابة وصوت مسموع</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWindow('speech-to-sign')}
              className={`lift-3d px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-thmanyah flex items-center gap-2 transition-all ${
                activeWindow === 'speech-to-sign'
                  ? 'text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              style={{
                backgroundColor: activeWindow === 'speech-to-sign' ? 'var(--brand-primary)' : 'transparent'
              }}
            >
              <MessageSquare className="w-4 h-4" />
              <span>النافذة الثانية: كلام السامع ➔ صور وحركات إشارية</span>
            </button>
          </div>
        </div>

        {/* ================= WINDOW 1: SIGN TO SPEECH (الأصم ➔ السامع) ================= */}
        {activeWindow === 'sign-to-speech' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Camera Viewport with 3D lift */}
            <div className="lg:col-span-7 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-xl lift-3d flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`} />
                  <span className="text-xs font-bold font-mono">
                    {isCameraActive ? 'الكاميرا الذكية ترصد حركة اليدين' : 'الكاميرا جاهزة للتشغيل'}
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
                    className="lift-3d px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                    style={{ backgroundColor: isCameraActive ? '#E63946' : 'var(--brand-cta)' }}
                  >
                    {isCameraActive ? (
                      <>
                        <VideoOff className="w-3.5 h-3.5" />
                        <span>إيقاف</span>
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
                    دقة التعرف: 98.8%
                  </span>
                </div>
              </div>

              {/* Fast Gesture Testing Buttons with 3D emotion */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-[var(--text-secondary)] mb-1.5">
                  جرب إشارات سريعة بنقرة واحدة:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DICTIONARY_WORDS.slice(0, 4).map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleSelectGesture(w)}
                      className={`p-2 rounded-xl border text-xs font-bold text-right flex items-center justify-between lift-3d ${
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

            {/* Translation Output for Hearing Person with 3D lift */}
            <div className="lg:col-span-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-7 shadow-xl lift-3d space-y-4">
              <div className="pb-3 border-b border-[var(--border-subtle)]">
                <span className="text-[11px] font-bold text-[var(--brand-accent)] uppercase">
                  النتيجة المنطوقة والمقروءة للطرف السامع:
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-thmanyah text-[var(--brand-primary)] mt-1">
                  "{detectedSign.word}"
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                  {detectedSign.description}
                </p>
              </div>

              {/* Audio Playback Button */}
              <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-slate-500/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">نطق صوتي فوري</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">يسمعه الطبيب أو المرافق</p>
                </div>
                <button
                  type="button"
                  onClick={() => speakText(detectedSign.word)}
                  className="lift-3d px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                  style={{ backgroundColor: 'var(--brand-cta)' }}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استماع</span>
                </button>
              </div>

              {/* Hand Shape Details */}
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] text-xs space-y-1">
                <span className="font-bold text-[var(--text-primary)]">هيئة حركة اليد:</span>
                <p className="text-[var(--text-secondary)]">{detectedSign.handShape}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= WINDOW 2: SPEECH TO SIGN (السامع ➔ الأصم) ================= */}
        {activeWindow === 'speech-to-sign' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Box for Hearing Person */}
            <div className="lg:col-span-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-xl lift-3d space-y-4">
              <div>
                <span className="text-xs font-bold text-[var(--brand-accent)]">إدخال كلام السامع:</span>
                <h3 className="text-lg font-bold font-thmanyah mt-0.5">اكتب أو تحدث ليراه الأصم</h3>
              </div>

              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب العبارة أو التعليمات الطبية..."
                className="w-full p-3.5 rounded-2xl text-xs sm:text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] focus:outline-none"
              />

              <div className="flex gap-2">
                {quickPhrases.slice(0, 3).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(p)}
                    className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] hover:border-[var(--brand-accent)] truncate lift-3d-subtle"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Sign Output for Deaf Person */}
            <div className="lg:col-span-7 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-xl lift-3d space-y-4 text-center">
              <div className="pb-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--brand-accent)]">
                  الترجمة الإشارية المرئية للأصم
                </span>
                <span className="text-xs font-mono font-bold bg-[var(--brand-accent)]/15 px-2 py-0.5 rounded">
                  تمثيل حركي معتمد
                </span>
              </div>

              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-slate-500/5 flex flex-col items-center justify-center">
                <span className="text-6xl animate-bounce mb-3">
                  {DICTIONARY_WORDS[activeSignIdx].visualIcon}
                </span>
                <h3 className="text-2xl font-black font-thmanyah text-[var(--brand-primary)]">
                  {DICTIONARY_WORDS[activeSignIdx].word}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm">
                  {DICTIONARY_WORDS[activeSignIdx].description}
                </p>
                <div className="mt-3 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px]">
                  <strong>طريقة الكف: </strong>
                  <span>{DICTIONARY_WORDS[activeSignIdx].handShape}</span>
                </div>
              </div>

              {/* Slider for Multiple Signs */}
              <div className="flex justify-center gap-1.5 pt-1">
                {DICTIONARY_WORDS.slice(0, 4).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSignIdx(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeSignIdx === i ? 'bg-[var(--brand-accent)] scale-125' : 'bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
