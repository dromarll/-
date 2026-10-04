import { useState, useRef, useEffect } from 'react';
import { MueenLogo } from './MueenLogo';
import { Camera, BookOpen, Home, Radio, Mic, Volume2, Sparkles, User, Video, VideoOff, Maximize2, Minimize2, Search, ArrowLeft, ArrowRight, ArrowLeftRight, Check, AlertTriangle, Building2, Utensils, Plane, Stethoscope, ShieldAlert, HeartPulse, Send, Play, RefreshCw, Eye, MessageSquare, ChevronLeft, MicOff } from 'lucide-react';
import { DICTIONARY_WORDS, SignWord } from '../data/mueenData';
import { SCENARIOS, Scenario, ScenarioAction, PATIENT_CASES, PatientCase } from '../data/scenariosData';
import { sounds } from '../utils/soundEffects';
import { useHaptics } from '../utils/haptics';

interface IPhone17AppPreviewProps {
  onOpenDictionaryModal?: () => void;
  onOpenRadarModal?: () => void;
}

// Internal Navigation States inside iPhone
type AppScreen =
  | 'gate' // The initial two-box entrance: [أصم] or [غير أصم / معافى]
  | 'deaf-hub' // Inside deaf portal (Visual-first: direct camera top, then doctor, restaurant, etc.)
  | 'deaf-doctor' // Deaf sending video/consultation to doctor
  | 'deaf-scenario' // Deaf inside restaurant, airport, bank, emergency
  | 'hearing-hub' // Inside hearing portal (Doctor, restaurant waiter, airport staff)
  | 'hearing-doctor' // Doctor clinical workspace with patients list & speech-to-sign converter
  | 'hearing-scenario' // Hearing person typing/speaking to convert to signs for deaf
  | 'dictionary' // Integrated sign dictionary
  | 'radar'; // Integrated audio radar

