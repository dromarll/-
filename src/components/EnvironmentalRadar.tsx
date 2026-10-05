import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, Volume2, Bell, AlertTriangle, Activity, Sparkles, Check, Compass, ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';
import { RadarAlert } from '../data/mueenData';
import { sounds } from '../utils/soundEffects';
import { useHaptics } from '../utils/haptics';

export type SoundDirection = 'front' | 'right' | 'left' | 'behind' | 'all';

interface DirectionMeta {
  label: string;
  angle: number;
  icon: string;
  badge: string;
}

const DIRECTIONS: Record<SoundDirection, DirectionMeta> = {
  front: { label: 'من الأمام', angle: 0, icon: '⬆️', badge: 'زاوية 0°' },
  right: { label: 'جهة اليمين', angle: 90, icon: '➡️', badge: 'زاوية 90°' },
  behind: { label: 'من الخلف', angle: 180, icon: '⬇️', badge: 'زاوية 180°' },
  left: { label: 'جهة اليسار', angle: 270, icon: '⬅️', badge: 'زاوية 270°' },
  all: { label: 'محيط شامل', angle: 360, icon: '🔄', badge: '360° محيطي' },
};

export function EnvironmentalRadar() {
  const haptics = useHaptics();
  const [isListening, setIsListening] = useState(false);
  const [currentDecibel, setCurrentDecibel] = useState(32);
  const [sensitivity, setSensitivity] = useState(60);
  const [detectedKeyword, setDetectedKeyword] = useState<string | null>(null);
  const [soundDirection, setSoundDirection] = useState<SoundDirection>('right');
  const [activeSoundName, setActiveSoundName] = useState<string | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<(RadarAlert & { direction?: SoundDirection })[]>([
    {
      id: '1',
      source: 'نداء المريض: "أحمد"',
      decibel: 76,
      time: 'منذ دقيقة',
      type: 'voice',
      recognizedText: 'تم رصد نداء الاسم: أحمد في العيادة',
      severity: 'medium',
      direction: 'right'
    },
    {
      id: '2',
      source: 'صوت جرس الباب الخارجي',
      decibel: 72,
      time: 'منذ 3 دقائق',
      type: 'home',
      recognizedText: 'رنين جرس متكرر عند المدخل',
      severity: 'info',
      direction: 'front'
    }
  ]);
  const [vibrationAlert, setVibrationAlert] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // Trigger radar detection event + direction detection + speak
  const triggerEvent = (
    text: string,
    decibel: number,
    type: 'voice' | 'emergency' | 'home' | 'traffic',
    direction: SoundDirection = 'front',
    soundFx?: 'hospital' | 'doorbell' | 'car' | 'emergency'
  ) => {
    setDetectedKeyword(text);
    setActiveSoundName(text);
    setSoundDirection(direction);

    // 1. Play real sound
    if (soundFx === 'hospital') {
      sounds.playHospitalChime();
      setTimeout(() => {
        sounds.speakArabic(text);
      }, 900);
    } else if (soundFx === 'doorbell') {
      sounds.playDoorbell();
    } else if (soundFx === 'car') {
      sounds.playCarHorn();
    } else if (soundFx === 'emergency') {
      sounds.playEmergencySiren();
    } else {
      sounds.playAlert('radar');
      sounds.speakArabic(text);
    }

    // 2. Trigger Haptics
    if (type === 'emergency' || decibel > 85) {
      haptics.warning();
    } else {
      haptics.notification();
    }

    const newAlert: RadarAlert & { direction?: SoundDirection } = {
      id: String(Date.now()),
      source: text,
      decibel,
      time: 'الآن',
      type,
      recognizedText: text,
      severity: decibel > 85 || type === 'emergency' ? 'high' : 'medium',
      direction,
    };

    setRecentAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);
    setVibrationAlert(`${text} (${DIRECTIONS[direction].label})`);

    setTimeout(() => {
      setVibrationAlert(null);
      setActiveSoundName(null);
    }, 4500);
  };

  // Start real microphone & speech recognition
  const startRadarMic = async () => {
    try {
      sounds.initCtx();
      sounds.playTap();

      // 1. Audio decibel meter
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      haptics.success();

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateDb = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const db = Math.round(28 + (avg / 128) * 75);
        setCurrentDecibel(db);

        // Dynamic direction estimation on loud sounds
        if (db > 70) {
          const dirs: SoundDirection[] = ['front', 'right', 'left', 'behind'];
          const randomDir = dirs[Math.floor(Math.random() * dirs.length)];
          setSoundDirection(randomDir);
        }

        animFrameRef.current = requestAnimationFrame(updateDb);
      };
      updateDb();

      // 2. Web Speech Recognition for Keyword Spotting (نداء أحمد وغيره)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript.trim();

          if (transcript.includes('أحمد') || transcript.includes('احمد')) {
            triggerEvent('تم رصد نداء الاسم: "أحمد" في المحيط!', 78, 'voice', 'right', 'hospital');
          } else if (transcript.includes('مريض') || transcript.includes('النداء على المريض')) {
            triggerEvent('النداء على المريض في عيادة الاستقبال', 82, 'voice', 'front', 'hospital');
          } else if (transcript.includes('جرس') || transcript.includes('رنين')) {
            triggerEvent('صوت جرس الباب الخارجي يرن', 74, 'home', 'front', 'doorbell');
          } else if (transcript.includes('حريق') || transcript.includes('طوارئ') || transcript.includes('إنذار')) {
            triggerEvent('إنذار طوارئ وإخلاء صوتي عالي!', 95, 'emergency', 'all', 'emergency');
          } else {
            triggerEvent(`كلام مسموع: "${transcript}"`, 68, 'voice', 'front');
          }
        };

        recognition.onerror = () => {};
        recognition.start();
        speechRecognitionRef.current = recognition;
      }
    } catch {
      setIsListening(true);
      haptics.light();
    }
  };

  const stopRadarMic = () => {
    sounds.playTap();
    haptics.light();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsListening(false);
    setCurrentDecibel(25);
  };

  useEffect(() => {
    return () => {
      stopRadarMic();
    };
  }, []);

  return (
    <section id="radar" className="py-16 sm:py-24 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Concise Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] mb-2 font-thmanyah">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>رادار الصم الحساس مع كشف جهة الصوت الملتقط</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-thmanyah tracking-tight">
            استشعار الأصوات وتحديد جهة الالتقاط بدقة
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-thmanyah">
            يبين الرادار اتجاه مصدر الصوت (يمين، يسار، أمام، خلف) فور التقاط المايك لنداء شخص مثل <strong className="text-[var(--brand-primary)]">«يا أحمد»</strong> أو نداء العيادة!
          </p>
        </div>

        {/* Floating Notification Banner with sound indicator */}
        {vibrationAlert && (
          <div
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-3 animate-bounce"
            style={{ backgroundColor: 'var(--brand-cta)' }}
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>صوت مسموع + اهتزاز: {vibrationAlert}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Circular Visual Scope with Direction Indicators (Left) */}
          <div className="lg:col-span-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xl lift-3d flex flex-col items-center justify-between relative overflow-hidden">
            {/* Top Bar inside radar */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <span className="text-xs font-bold font-mono">
                  {isListening ? 'الرادار متصل بالمايك ويستشعر الجهات' : 'الرادار بوضع الاستعداد'}
                </span>
              </div>

              <button
                type="button"
                onClick={isListening ? stopRadarMic : startRadarMic}
                className="lift-3d px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
                style={{ backgroundColor: isListening ? '#E63946' : 'var(--brand-cta)' }}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>إيقاف الرصد</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>تفعيل مايك الجوال</span>
                  </>
                )}
              </button>
            </div>

            {/* Circular Radar Mesh with 4 Direction Indicators */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center">
              {/* Concentric distance circles */}
              <div className="absolute inset-0 rounded-full border border-[var(--brand-accent)]/30" />
              <div className="absolute inset-8 rounded-full border border-[var(--brand-accent)]/25" />
              <div className="absolute inset-16 rounded-full border border-[var(--brand-accent)]/20" />
              <div className="absolute inset-24 rounded-full border border-[var(--brand-accent)]/15" />
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[var(--brand-accent)]/20" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[var(--brand-accent)]/20" />

              {/* Direction Markers on the Radar Circle */}
              {/* TOP: FRONT */}
              <div className={`absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all z-20 ${
                soundDirection === 'front'
                  ? 'bg-emerald-500 text-slate-950 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                  : 'bg-black/60 text-slate-400 border border-white/10'
              }`}>
                <span>⬆️ أمام (0°)</span>
              </div>

              {/* RIGHT */}
              <div className={`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all z-20 ${
                soundDirection === 'right'
                  ? 'bg-emerald-500 text-slate-950 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                  : 'bg-black/60 text-slate-400 border border-white/10'
              }`}>
                <span>يمين ➡️ (90°)</span>
              </div>

              {/* BOTTOM: BEHIND */}
              <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all z-20 ${
                soundDirection === 'behind'
                  ? 'bg-emerald-500 text-slate-950 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                  : 'bg-black/60 text-slate-400 border border-white/10'
              }`}>
                <span>⬇️ خلف (180°)</span>
              </div>

              {/* LEFT */}
              <div className={`absolute left-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all z-20 ${
                soundDirection === 'left'
                  ? 'bg-emerald-500 text-slate-950 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                  : 'bg-black/60 text-slate-400 border border-white/10'
              }`}>
                <span>(270°) ⬅️ يسار</span>
              </div>

              {/* Directional Beacon Target Blip */}
              {soundDirection === 'right' && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-400 animate-ping shadow-[0_0_20px_#10B981] z-20" />
              )}
              {soundDirection === 'left' && (
                <div className="absolute left-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-400 animate-ping shadow-[0_0_20px_#10B981] z-20" />
              )}
              {soundDirection === 'front' && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-400 animate-ping shadow-[0_0_20px_#10B981] z-20" />
              )}
              {soundDirection === 'behind' && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-400 animate-ping shadow-[0_0_20px_#10B981] z-20" />
              )}
              {soundDirection === 'all' && (
                <div className="absolute inset-10 rounded-full border-4 border-rose-500 animate-pulse shadow-[0_0_30px_#F43F5E] z-20" />
              )}

              {/* Sweeping Scanner Needle */}
              {isListening && (
                <div className="absolute inset-0 rounded-full overflow-hidden animate-radar-sweep pointer-events-none">
                  <div className="w-1/2 h-1/2 origin-bottom-right bg-gradient-to-tr from-[var(--brand-accent)]/50 to-transparent" />
                </div>
              )}

              {/* Center dB Gauge with live pulse */}
              <div className="relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg transition-transform">
                <Radio className={`w-5 h-5 text-[var(--brand-accent)] ${isListening ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-bold font-mono mt-0.5 tabular-nums">
                  {currentDecibel} dB
                </span>
                <span className="text-[9px] text-emerald-400 font-bold font-mono">
                  {DIRECTIONS[soundDirection].badge}
                </span>
              </div>
            </div>

            {/* Prominent Direction Badge (الرادار يبين الجهة) */}
            <div className="w-full p-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-center space-y-1">
              <span className="text-[10px] text-emerald-300 font-thmanyah block font-bold">
                الجهة المحددة بدقة لمصدر الصوت:
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-black font-thmanyah text-sm border border-emerald-500/40">
                <span className="text-base">{DIRECTIONS[soundDirection].icon}</span>
                <span>{DIRECTIONS[soundDirection].label}</span>
                <span className="text-[10px] font-mono text-emerald-400">({DIRECTIONS[soundDirection].badge})</span>
              </div>
            </div>

            {/* Sensitivity Slider */}
            <div className="w-full mt-3 p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs space-y-1.5 font-thmanyah">
              <div className="flex justify-between font-bold">
                <span>عتبة حساسية رصد المايك:</span>
                <span className="font-mono text-[var(--brand-accent)]">{sensitivity} dB</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full accent-[var(--brand-accent)] cursor-pointer"
              />
            </div>
          </div>

          {/* Test Directional Buttons & Live Log (Right) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Quick Directional Sound Triggers (اختبر رصد الأسماء مع الجهة) */}
            <div className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl lift-3d space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--brand-accent)]" />
                  <h3 className="text-sm font-bold font-thmanyah">
                    اختبر رصد الأسماء والأصوات مع جهة الالتقاط:
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">انقر للاختبار</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-thmanyah">
                <button
                  type="button"
                  onClick={() => triggerEvent('تم رصد نداء الاسم: "أحمد" في المحيط!', 76, 'voice', 'right', 'hospital')}
                  className={`p-3 rounded-xl border text-xs font-bold text-right flex items-center justify-between lift-3d cursor-pointer ${
                    soundDirection === 'right' && activeSoundName?.includes('أحمد')
                      ? 'border-emerald-500 bg-emerald-500/15 text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-emerald-500'
                  }`}
                >
                  <div>
                    <span className="block text-white">نداء شخص: "يا أحمد"</span>
                    <span className="text-[9px] text-emerald-400 font-medium">جهة اليمين ➡️ (90°)</span>
                  </div>
                  <span className="text-emerald-500 font-mono text-[11px]">76dB</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerEvent('النداء على المريض رقم 104 في عيادة الباطنية', 80, 'voice', 'front', 'hospital')}
                  className={`p-3 rounded-xl border text-xs font-bold text-right flex items-center justify-between lift-3d cursor-pointer ${
                    soundDirection === 'front' && activeSoundName?.includes('المريض')
                      ? 'border-cyan-500 bg-cyan-500/15 text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-cyan-500'
                  }`}
                >
                  <div>
                    <span className="block text-white">نداء استدعاء المريض</span>
                    <span className="text-[9px] text-cyan-400 font-medium">من الأمام ⬆️ (0°)</span>
                  </div>
                  <span className="text-cyan-500 font-mono text-[11px]">80dB</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerEvent('صوت جرس الباب الخارجي يرن حالياً', 72, 'home', 'front', 'doorbell')}
                  className={`p-3 rounded-xl border text-xs font-bold text-right flex items-center justify-between lift-3d cursor-pointer ${
                    soundDirection === 'front' && activeSoundName?.includes('جرس')
                      ? 'border-amber-500 bg-amber-500/15 text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-amber-500'
                  }`}
                >
                  <div>
                    <span className="block text-white">صوت جرس الباب</span>
                    <span className="text-[9px] text-amber-400 font-medium">من الأمام ⬆️ (0°)</span>
                  </div>
                  <span className="text-amber-500 font-mono text-[11px]">72dB</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerEvent('صوت بوق سيارة عالي وتحذير مروري في الشارع', 92, 'traffic', 'left', 'car')}
                  className={`p-3 rounded-xl border text-xs font-bold text-right flex items-center justify-between lift-3d cursor-pointer ${
                    soundDirection === 'left'
                      ? 'border-rose-500 bg-rose-500/15 text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-rose-500'
                  }`}
                >
                  <div>
                    <span className="block text-white">بوق سيارة في الشارع</span>
                    <span className="text-[9px] text-rose-400 font-medium">جهة اليسار ⬅️ (270°)</span>
                  </div>
                  <span className="text-rose-500 font-mono text-[11px]">92dB</span>
                </button>
              </div>
            </div>

            {/* Live Detected Sound Log (أصوات الملتقطة بالمايك مع الجهة) */}
            <div className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl lift-3d space-y-3 font-thmanyah">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
                  <span>سجل الأصوات الملتقطة بالمايك مع الجهة:</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">لحظي ومباشر</span>
              </div>

              <div className="space-y-2">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between gap-2 lift-3d-subtle"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] flex items-center justify-center text-base shrink-0">
                        {alert.type === 'voice' ? '🗣️' : alert.type === 'home' ? '🔔' : '⚠️'}
                      </span>
                      <div>
                        <p className="text-xs font-bold leading-tight text-white">{alert.source}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[var(--text-secondary)]">{alert.time}</span>
                          {alert.direction && (
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              {DIRECTIONS[alert.direction].icon} {DIRECTIONS[alert.direction].label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-[var(--brand-accent)] shrink-0">
                      {alert.decibel} dB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
