import { useState, useRef, useEffect } from 'react';
import { MueenLogo } from './MueenLogo';
import { ThreeDHandSignAvatar } from './ThreeDHandSignAvatar';
import { Camera, BookOpen, Home, Radio, Mic, Volume2, Sparkles, User, Video, VideoOff, Maximize2, Minimize2, Search, ArrowLeft, ArrowRight, ArrowLeftRight, Check, AlertTriangle, Building2, Utensils, Plane, Stethoscope, ShieldAlert, HeartPulse, Send, Play, RefreshCw, Eye, MessageSquare, ChevronLeft, MicOff, Car, Bell, Flashlight, Compass } from 'lucide-react';
import { DICTIONARY_WORDS, SignWord } from '../data/mueenData';
import { SCENARIOS, Scenario, ScenarioAction, PATIENT_CASES, PatientCase } from '../data/scenariosData';
import { sounds } from '../utils/soundEffects';
import { useHaptics } from '../utils/haptics';

interface IPhone17AppPreviewProps {
  onOpenDictionaryModal?: () => void;
  onOpenRadarModal?: () => void;
  onOpenCarPlayModal?: () => void;
  isFullscreenOpen?: boolean;
  onToggleFullscreen?: (open: boolean) => void;
}

// Internal Navigation States inside iPhone
type AppScreen =
  | 'gate' // The initial entrance: [أصم] or [غير أصم / معافى / طبيب]
  | 'deaf-hub' // Inside deaf portal (Visual-first: direct camera top, then doctor, restaurant, etc.)
  | 'deaf-doctor' // Deaf sending video/consultation to doctor
  | 'deaf-scenario' // Deaf inside restaurant, airport, bank, emergency
  | 'hearing-hub' // Inside hearing portal (Visitor, Doctor, restaurant waiter, airport staff)
  | 'hearing-doctor' // Doctor clinical workspace with patients list & speech-to-sign converter
  | 'hearing-scenario' // Hearing person typing/speaking to convert to signs for deaf
  | 'doctor-camera-hud' // NEW: Independent fullscreen camera view just like the native Camera app
  | 'visitor-mode' // NEW: Comprehensive visitor perceptual interface (what the visitor captures)
  | 'car-mode' // NEW: Apple CarPlay integration with red emergency light and Adhan alert
  | 'prayer-times' // NEW: Dedicated prayer times & visual adhan portal for deaf
  | 'dictionary' // Integrated sign dictionary
  | 'radar'; // Integrated audio radar