export function IPhone17AppPreview({ onOpenDictionaryModal, onOpenRadarModal }: IPhone17AppPreviewProps) {
  const haptics = useHaptics();

  // Current Screen inside iPhone (starts at the requested two-box Gate)
  const [screen, setScreen] = useState<AppScreen>('gate');

  // Breadcrumb history for back-arrow navigation
  const [screenHistory, setScreenHistory] = useState<AppScreen[]>([]);

  // Selected scenario and patient
  const [activeScenarioId, setActiveScenarioId] = useState<string>('restaurant');
  const [activePatientId, setActivePatientId] = useState<string>('p0');

  // User name (Triple name login as requested)
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mueen_user_name') || 'عمر سلمان الشمري';
    }
    return 'عمر سلمان الشمري';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tempNameInput, setTempNameInput] = useState('');

  // Fullscreen / True iPhone screen mode
  const [isImmersive, setIsImmersive] = useState(false);

  // Camera state for deaf video recording
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordedVideoSent, setRecordedVideoSent] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Hearing text-to-sign conversion state
  const [hearingInputText, setHearingInputText] = useState('تفضل بالجلوس، سنقوم بفحص الحنجرة والنبض فوراً');
  const [isConvertingToSigns, setIsConvertingToSigns] = useState(false);
  const [convertedSignsResult, setConvertedSignsResult] = useState<SignWord[]>([DICTIONARY_WORDS[0], DICTIONARY_WORDS[1]]);

  // Signs & Shutter inside deaf camera
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isShutterPressed, setIsShutterPressed] = useState(false);

  // Radar state inside iPhone
  const [isRadarMicActive, setIsRadarMicActive] = useState(false);
  const [radarDb, setRadarDb] = useState(42);
  const [radarDetectedMsg, setRadarDetectedMsg] = useState<string | null>(null);

  // Dictionary state inside iPhone
  const [dictSearch, setDictSearch] = useState('');

  const currentSign = DICTIONARY_WORDS[currentSignIndex];
  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[1];
  const activePatient = PATIENT_CASES.find((p) => p.id === activePatientId) || PATIENT_CASES[0];

  // Navigate to screen with history tracking
  const navigateTo = (nextScreen: AppScreen) => {
    haptics.selection();
    sounds.playTap();
    setScreenHistory((prev) => [...prev, screen]);
    setScreen(nextScreen);
  };

  // Back button in the top corner as requested by user
  const handleGoBack = () => {
    haptics.selection();
    sounds.playTap();
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory((h) => h.slice(0, -1));
      setScreen(prev);
    } else {
      setScreen('gate');
    }
  };

  // Speech helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  // Camera start/stop
  const startCamera = async () => {
    sounds.initCtx();
    sounds.playTap();
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing, width: { ideal: 720 }, height: { ideal: 1280 } }
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
      haptics.success();
    } catch {
      setIsCameraActive(true); // Fallback simulated video HUD
      haptics.light();
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
    haptics.light();
  };

  // Shutter press (Play sound + haptics + advance gesture + speak)
  const handleShutterPress = () => {
    haptics.cameraShutter();
    sounds.playShutter();
    setIsShutterPressed(true);

    setTimeout(() => {
      setIsShutterPressed(false);
      const nextIdx = (currentSignIndex + 1) % DICTIONARY_WORDS.length;
      setCurrentSignIndex(nextIdx);
      speakText(DICTIONARY_WORDS[nextIdx].word);
    }, 220);
  };

  // Send video message to doctor
  const handleRecordVideoToDoctor = () => {
    haptics.heavy();
    sounds.playTap();
    setIsRecordingVideo(true);

    setTimeout(() => {
      setIsRecordingVideo(false);
      setRecordedVideoSent(true);
      haptics.success();
      sounds.playAlert('radar');

      setTimeout(() => {
        setRecordedVideoSent(false);
      }, 4000);
    }, 2500);
  };

  // Hearing person converts text to signs
  const handleConvertTextToSigns = () => {
    haptics.medium();
    sounds.playTap();
    setIsConvertingToSigns(true);

    setTimeout(() => {
      setIsConvertingToSigns(false);
      const matched = DICTIONARY_WORDS.filter((w) =>
        hearingInputText.includes(w.word) || hearingInputText.includes(w.word.split(' ')[0])
      );
      setConvertedSignsResult(matched.length > 0 ? matched : [DICTIONARY_WORDS[0], DICTIONARY_WORDS[1]]);
      haptics.notification();
      speakText(hearingInputText);
    }, 1400);
  };

  // Toggle Radar inside iPhone
  const toggleRadarInsidePhone = () => {
    haptics.selection();
    sounds.playTap();
    if (isRadarMicActive) {
      setIsRadarMicActive(false);
      setRadarDetectedMsg(null);
    } else {
      setIsRadarMicActive(true);
      setRadarDb(44);
      setTimeout(() => {
        haptics.radarPing();
        sounds.playAlert('radar');
        setRadarDb(78);
        setRadarDetectedMsg('تم رصد نداء الاسم: "أحمد" في العيادة!');
      }, 1800);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <section id="iphone-app" className="py-12 sm:py-20 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تجربة تطبيق آيفون 17 الذكية</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-thmanyah tracking-tight">
            واجهة تطبيق الآيفون: بوابة الأصم وبوابة المعافى
          </h2>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5">
            تبدأ بمربعين للاختيار: بوابة الأصم (المرئية بالكاميرا والصور) أو بوابة المعافى/الطبيب (التحويل العصبي للصور).
          </p>

          {/* Fullscreen Mode Action */}
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => {
                haptics.medium();
                sounds.playTap();
                setIsImmersive(!isImmersive);
              }}
              className="lift-3d px-4 py-2 rounded-xl text-xs font-bold font-thmanyah flex items-center gap-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-md"
            >
              {isImmersive ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>العودة للمقاس المعتاد</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-emerald-500" />
                  <span>تكبير واجهة الآيفون (شاشة كاملة)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= iPhone 17 Frame ================= */}
        <div
          className={`relative transition-all duration-500 rounded-[54px] p-3.5 sm:p-4 bg-gradient-to-b from-[#2C2F37] via-[#1E2026] to-[#121316] border-[7px] border-[#464B56] shadow-2xl shadow-black/80 flex flex-col justify-between overflow-hidden select-none ${
            isImmersive
              ? 'w-full max-w-[490px] h-[890px]'
              : 'w-[340px] sm:w-[415px] h-[780px] lift-3d'
          }`}
        >
          {/* Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1C20]" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-300 font-bold">مُعِين</span>
            </div>
          </div>

          {/* Inner iOS Screen */}
          <div className="w-full h-full rounded-[42px] overflow-hidden flex flex-col justify-between bg-[#0A120E] text-white pt-8 pb-3 px-3 relative border border-white/10">
            {/* Top iOS App Bar: Back Arrow (سهم فوق بالزاوية) + Title */}
            <div className="flex items-center justify-between px-1 pb-2 border-b border-white/10 z-20">
              <div className="flex items-center gap-2">
                {/* Back Arrow button when inside any sub-screen */}
                {screen !== 'gate' && (
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-400 flex items-center gap-0.5 text-[11px] font-bold font-thmanyah"
                    title="الرجوع للواجهة السابقة"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <span>رجوع</span>
                  </button>
                )}

                <MueenLogo size="sm" showSubtitle={false} />
                <span className="text-xs font-black font-thmanyah text-white">
                  برنامج مُعِين
                </span>
              </div>

              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {screen === 'gate' ? 'مدخل البوابات' : screen.includes('deaf') ? 'بوابة الأصم' : 'بوابة المعافى'}
              </span>
            </div>

            {/* Welcoming Greeting Bar (حياك الله يا فلان، يا مرحبا) */}
            <div className="mx-1 mb-2 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-[10px] text-emerald-200 flex items-center justify-between font-thmanyah shadow-sm">
              <span className="truncate">
                حياك الله يا {userName}! يا مرحبا تراحيب المطر نورت مُعِين 🌿
              </span>
              <button
                type="button"
                onClick={() => {
                  setTempNameInput(userName);
                  setShowLoginModal(true);
                }}
                className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold shrink-0 underline mr-1 cursor-pointer"
              >
                تعديل الاسم
              </button>
            </div>

            {/* ================= 1. GATE ENTRANCE: مربعين للاختيار (أصم أو غير أصم / معافى) ================= */}
            {screen === 'gate' && (
              <div className="flex-1 flex flex-col justify-center py-2 space-y-3.5 animate-fadeIn text-center">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black font-thmanyah text-white">
                    يا هلا ومسهلا بك في مُعِين
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    اختر البوابة المناسبة لبدء التجربة المخصصة:
                  </p>
                </div>

                {/* The Two Distinct Entrance Cards (بدون أسهم، نظيفة وانسيابية) */}
                <div className="space-y-2.5 px-1">
                  {/* Card 1: بوابة أصم (مرئية بالكامل) */}
                  <div
                    onClick={() => navigateTo('deaf-hub')}
                    className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border-2 border-emerald-500/40 hover:border-emerald-400 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.01] flex items-center text-right group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                        🧏‍♂️
                      </div>
                      <div>
                        <h4 className="text-base font-black font-thmanyah text-white group-hover:text-emerald-300 transition-colors">
                          بوابة أصم
                        </h4>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          واجهة مرئية بالكامل · كاميرا مباشرة · صور وأيقونات واضحة
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: بوابة غير أصم / معافى (طبيب، نادل، موظف) */}
                  <div
                    onClick={() => navigateTo('hearing-hub')}
                    className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-950/80 to-slate-900/90 border-2 border-cyan-500/40 hover:border-cyan-400 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.01] flex items-center text-right group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                        🗣️
                      </div>
                      <div>
                        <h4 className="text-base font-black font-thmanyah text-white group-hover:text-cyan-300 transition-colors">
                          بوابة غير أصم / معافى
                        </h4>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          للأطباء والموظفين · كتابة وصوت يتحول تلقائياً لصور إشارية
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[9px] text-slate-400">
                  يمكنك الرجوع والتبديل في أي لحظة عبر زر السهم بالأعلى
                </p>
              </div>
            )}

            {/* ================= 2. DEAF HUB (بوابة أصم: كل شيء صور، أول شيء الكاميرا المباشرة ثم الأقسام) ================= */}
            {screen === 'deaf-hub' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2 animate-fadeIn overflow-hidden">
                {/* 1. الكاميرا المباشرة أولاً كما طلب المستخدم */}
                <div className="relative h-40 rounded-2xl bg-gradient-to-b from-[#13231B] to-[#0A120E] border border-white/10 overflow-hidden flex flex-col items-center justify-center p-2 text-center shrink-0">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`absolute inset-0 w-full h-full object-cover ${isCameraActive ? 'opacity-90' : 'hidden'}`}
                  />

                  {/* Live Sign HUD */}
                  <div className="relative z-10 flex flex-col items-center my-auto">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-2xl mb-1 animate-bounce">
                      {currentSign.visualIcon}
                    </div>
                    <span className="text-[9px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded-full">
                      تتبع الكف مباشر
                    </span>
                    <h4 className="text-xs font-black font-thmanyah text-white mt-1">
                      "{currentSign.word}"
                    </h4>
                  </div>

                  {/* Camera toggle and Shutter */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleShutterPress}
                      className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center shadow-lg ${
                        isShutterPressed ? 'bg-emerald-600 scale-90' : 'bg-emerald-500'
                      }`}
                      title="التقاط الإشارة"
                    >
                      <Camera className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={isCameraActive ? stopCamera : startCamera}
                      className="px-2 py-1 rounded-lg text-[9px] font-bold bg-black/70 border border-white/20 text-white"
                    >
                      {isCameraActive ? 'إيقاف' : 'تشغيل الكاميرا'}
                    </button>
                  </div>
                </div>

                {/* 2. باقي الأقسام المرئية الكبيرة (نزول وطلوع انسيابي بدون أي أسهم مزعجة) */}
                <div className="space-y-1 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-bold font-thmanyah text-slate-300">
                      الأقسام المرئية (مرّر للأسفل لاستعراض كافة المواضع):
                    </p>
                    <span className="text-[8px] font-mono text-emerald-400">نزول وطلوع حر</span>
                  </div>

                  {/* Comprehensive Scrollable Grid: Doctor + All 9 Scenarios (بدون أسهم) */}
                  <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 flex-1 max-h-[230px]">
                    {/* تواصل مع الطبيب (يرسل للطبيب مقطع فيديو) */}
                    <div
                      onClick={() => navigateTo('deaf-doctor')}
                      className="p-3 rounded-2xl bg-[#14231B] border border-emerald-500/30 hover:border-emerald-400 cursor-pointer flex flex-col items-center justify-center text-center transition-all hover:scale-[1.01]"
                    >
                      <span className="text-2xl mb-1">👨‍⚕️</span>
                      <h5 className="text-xs font-black font-thmanyah text-white">تواصل مع الطبيب</h5>
                      <span className="text-[8px] text-emerald-300 font-medium mt-0.5">تصوير مقطع للشكوى</span>
                    </div>

                    {/* All Scenarios (المطعم، المطار، الطوارئ، الصيدلية، السوبرماركت، الجامعة، محطة الوقود، المسجد، البنك) */}
                    {SCENARIOS.filter((s) => s.id !== 'clinic').map((sc) => (
                      <div
                        key={sc.id}
                        onClick={() => {
                          setActiveScenarioId(sc.id);
                          navigateTo('deaf-scenario');
                        }}
                        className="p-3 rounded-2xl bg-[#131922] border border-white/10 hover:border-emerald-400 cursor-pointer flex flex-col items-center justify-center text-center transition-all hover:scale-[1.01]"
                      >
                        <span className="text-2xl mb-1">{sc.icon}</span>
                        <h5 className="text-xs font-black font-thmanyah text-white">{sc.title}</h5>
                        <span className="text-[8px] text-slate-300 font-medium mt-0.5 line-clamp-1">{sc.tagline}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= 3. DEAF DOCTOR VIEW (تصوير مقطع فيديو استشارة وإرساله للطبيب) ================= */}
            {screen === 'deaf-doctor' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2 animate-fadeIn overflow-hidden">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">👨‍⚕️</span>
                    <span className="text-xs font-bold font-thmanyah">إرسال استشارة فيديو للطبيب</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400">حفظ الخصوصية</span>
                </div>

                {/* Video Recording Viewport */}
                <div className="relative flex-1 rounded-2xl bg-black border border-emerald-500/30 overflow-hidden flex flex-col items-center justify-center p-3 text-center">
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-5xl animate-bounce mb-2">📹</span>
                    <h4 className="text-sm font-black font-thmanyah text-white">
                      {isRecordingVideo ? 'جاري تصوير مقطع لغة الإشارة...' : 'وجه الكاميرا وصوّر مقطع الإشارة'}
                    </h4>
                    <p className="text-[10px] text-slate-300 max-w-[220px] mt-1">
                      يشرح شكواك للطبيب ويحولها فورياً إلى نص وتشخيص سري
                    </p>
                  </div>

                  {isRecordingVideo && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[9px] font-mono animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>REC 00:03</span>
                    </div>
                  )}

                  {recordedVideoSent && (
                    <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center p-4 text-center animate-fadeIn z-30">
                      <Check className="w-12 h-12 text-emerald-400 mb-2" />
                      <p className="text-sm font-black font-thmanyah text-white">
                        تم إرسال المقطع للطبيب بنجاح!
                      </p>
                      <p className="text-[10px] text-emerald-200 mt-1">
                        يقوم د. وليد بمراجعة الفيديو والرد بالإشارات والنطق
                      </p>
                    </div>
                  )}
                </div>

                {/* Record Button */}
                <div className="pt-1 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleRecordVideoToDoctor}
                    disabled={isRecordingVideo}
                    className={`w-full py-2.5 rounded-xl font-bold font-thmanyah text-xs text-white flex items-center justify-center gap-2 shadow-lg ${
                      isRecordingVideo ? 'bg-rose-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{isRecordingVideo ? 'جاري التسجيل...' : 'بدء تسجيل مقطع الشكوى للطبيب'}</span>
                  </button>
                  <p className="text-[9px] text-slate-400 mt-1">
                    يحفظ خصوصيتك الطبية دون الحاجة لمترجم بشري
                  </p>
                </div>
              </div>
            )}

            {/* ================= 4. DEAF SCENARIO VIEW (المطعم، المطار، الطوارئ - بطاقات صورية للأصم) ================= */}
            {screen === 'deaf-scenario' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2 animate-fadeIn overflow-hidden">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{activeScenario.icon}</span>
                    <span className="text-xs font-bold font-thmanyah">{activeScenario.title}</span>
                  </div>
                  <span className="text-[9px] text-emerald-300">أوامر مرئية سريعة</span>
                </div>

                {/* Large visual cards for Deaf Person */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px]">
                  {activeScenario.actions.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => {
                        haptics.medium();
                        sounds.playTap();
                        speakText(act.deafPrompt);
                      }}
                      className="p-3 rounded-2xl bg-[#14201A] border border-white/10 hover:border-emerald-400 cursor-pointer flex items-center justify-between transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{act.visualSign}</span>
                        <div>
                          <p className="text-xs font-black font-thmanyah text-white">{act.label}</p>
                          <div className="w-8 h-[1px] bg-emerald-500/40 my-1" />
                          <p className="text-[10px] text-emerald-300">🗣️ يقرأ وينطق: "{act.deafPrompt}"</p>
                        </div>
                      </div>
                      <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= 5. HEARING HUB (بوابة غير أصم: عيادة الطبيب، المطعم، المطار) ================= */}
            {screen === 'hearing-hub' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-3 animate-fadeIn overflow-hidden">
                <div className="space-y-0.5 text-right">
                  <h4 className="text-xs font-black font-thmanyah text-white">
                    بوابة الطبيب والموظف والمعافى
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    اكتب أو تحدث، وسيقوم التطبيق بالتحويل العصبي إلى صور إشارية للأصم:
                  </p>
                </div>

                <div className="space-y-2">
                  {/* عيادة الطبيب واستقبال المرضى */}
                  <div
                    onClick={() => navigateTo('hearing-doctor')}
                    className="p-3.5 rounded-2xl bg-[#14232B] border border-cyan-500/40 hover:border-cyan-300 cursor-pointer flex items-center justify-between text-right transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🩺</span>
                      <div>
                        <h5 className="text-xs font-black font-thmanyah text-white">عيادة الطبيب واستقبال المرضى</h5>
                        <p className="text-[9px] text-cyan-300 mt-0.5">
                          تواصل مع المرضى (انقطاع الصوت، باطنية، أسنان) وتحويل التوجيهات لصور
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* موظف المطعم والمقهى */}
                  <div
                    onClick={() => {
                      setActiveScenarioId('restaurant');
                      navigateTo('hearing-scenario');
                    }}
                    className="p-3.5 rounded-2xl bg-[#231E14] border border-amber-500/40 hover:border-amber-300 cursor-pointer flex items-center justify-between text-right transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🍽️</span>
                      <div>
                        <h5 className="text-xs font-black font-thmanyah text-white">خدمة المطعم والطلبات</h5>
                        <p className="text-[9px] text-amber-300 mt-0.5">
                          كتابة تفاصيل الطلب والحساب وتحويلها لإشارات مرئية للأصم
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* موظف المطار والخدمات */}
                  <div
                    onClick={() => {
                      setActiveScenarioId('airport');
                      navigateTo('hearing-scenario');
                    }}
                    className="p-3.5 rounded-2xl bg-[#141D26] border border-blue-500/40 hover:border-blue-300 cursor-pointer flex items-center justify-between text-right transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">✈️</span>
                      <div>
                        <h5 className="text-xs font-black font-thmanyah text-white">إرشادات المطار والسفر</h5>
                        <p className="text-[9px] text-blue-300 mt-0.5">
                          توجيه الأصم لرقم البوابة والصعود للأمتعة
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 6. HEARING DOCTOR (المرضى + التحويل إلى صور إشارية) ================= */}
            {screen === 'hearing-doctor' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2 animate-fadeIn overflow-hidden">
                {/* Patient Cases Tabs */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold font-thmanyah text-slate-300 px-1">
                    <span>قائمة المرضى في العيادة:</span>
                    <span className="text-cyan-400 font-mono">4 حالات</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {PATIENT_CASES.map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => {
                          haptics.selection();
                          sounds.playTap();
                          setActivePatientId(pt.id);
                          setHearingInputText(pt.doctorResponse);
                        }}
                        className={`p-2 rounded-xl border text-right transition-all ${
                          activePatientId === pt.id
                            ? 'border-cyan-400 bg-cyan-950/60 text-white'
                            : 'border-white/10 bg-black/40 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{pt.visualSign}</span>
                          <div>
                            <p className="text-[10px] font-bold truncate font-thmanyah">{pt.name}</p>
                            <span className="text-[8px] text-cyan-300 block">{pt.status}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient Selected Detail */}
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-right space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-slate-400">
                    <span className="font-bold text-white">{activePatient.clinic}</span>
                    <span className="font-mono text-cyan-400">نبض: {activePatient.vitals.heartRate} bpm</span>
                  </div>
                  <p className="text-[10px] text-rose-300 font-bold">
                    الشكوى: "{activePatient.deafMessage}"
                  </p>
                  {activePatient.conditionHighlight && (
                    <p className="text-[8px] text-emerald-300">{activePatient.conditionHighlight}</p>
                  )}
                </div>

                {/* Writing input box & Convert to Signs button */}
                <div className="space-y-1.5">
                  <textarea
                    rows={2}
                    value={hearingInputText}
                    onChange={(e) => setHearingInputText(e.target.value)}
                    placeholder="اكتب التوجيهات الطبية للمريض..."
                    className="w-full p-2 text-xs rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleConvertTextToSigns}
                    disabled={isConvertingToSigns}
                    className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold font-thmanyah text-xs text-white flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {isConvertingToSigns ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري التحويل العصبي إلى صور إشارية...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>تحويل كلام الطبيب إلى صور إشارية للمريض</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Converted Signs Visual Cards Result */}
                <div className="p-2 rounded-xl bg-[#101A24] border border-cyan-500/30 flex items-center gap-2 overflow-x-auto">
                  {convertedSignsResult.map((sign, idx) => (
                    <div key={idx} className="p-1.5 rounded-lg bg-black/50 border border-white/10 shrink-0 text-center min-w-[70px]">
                      <span className="text-xl">{sign.visualIcon}</span>
                      <p className="text-[9px] font-bold text-white font-thmanyah truncate">{sign.word}</p>
                    </div>
                  ))}
                  <span className="text-[9px] text-cyan-300 font-bold shrink-0">معروضة للمريض الآن</span>
                </div>
              </div>
            )}

            {/* ================= 7. HEARING SCENARIO VIEW ================= */}
            {screen === 'hearing-scenario' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2 animate-fadeIn overflow-hidden">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{activeScenario.icon}</span>
                    <span className="text-xs font-bold font-thmanyah">{activeScenario.title}</span>
                  </div>
                  <span className="text-[9px] text-cyan-300">تحويل رد الموظف لصور</span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <p className="text-[10px] text-slate-300">اختر عبارة جاهزة أو اكتب للعميل الأصم:</p>
                  <div className="space-y-1.5">
                    {activeScenario.actions.map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => {
                          setHearingInputText(act.hearingResponse);
                          handleConvertTextToSigns();
                        }}
                        className="w-full text-right p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 text-[10px] text-white font-bold flex items-center justify-between"
                      >
                        <span>{act.label}</span>
                        <span className="text-cyan-300 font-mono text-[9px]">تحويل لإشارة</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-center">
                  <p className="text-[10px] text-cyan-200 font-thmanyah">
                    "{hearingInputText}"
                  </p>
                </div>
              </div>
            )}

            {/* ================= 8. DICTIONARY INSIDE IPHONE ================= */}
            {screen === 'dictionary' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2 animate-fadeIn overflow-hidden">
                <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold font-thmanyah">قاموس لغة الإشارة المعتمد</span>
                </div>

                <div className="relative">
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={dictSearch}
                    onChange={(e) => setDictSearch(e.target.value)}
                    placeholder="ابحث بالقاموس..."
                    className="w-full pr-8 pl-2 py-1.5 text-xs rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[360px]">
                  {DICTIONARY_WORDS.filter((w) => w.word.includes(dictSearch) || w.description.includes(dictSearch)).map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        haptics.selection();
                        sounds.playTap();
                        setCurrentSignIndex(idx);
                        speakText(item.word);
                      }}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-emerald-400 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.visualIcon}</span>
                        <div>
                          <p className="text-xs font-bold font-thmanyah text-white">{item.word}</p>
                          <p className="text-[9px] text-slate-400 line-clamp-1">{item.handShape}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold">عرض بالهاتف</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= 9. RADAR INSIDE IPHONE ================= */}
            {screen === 'radar' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-3 animate-fadeIn text-center">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold font-thmanyah">رادار الصم الحساس للمايك</span>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                    استشعار بيئي
                  </span>
                </div>

                <div className="relative w-40 h-40 mx-auto my-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-cyan-500/30" />
                  <div className="absolute inset-6 rounded-full border border-cyan-500/20" />
                  <div className="absolute inset-12 rounded-full border border-cyan-500/30" />

                  {isRadarMicActive && (
                    <div className="absolute inset-0 rounded-full overflow-hidden animate-radar-sweep pointer-events-none">
                      <div className="w-1/2 h-1/2 origin-bottom-right bg-gradient-to-tr from-cyan-400/50 to-transparent" />
                    </div>
                  )}

                  <div className="relative z-10 w-16 h-16 rounded-full bg-slate-900 border border-cyan-500/40 flex flex-col items-center justify-center">
                    <Radio className={`w-5 h-5 text-cyan-400 ${isRadarMicActive ? 'animate-pulse' : ''}`} />
                    <span className="text-[10px] font-mono font-bold mt-0.5">{radarDb} dB</span>
                  </div>
                </div>

                {radarDetectedMsg && (
                  <div className="p-2 rounded-xl bg-rose-950/70 border border-rose-500/40 text-[10px] text-rose-200 font-bold animate-bounce">
                    <AlertTriangle className="w-3.5 h-3.5 inline ml-1" />
                    <span>{radarDetectedMsg}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={toggleRadarInsidePhone}
                  className={`w-full py-2 rounded-xl text-xs font-bold font-thmanyah transition-colors ${
                    isRadarMicActive ? 'bg-rose-600 text-white' : 'bg-cyan-600 text-white shadow-md'
                  }`}
                >
                  {isRadarMicActive ? 'إيقاف استشعار المايك' : 'تفعيل رادار المايك بالهاتف'}
                </button>
              </div>
            )}

            {/* ================= iOS BOTTOM DOCK (قاموس · الرئيسية · رادار) ================= */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-around text-center text-[10px] font-thmanyah z-20">
              <button
                type="button"
                onClick={() => navigateTo('dictionary')}
                className={`flex flex-col items-center gap-1 transition-all ${
                  screen === 'dictionary' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  screen === 'dictionary' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5'
                }`}>
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span>قاموس</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('gate')}
                className={`flex flex-col items-center gap-1 transition-all ${
                  screen === 'gate' || screen.includes('hub') ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  screen === 'gate' || screen.includes('hub') ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/5'
                }`}>
                  <Home className="w-3.5 h-3.5" />
                </div>
                <span>الرئيسية</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('radar')}
                className={`flex flex-col items-center gap-1 transition-all ${
                  screen === 'radar' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  screen === 'radar' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/5'
                }`}>
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <span>رادار</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= Triple Name Registration Modal (تسجيل الدخول بالاسم الثلاثي) ================= */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl border border-emerald-500/40 bg-[#0E1713] p-6 text-white text-center shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                🌿
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black font-thmanyah text-white">
                  تسجيل الدخول في برنامج مُعِين
                </h3>
                <p className="text-xs text-slate-300">
                  فضلاً اكتب اسمك الثلاثي الكريم لتخصيص التجربة والترحيب بك:
                </p>
              </div>

              <div className="text-right space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 font-thmanyah">
                  الاسم الثلاثي:
                </label>
                <input
                  type="text"
                  value={tempNameInput}
                  onChange={(e) => setTempNameInput(e.target.value)}
                  placeholder="مثال: عمر سلمان الشمري"
                  className="w-full p-2.5 text-xs rounded-xl bg-black/60 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-thmanyah text-xs">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const trimmed = tempNameInput.trim();
                    if (trimmed) {
                      setUserName(trimmed);
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('mueen_user_name', trimmed);
                      }
                      haptics.success();
                      sounds.playTap();
                      sounds.speakArabic(`حياك الله يا ${trimmed}! يا مرحبا بك في برنامج معين`);
                    }
                    setShowLoginModal(false);
                  }}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md"
                >
                  دخول وتأكيد
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