export function IPhone17AppPreview({ onOpenDictionaryModal, onOpenRadarModal, onOpenCarPlayModal, isFullscreenOpen, onToggleFullscreen }: IPhone17AppPreviewProps) {
  const haptics = useHaptics();

  // Current Screen inside iPhone (starts at the requested two-box Gate)
  const [screen, setScreen] = useState<AppScreen>('gate');

  // Breadcrumb history for back-arrow navigation
  const [screenHistory, setScreenHistory] = useState<AppScreen[]>([]);

  // Selected scenario and patient
  const activeScenarioId_default = 'restaurant';
  const [activeScenarioId, setActiveScenarioId] = useState<string>(activeScenarioId_default);
  const [activePatientId, setActivePatientId] = useState<string>('p0');

  // New Doctor Camera & Reverse 3D Hand states
  const [doctorRecognizedSign, setDoctorRecognizedSign] = useState<SignWord>(DICTIONARY_WORDS[1]);
  const [doctorTypedText, setDoctorTypedText] = useState('افتح فمك واسترخِ للفحص الطبي');
  const [doctorShowHandPair, setDoctorShowHandPair] = useState(false);
  const [isDoctorFlashOn, setIsDoctorFlashOn] = useState(false);

  // Visitor mode states (what the visitor picks up)
  const [visitorTestMode, setVisitorTestMode] = useState<'signs-to-speech' | 'speech-to-signs' | 'ambient'>('signs-to-speech');
  const [visitorCapturedSpeech, setVisitorCapturedSpeech] = useState<string>('تفضل بالدخول، دكتور عمر بانتظارك في العيادة');
  const [visitorAmbientEvent, setVisitorAmbientEvent] = useState<string | null>(null);

  // Car Mode & CarPlay states
  const [carFlashingBeacon, setCarFlashingBeacon] = useState(false);
  const [carActiveAlert, setCarActiveAlert] = useState<'ambulance' | 'car-horn' | 'adhan' | null>(null);
  const [carAlertMessage, setCarAlertMessage] = useState('');
  const [carAdhanAlert, setCarAdhanAlert] = useState(false);

  // Dictionary inside phone state
  const [selectedDictWord, setSelectedDictWord] = useState<SignWord | null>(null);

  // User name (Triple name login as requested)
  const [userName, setUserName] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('mueen_user_name') || 'عمر سلمان الشمري';
      }
    } catch {
      return 'عمر سلمان الشمري';
    }
    return 'عمر سلمان الشمري';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tempNameInput, setTempNameInput] = useState('');

  // Fullscreen / True iPhone screen mode
  const [internalImmersive, setInternalImmersive] = useState(false);
  const isImmersive = isFullscreenOpen !== undefined ? isFullscreenOpen : internalImmersive;
  const setImmersive = (val: boolean) => {
    setInternalImmersive(val);
    if (onToggleFullscreen) onToggleFullscreen(val);
  };

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

  // Natural Arabic Speech helper (Gemini-clarity)
  const speakText = (text: string) => {
    sounds.speakArabic(text);
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
                setImmersive(!isImmersive);
              }}
              className="lift-3d px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-thmanyah flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 shadow-md cursor-pointer transition-all"
            >
              {isImmersive ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>العودة للمقاس المعتاد</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                  <span>تكبير واجهة الآيفون (دخول وضع الشاشة الكاملة)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= iPhone 17 Frame / Fullscreen Takeover ================= */}
        <div
          className={`relative transition-all duration-500 overflow-hidden select-none ${
            isImmersive
              ? 'fixed inset-0 z-50 rounded-none border-none p-0 bg-[#070D0A] flex flex-col justify-between'
              : 'w-[340px] sm:w-[415px] h-[780px] rounded-[54px] p-3.5 sm:p-4 bg-gradient-to-b from-[#2C2F37] via-[#1E2026] to-[#121316] border-[7px] border-[#464B56] shadow-2xl shadow-black/80 flex flex-col justify-between lift-3d'
          }`}
        >
          {/* Dynamic Island (Only in framed phone preview) */}
          {!isImmersive && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1A1C20]" />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-300 font-bold">مُعِين</span>
              </div>
            </div>
          )}

          {/* Inner iOS Screen */}
          <div className={`w-full h-full overflow-hidden flex flex-col justify-between bg-[#0A120E] text-white relative ${
            isImmersive
              ? 'rounded-none pt-2 pb-2 px-3 sm:px-6 max-w-4xl mx-auto'
              : 'rounded-[42px] pt-8 pb-3 px-3 border border-white/10'
          }`}>
            {/* Top iOS App Bar: Back Arrow + Title + Maximize/Minimize */}
            <div className="flex items-center justify-between px-1 pb-2 border-b border-white/10 z-20">
              <div className="flex items-center gap-2">
                {/* Back Arrow button when inside any sub-screen */}
                {screen !== 'gate' && (
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="p-1 sm:px-2 sm:py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-400 flex items-center gap-1 text-[11px] font-bold font-thmanyah cursor-pointer"
                    title="الرجوع للواجهة السابقة"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <span>رجوع للبوابات</span>
                  </button>
                )}

                <MueenLogo size="sm" showSubtitle={false} />
                <span className="text-xs sm:text-sm font-black font-thmanyah text-white">
                  برنامج مُعِين
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {screen === 'gate' ? 'مدخل البوابات' : screen.includes('deaf') ? 'بوابة الأصم' : 'بوابة المعافى'}
                </span>

                {/* Fullscreen Toggle Button in the Top Bar */}
                <button
                  type="button"
                  onClick={() => {
                    haptics.medium();
                    sounds.playTap();
                    setImmersive(!isImmersive);
                  }}
                  className={`p-1 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold font-thmanyah transition-colors cursor-pointer border ${
                    isImmersive
                      ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                  }`}
                  title={isImmersive ? 'تصغير الشاشة' : 'تكبير لشاشة كاملة'}
                >
                  {isImmersive ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>✕ خروج من التطبيق</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>تكبير</span>
                    </>
                  )}
                </button>
              </div>
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

            {/* ================= 1. GATE ENTRANCE ================= */}
            {screen === 'gate' && (
              <div className={`flex-1 flex flex-col justify-between py-2 space-y-3 animate-fadeIn text-center ${isImmersive ? 'max-w-4xl mx-auto my-auto py-6' : ''}`}>
                <div className="space-y-1">
                  {isImmersive && (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>واجهة التطبيق التفاعلية الكاملة · رؤية 2030</span>
                    </div>
                  )}
                  <h3 className={`${isImmersive ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'} font-black font-thmanyah text-white`}>
                    يا هلا ومسهلا بك في مُعِين
                  </h3>
                  <p className={`${isImmersive ? 'text-xs sm:text-sm max-w-md mx-auto' : 'text-[11px]'} text-slate-300`}>
                    اختر البوابة المناسبة لبدء التجربة المخصصة:
                  </p>
                </div>

                {/* Arab Flags Showcase (مع الأعلام الأربعة: 🇸🇴 الصومال 🇲🇷 موريتانيا 🇩🇯 جيبوتي 🇰🇲 جزر القمر) */}
                <div className="px-2 py-1.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 font-bold font-thmanyah">الدول العربية المعتمدة:</span>
                  <div className="flex items-center gap-1 text-sm overflow-x-auto py-0.5">
                    <span title="السعودية">🇸🇦</span>
                    <span title="الإمارات">🇦🇪</span>
                    <span title="الكويت">🇰🇼</span>
                    <span title="قطر">🇶🇦</span>
                    <span title="مصر">🇪🇬</span>
                    <span title="الصومال (مضاف حديثاً)" className="ring-1 ring-emerald-400 rounded">🇸🇴</span>
                    <span title="موريتانيا (مضاف حديثاً)" className="ring-1 ring-emerald-400 rounded">🇲🇷</span>
                    <span title="جيبوتي (مضاف حديثاً)" className="ring-1 ring-emerald-400 rounded">🇩🇯</span>
                    <span title="جزر القمر (مضاف حديثاً)" className="ring-1 ring-emerald-400 rounded">🇰🇲</span>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-300">22 دولة 🌐</span>
                </div>

                {/* The 3 Main Gate Portals */}
                <div className={`space-y-2 px-1 overflow-y-auto max-h-[380px] ${isImmersive ? 'grid grid-cols-1 md:grid-cols-3 gap-3 space-y-0 max-h-none' : ''}`}>
                  {/* Card 1: بوابة أصم (مرئية بالكامل) */}
                  <div
                    onClick={() => navigateTo('deaf-hub')}
                    className={`${isImmersive ? 'p-5 rounded-3xl' : 'p-3 rounded-2xl'} bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border-2 border-emerald-500/40 hover:border-emerald-400 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.01] flex items-center text-right group`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                        🧏‍♂️
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-black font-thmanyah text-white group-hover:text-emerald-300 transition-colors">
                            بوابة أصم
                          </h4>
                          <span className="text-[10px] text-emerald-400 font-bold">دخول ←</span>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                          مرئية بالكامل · الكاميرا أولاً · استشارة فيديو مع الطبيب · 14 موضعاً للحياة اليومية
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: بوابة غير أصم / المعافى (الزائر) */}
                  <div
                    onClick={() => navigateTo('visitor-mode')}
                    className={`${isImmersive ? 'p-5 rounded-3xl' : 'p-3 rounded-2xl'} bg-gradient-to-r from-blue-950/80 to-slate-900/90 border-2 border-cyan-500/40 hover:border-cyan-400 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.01] flex items-center text-right group`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                        👂
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-black font-thmanyah text-white group-hover:text-cyan-300 transition-colors">
                            بوابة غير أصم (الزائر والمرافق)
                          </h4>
                          <span className="text-[10px] text-cyan-400 font-bold">دخول ←</span>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                          يلتقط أصوات العيادة، كلام المحيطين، ويسمع ترجمة إشارات الأصم بصوت فصيح
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: بوابة أوقات الصلاة (ركز عليها المستخدم) */}
                  <div
                    onClick={() => navigateTo('prayer-times')}
                    className={`${isImmersive ? 'p-5 rounded-3xl' : 'p-3 rounded-2xl'} bg-gradient-to-r from-amber-950/80 to-emerald-950/90 border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.01] flex items-center text-right group`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                        🕌
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-black font-thmanyah text-white group-hover:text-amber-300 transition-colors">
                            بوابة أوقات الصلاة والأذان
                          </h4>
                          <span className="text-[10px] text-amber-400 font-bold">دخول ←</span>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                          مواقيت الصلوات الخمس · منبه وميض الأذان المرئي للأصم · اتجاه القبلة
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Independent Quick Sub-Options: ربط السيارة و ربط الطبيب */}
                <div className="pt-1">
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-300 font-thmanyah">
                      خيارات الربط الذكي المستقلة:
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400">اتصال سريع</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 px-1">
                    {/* خيار: ربط السيارة (Apple CarPlay) */}
                    <div
                      onClick={() => navigateTo('car-mode')}
                      className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 hover:border-rose-400 cursor-pointer flex items-center gap-2 text-right transition-all hover:scale-[1.02]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-base shrink-0">
                        🚗
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-black font-thmanyah text-white truncate">ربط السيارة</h5>
                        <p className="text-[9px] text-rose-300 font-medium truncate">CarPlay · نور أحمر وامض</p>
                      </div>
                    </div>

                    {/* خيار: ربط الطبيب (كاميرا واستشارة مستقلة) */}
                    <div
                      onClick={() => {
                        navigateTo('doctor-camera-hud');
                        startCamera();
                      }}
                      className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 cursor-pointer flex items-center gap-2 text-right transition-all hover:scale-[1.02]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-base shrink-0">
                        🩺
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-black font-thmanyah text-white truncate">ربط الطبيب</h5>
                        <p className="text-[9px] text-purple-300 font-medium truncate">كاميرا واستشارة 3D</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400">
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

            {/* ================= 8. DOCTOR STANDALONE CAMERA HUD ================= */}
            {/* واجهة الكاميرا المستقلة للطبيب: كل شيء يوخر ما يطلع إلا الكام وترجمة المريض واليد 3D */}
            {screen === 'doctor-camera-hud' && (
              <div className="absolute inset-0 z-30 bg-black flex flex-col justify-between overflow-hidden animate-fadeIn">
                {/* Fullscreen Video Viewfinder */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${isCameraActive ? 'opacity-95' : 'hidden'}`}
                />

                {/* Simulated Lens Viewfinder if Camera is Off */}
                {!isCameraActive && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#09120D] via-[#040806] to-[#0A160F] flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/40 flex items-center justify-center mb-3 animate-pulse">
                      <Camera className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-black font-thmanyah text-white">
                      واجهة الكاميرا الطبية المستقلة
                    </h4>
                    <p className="text-[10px] text-slate-300 max-w-xs mt-1">
                      ترصد حركة كف المريض وتقوم بالترجمة الفورية دون أي عوائق في الشاشة
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs font-thmanyah text-white flex items-center gap-1.5 shadow-lg"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>تشغيل عدسة الكاميرا الحقيقية</span>
                    </button>
                  </div>
                )}

                {/* Clean Camera Top Bar: Flash + Status + Close (Everything else cleared away!) */}
                <div className="relative z-40 p-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-[10px] font-mono text-emerald-300 bg-black/70 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      كاميرا العيادة الذكية 🩺
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsDoctorFlashOn(!isDoctorFlashOn)}
                      className={`p-2 rounded-full border transition-colors ${
                        isDoctorFlashOn ? 'bg-amber-400 text-black border-amber-300' : 'bg-black/60 text-white border-white/20'
                      }`}
                      title="فلاش الإضاءة"
                    >
                      <Flashlight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        handleGoBack();
                      }}
                      className="px-3 py-1 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs font-thmanyah flex items-center gap-1 shadow-lg"
                    >
                      <span>✕ خروج</span>
                    </button>
                  </div>
                </div>

                {/* Skeletal Landmark Tracking Box (تتبع 21 نقطة عصبية بكف المريض) */}
                <div className="relative z-20 mx-auto my-auto w-56 h-56 border-2 border-dashed border-emerald-400/70 rounded-3xl flex flex-col items-center justify-center p-3 animate-pulse pointer-events-none">
                  <div className="w-16 h-16 rounded-2xl bg-black/60 border border-emerald-400/60 flex items-center justify-center text-3xl mb-1">
                    {doctorRecognizedSign.visualIcon}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-black/80 px-2 py-0.5 rounded">
                    رصد 21 نقطة مفصلية بالكف
                  </span>
                </div>

                {/* Camera Bottom Floating HUD: Live Translation Subtitle + 3D Hand Pairing Toggle */}
                <div className="relative z-40 p-3 bg-gradient-to-t from-black via-black/90 to-transparent space-y-2">
                  {/* Floating Subtitle Banner */}
                  <div className="p-3 rounded-2xl bg-black/85 border border-emerald-500/40 backdrop-blur-md flex items-center justify-between text-right">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{doctorRecognizedSign.visualIcon}</span>
                      <div>
                        <span className="text-[9px] text-emerald-400 font-bold font-thmanyah block">
                          ترجمة إشارة المريض الحالية:
                        </span>
                        <h4 className="text-xs sm:text-sm font-black font-thmanyah text-white">
                          "{doctorRecognizedSign.word}"
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        haptics.medium();
                        sounds.playTap();
                        speakText(doctorRecognizedSign.word);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-thmanyah flex items-center gap-1 shadow-md"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>نطق</span>
                    </button>
                  </div>

                  {/* Quick Patient Signs Tester Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {DICTIONARY_WORDS.slice(0, 5).map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          haptics.selection();
                          sounds.playTap();
                          setDoctorRecognizedSign(w);
                          speakText(w.word);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-thmanyah shrink-0 border transition-all ${
                          doctorRecognizedSign.id === w.id
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-black/60 text-slate-300 border-white/20 hover:border-emerald-400'
                        }`}
                      >
                        <span>{w.visualIcon} {w.word}</span>
                      </button>
                    ))}
                  </div>

                  {/* Paired 3D Hand Model Toggle Button (وكذلك العكس يكون الطبيب مقترن بالثري دي يكتب الكلمة وتتحرك اليد تباعاً) */}
                  <button
                    type="button"
                    onClick={() => {
                      haptics.selection();
                      sounds.playTap();
                      setDoctorShowHandPair(!doctorShowHandPair);
                    }}
                    className="w-full py-2 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white font-bold text-xs font-thmanyah flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>{doctorShowHandPair ? 'إخفاء محاكي اليد 3D' : '🔄 كتابة الطبيب وتحريك اليد 3D المعاكسة للمريض'}</span>
                  </button>

                  {/* Inline 3D Hand Sign Avatar Drawer for Doctor */}
                  {doctorShowHandPair && (
                    <div className="p-2 rounded-2xl bg-black/95 border border-purple-500/40 space-y-2 animate-fadeIn max-h-[260px] overflow-y-auto">
                      <div className="flex items-center justify-between text-xs text-purple-300 font-bold font-thmanyah">
                        <span>محاكي اليد 3D المقترن بالطبيب:</span>
                        <span className="text-[9px] text-slate-400">تتحرك اليد مع الكلمة المكتوبة</span>
                      </div>

                      <ThreeDHandSignAvatar
                        currentWord={doctorTypedText}
                        isDoctorMode={true}
                        className="p-3"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= 9. VISITOR MODE (كزائر: وش يلقط الزائر) ================= */}
            {screen === 'visitor-mode' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2.5 animate-fadeIn overflow-hidden text-right">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">👂</span>
                    <span className="text-xs font-bold font-thmanyah">بوابة الزائر: ما يلتقطه الزائر</span>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                    رصد سمعي وبصري
                  </span>
                </div>

                {/* Visitor Perceptual Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[10px] font-thmanyah font-bold">
                  <button
                    type="button"
                    onClick={() => setVisitorTestMode('signs-to-speech')}
                    className={`py-1.5 rounded-lg transition-colors text-center ${
                      visitorTestMode === 'signs-to-speech' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    إشارة الأصم ➔ نطق 🗣️
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitorTestMode('speech-to-signs')}
                    className={`py-1.5 rounded-lg transition-colors text-center ${
                      visitorTestMode === 'speech-to-signs' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    كلام الزائر ➔ يد 3D 🤟
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitorTestMode('ambient')}
                    className={`py-1.5 rounded-lg transition-colors text-center ${
                      visitorTestMode === 'ambient' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    أصوات البيئة 🎙️
                  </button>
                </div>

                {/* Sub-view 1: Signs to Speech (الأصم يؤشر ➔ الزائر يسمع فوراً) */}
                {visitorTestMode === 'signs-to-speech' && (
                  <div className="flex-1 rounded-2xl bg-[#0C1A1E] border border-cyan-500/30 p-3 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 font-thmanyah">
                        <span>ما يلتقطه الزائر عند تأشير الأصم:</span>
                        <span className="text-[9px] font-mono text-slate-400">ترجمة صوتية فصيحة</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        الكاميرا ترصد حركة اليد وتحولها فورياً لكلام مسموع بصوت جيمناي يسمعه الزائر في أذنه:
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/60 border border-cyan-500/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🩺</span>
                        <div>
                          <p className="text-[9px] text-cyan-300 font-bold font-thmanyah">الأصم يؤشر بيده:</p>
                          <h4 className="text-xs font-black font-thmanyah text-white">
                            "أحتاج استشارة طبية عاجلة لفحص الحنجرة"
                          </h4>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          haptics.medium();
                          sounds.playTap();
                          speakText('أحتاج استشارة طبية عاجلة لفحص الحنجرة');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-thmanyah flex items-center gap-1 shadow-md"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>استماع</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-thmanyah">نماذج إشارات يلتقطها الزائر:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => speakText('أين العيادة الباطنية؟')}
                          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 text-[10px] text-white font-bold flex items-center gap-1.5 text-right"
                        >
                          <span>📍</span>
                          <span>أين العيادة الباطنية؟</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText('شكراً جزيلاً لحسن تعاملك')}
                          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 text-[10px] text-white font-bold flex items-center gap-1.5 text-right"
                        >
                          <span>🙏</span>
                          <span>شكراً جزيلاً لحسن تعاملك</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-view 2: Speech to Signs & 3D (الزائر يتحدث ➔ الأصم يرى اليد 3D) */}
                {visitorTestMode === 'speech-to-signs' && (
                  <div className="flex-1 rounded-2xl bg-[#14232B] border border-cyan-500/30 p-3 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 font-thmanyah">
                        <span>ما يرسله الزائر للأصم:</span>
                        <span className="text-[9px] font-mono text-slate-400">تحويل صوت ➔ إشارة 3D</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        الزائر يتحدث بالصوت، والتطبيق يعرض للأصم حركة اليد التفاعلية:
                      </p>
                    </div>

                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={visitorCapturedSpeech}
                        onChange={(e) => setVisitorCapturedSpeech(e.target.value)}
                        placeholder="تحدث أو اكتب ما تقوله للأصم..."
                        className="flex-1 p-2 text-xs rounded-xl bg-black/60 border border-cyan-500/30 text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          haptics.medium();
                          sounds.playTap();
                          speakText(visitorCapturedSpeech);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white text-xs font-bold font-thmanyah"
                      >
                        تحويل
                      </button>
                    </div>

                    <div className="p-2 rounded-xl bg-black/60 border border-cyan-500/20 text-center">
                      <p className="text-[10px] text-cyan-300 font-bold mb-1">الإشارة المعروضة للأصم الآن:</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl animate-bounce">👋</span>
                        <span className="text-xs font-black font-thmanyah text-white">
                          "{visitorCapturedSpeech}"
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-view 3: Ambient Clinic Sounds (أصوات البيئة) */}
                {visitorTestMode === 'ambient' && (
                  <div className="flex-1 rounded-2xl bg-[#101A24] border border-cyan-500/30 p-3 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 font-thmanyah">
                        <span>الرصد الصوتي المحيط في العيادة والمطار:</span>
                        <span className="text-[9px] font-mono text-cyan-400">رادار بيئي</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        المايك يلتقط الترددات وينبه الطرفين فوراً:
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-1 text-center">
                      <Radio className="w-6 h-6 text-cyan-400 animate-pulse mx-auto" />
                      <h5 className="text-xs font-bold font-thmanyah text-white">
                        {visitorAmbientEvent || 'المايك يستشعر الأصوات المحيطة الآن...'}
                      </h5>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          haptics.radarPing();
                          sounds.playAlert('radar');
                          setVisitorAmbientEvent('تم رصد نداء: «دكتور عمر سلمان الشمري»');
                          speakText('نداء: دكتور عمر سلمان الشمري، تفضل لغرفة الفحص');
                        }}
                        className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-[10px] text-cyan-200 font-bold"
                      >
                        📢 نداء اسم المريض
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          haptics.radarPing();
                          sounds.playDoorbell();
                          setVisitorAmbientEvent('تم رصد رنين جرس الباب والاستقبال');
                        }}
                        className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-[10px] text-cyan-200 font-bold"
                      >
                        🔔 جرس الاستقبال
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= 10. CAR MODE & APPLE CARPLAY ================= */}
            {/* وضع السيارة: نور أحمر وامض في شاشة السيارة وتنبيهات الأذان */}
            {screen === 'car-mode' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2 animate-fadeIn overflow-hidden text-right">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold font-thmanyah">وضع السيارة و Apple CarPlay</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    متصل بشاشة السيارة
                  </span>
                </div>

                {/* Flashing Red Emergency Beacon Box (نور أحمر بـ أبل كار بلاي) */}
                <div className={`relative p-3 rounded-2xl border-2 transition-all duration-300 text-center ${
                  carFlashingBeacon
                    ? 'border-rose-500 bg-rose-600/30 animate-pulse shadow-[0_0_30px_rgba(225,29,72,0.6)]'
                    : 'border-white/15 bg-black/50'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className={`text-2xl ${carFlashingBeacon ? 'animate-bounce' : ''}`}>🚨</span>
                    <h4 className="text-xs sm:text-sm font-black font-thmanyah text-white">
                      {carFlashingBeacon ? 'نور أحمر تحذيري نشط على شاشة السيارة!' : 'النور التحذيري البصري في السيارة'}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    {carAlertMessage || 'يومض النور الأحمر فور رصد سيارة إسعاف قادمة أو بوري سيارة لتنبيه السائق الأصم بصرياً.'}
                  </p>
                </div>

                {/* Adhan Visual Alert Simulation */}
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-right">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🕌</span>
                    <div>
                      <span className="text-[9px] text-emerald-300 font-bold font-thmanyah block">
                        تنبيهات مواقيت الصلاة في السيارة:
                      </span>
                      <h5 className="text-xs font-bold font-thmanyah text-white">
                        {carAdhanAlert ? 'حان الآن موعد أذان العصر · تقبل الله طاعتكم' : 'موعد صلاة العصر: 03:45 م'}
                      </h5>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      haptics.notification();
                      sounds.playHospitalChime();
                      setCarAdhanAlert(true);
                      speakText('حان الآن موعد أذان العصر، تقبل الله طاعتكم');
                      setTimeout(() => setCarAdhanAlert(false), 5000);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold font-thmanyah shrink-0"
                  >
                    تجربة تنبيه الأذان
                  </button>
                </div>

                {/* Car Triggers */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-thmanyah">جرّب النور الأحمر للطوارئ:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        haptics.heavy();
                        sounds.playEmergencySiren();
                        setCarFlashingBeacon(true);
                        setCarAlertMessage('⚠️ اقتراب سيارة إسعاف من الخلف! أفسح المسار فوراً.');
                        speakText('تحذير بصري: اقتراب سيارة إسعاف، أفسح المسار');
                        setTimeout(() => setCarFlashingBeacon(false), 5000);
                      }}
                      className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/40 hover:border-rose-400 text-rose-200 text-[10px] font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>🚑 سيارة إسعاف</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        haptics.warning();
                        sounds.playCarHorn();
                        setCarFlashingBeacon(true);
                        setCarAlertMessage('⚠️ رصد منبه سيارة قوي (بوري) بالقرب منك!');
                        speakText('تنبيه بصري: منبه سيارة قوي بالقرب منك');
                        setTimeout(() => setCarFlashingBeacon(false), 4000);
                      }}
                      className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 hover:border-amber-400 text-amber-200 text-[10px] font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>📢 بوري سيارة</span>
                    </button>
                  </div>
                </div>

                {/* Full Apple CarPlay Modal Button */}
                <button
                  type="button"
                  onClick={() => {
                    haptics.medium();
                    sounds.playTap();
                    if (onOpenCarPlayModal) {
                      onOpenCarPlayModal();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs font-thmanyah flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>فتح شاشة السيارة الكاملة (Apple CarPlay Dashboard)</span>
                </button>
              </div>
            )}

            {/* ================= 10.5 PRAYER TIMES SCREEN (بوابة أوقات الصلاة للأصم) ================= */}
            {screen === 'prayer-times' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2.5 animate-fadeIn overflow-hidden text-right">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🕌</span>
                    <span className="text-xs font-black font-thmanyah text-white">بوابة أوقات الصلاة والأذان المرئي</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    مكة المكرمة
                  </span>
                </div>

                {/* Hero Card: Next Prayer & Visual Adhan Beacon */}
                <div className={`p-3.5 rounded-2xl border-2 transition-all duration-300 text-center ${
                  carAdhanAlert
                    ? 'border-emerald-400 bg-emerald-600/30 animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.7)]'
                    : 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/80 to-[#0A1A12]'
                }`}>
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 mb-1">
                    <span>الصلاة القادمة</span>
                    <span className="font-mono">متبقي 24 دقيقة</span>
                  </div>
                  <h4 className="text-xl font-black font-thmanyah text-white">
                    صلاة العصر — 03:45 م
                  </h4>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    {carAdhanAlert ? 'الله أكبر.. حان الآن موعد الأذان (وميض مرئي + اهتزاز)' : 'تنبيه الأصم بوميض ضوئي واهتزاز معصمي عند دخول الوقت'}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      haptics.notification();
                      sounds.playHospitalChime();
                      setCarAdhanAlert(true);
                      speakText('الله أكبر.. حان الآن موعد أذان العصر');
                      setTimeout(() => setCarAdhanAlert(false), 5000);
                    }}
                    className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-thmanyah inline-flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>⚡ تجربة وميض الأذان المرئي</span>
                  </button>
                </div>

                {/* 5 Daily Prayers List */}
                <div className="space-y-1.5 overflow-y-auto max-h-[220px] pr-1">
                  {[
                    { name: 'الفجر', time: '04:52 ص', status: 'انقضت', icon: '🌅' },
                    { name: 'الشروق', time: '06:10 ص', status: 'شروق', icon: '☀️' },
                    { name: 'الظهر', time: '12:05 م', status: 'انقضت', icon: '☀️' },
                    { name: 'العصر', time: '03:45 م', status: 'القادمة', icon: '🌤️', active: true },
                    { name: 'المغرب', time: '06:12 م', status: 'لاحقة', icon: '🌇' },
                    { name: 'العشاء', time: '07:42 م', status: 'لاحقة', icon: '🌙' },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        p.active
                          ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold'
                          : 'border-white/10 bg-black/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{p.icon}</span>
                        <span className="font-thmanyah font-bold">{p.name}</span>
                        {p.active && (
                          <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                            الصلاة القادمة
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-xs">{p.time}</span>
                        <span className="text-[10px] text-emerald-400">🔔</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Qibla & Haptic Wrist Indicator */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span>🧭</span>
                    <span className="text-slate-300 font-thmanyah">اتجاه القبلة: 248° نحو الكعبة المشرفة</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">مضبوط بدقة GPS</span>
                </div>
              </div>
            )}

            {/* ================= 11. DICTIONARY INSIDE IPHONE (محسن بالكامل بدون تعليق) ================= */}
            {screen === 'dictionary' && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-2 animate-fadeIn overflow-hidden text-right">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold font-thmanyah">قاموس لغة الإشارة المعتمد</span>
                  </div>
                  {selectedDictWord && (
                    <button
                      type="button"
                      onClick={() => setSelectedDictWord(null)}
                      className="text-[10px] text-emerald-400 hover:text-white font-bold flex items-center gap-1"
                    >
                      <span>← عودة للقائمة</span>
                    </button>
                  )}
                </div>

                {/* Search Bar */}
                {!selectedDictWord && (
                  <div className="relative">
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={dictSearch}
                      onChange={(e) => setDictSearch(e.target.value)}
                      placeholder="ابحث بالقاموس (طبيب، ألم، دواء، سلام)..."
                      className="w-full pr-8 pl-2 py-1.5 text-xs rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                )}

                {/* Selected Word Detail View (Smooth, no bounce lock) */}
                {selectedDictWord ? (
                  <div className="flex-1 rounded-2xl bg-[#0D1812] border border-emerald-500/30 p-3 flex flex-col justify-between space-y-2 overflow-y-auto">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{selectedDictWord.visualIcon}</span>
                          <div>
                            <h4 className="text-sm font-black font-thmanyah text-white">
                              {selectedDictWord.word}
                            </h4>
                            <p className="text-[10px] text-emerald-300">{selectedDictWord.handShape}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            haptics.medium();
                            sounds.playTap();
                            speakText(selectedDictWord.word);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-thmanyah flex items-center gap-1 shadow-md"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>استماع</span>
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-1 text-right">
                        <span className="text-[10px] font-bold text-emerald-400 font-thmanyah">وصف الحركة:</span>
                        <p className="text-[11px] text-slate-200 leading-relaxed">
                          {selectedDictWord.description}
                        </p>
                      </div>

                      {/* Step Frames */}
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] font-bold text-slate-400 font-thmanyah">خطوات الأداء:</span>
                        {selectedDictWord.gestureFrames.map((frame, idx) => (
                          <div key={idx} className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-[10px] text-white flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span>{frame}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDictWord(null)}
                      className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-thmanyah text-center"
                    >
                      ← الرجوع لتصفح باقي الكلمات
                    </button>
                  </div>
                ) : (
                  /* Word List with easy smooth scrolling */
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[360px]">
                    {DICTIONARY_WORDS.filter((w) => w.word.includes(dictSearch) || w.description.includes(dictSearch)).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          haptics.selection();
                          sounds.playTap();
                          setSelectedDictWord(item);
                          speakText(item.word);
                        }}
                        className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-emerald-400 cursor-pointer flex items-center justify-between transition-colors text-right"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.visualIcon}</span>
                          <div>
                            <p className="text-xs font-bold font-thmanyah text-white">{item.word}</p>
                            <p className="text-[9px] text-slate-400 line-clamp-1">{item.handShape}</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-bold">عرض التفاصيل ←</span>
                      </div>
                    ))}
                  </div>
                )}
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

            {/* ================= iOS BOTTOM DOCK ================= */}
            <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex items-center justify-around text-center text-xs font-thmanyah z-20 w-full max-w-2xl mx-auto overflow-x-auto px-1">
              <button
                type="button"
                onClick={() => navigateTo('gate')}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer px-1.5 ${
                  screen === 'gate' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                  screen === 'gate' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'bg-white/10'
                }`}>
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[9px] sm:text-[10px]">البوابات</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('deaf-hub')}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer px-1.5 ${
                  screen.includes('deaf') ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                  screen.includes('deaf') ? 'bg-emerald-500/30 text-emerald-300 shadow-md' : 'bg-white/10'
                }`}>
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[9px] sm:text-[10px]">الأصم</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('visitor-mode')}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer px-1.5 ${
                  screen === 'visitor-mode' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                  screen === 'visitor-mode' ? 'bg-cyan-500/30 text-cyan-300 shadow-md' : 'bg-white/10'
                }`}>
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[9px] sm:text-[10px]">الزائر</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigateTo('doctor-camera-hud');
                  startCamera();
                }}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer px-1.5 ${
                  screen === 'doctor-camera-hud' ? 'text-purple-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                  screen === 'doctor-camera-hud' ? 'bg-purple-500/30 text-purple-300 shadow-md' : 'bg-white/10'
                }`}>
                  <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[9px] sm:text-[10px]">الطبيب</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('car-mode')}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer px-1.5 ${
                  screen === 'car-mode' ? 'text-rose-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                  screen === 'car-mode' ? 'bg-rose-500/30 text-rose-300 shadow-md' : 'bg-white/10'
                }`}>
                  <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[9px] sm:text-[10px]">السيارة</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('prayer-times')}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer px-1.5 ${
                  screen === 'prayer-times' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                  screen === 'prayer-times' ? 'bg-amber-500/30 text-amber-300 shadow-md' : 'bg-white/10'
                }`}>
                  <span>🕌</span>
                </div>
                <span className="text-[9px] sm:text-[10px]">الصلاة</span>
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
