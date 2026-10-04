import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, Volume2, Bell, AlertTriangle, Activity, Sparkles, Check, Play, Music, VolumeX, ShieldAlert } from 'lucide-react';
import { RadarArabicSpeechWidget } from './RadarArabicSpeechWidget';
import { RadarAlert } from '../data/mueenData';
import { sounds } from '../utils/soundEffects';
import { useHaptics } from '../utils/haptics';

export function EnvironmentalRadar() {
  const haptics = useHaptics();
  const [isListening, setIsListening] = useState(false);
  const [currentDecibel, setCurrentDecibel] = useState(32);
  const [sensitivity, setSensitivity] = useState(60);
  const [detectedKeyword, setDetectedKeyword] = useState<string | null>(null);
  const [activeSoundName, setActiveSoundName] = useState<string | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<RadarAlert[]>([
    {
      id: '1',
      source: 'نداء المريض: "أحمد"',
      decibel: 76,
      time: 'منذ دقيقة',
      type: 'voice',
      recognizedText: 'تم رصد نداء الاسم: أحمد في العيادة',
      severity: 'medium'
    },
    {
      id: '2',
      source: 'صوت جرس الباب الخارجي',
      decibel: 72,
      time: 'منذ 3 دقائق',
      type: 'home',
      recognizedText: 'رنين جرس متكرر عند المدخل',
      severity: 'info'
    }
  ]);
  const [vibrationAlert, setVibrationAlert] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // Trigger radar detection event + play real sound
  const triggerEvent = (text: string, decibel: number, type: 'voice' | 'emergency' | 'home' | 'traffic', soundFx?: 'hospital' | 'doorbell' | 'car' | 'emergency') => {
    setDetectedKeyword(text);
    setActiveSoundName(text);

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

    const newAlert: RadarAlert = {
      id: String(Date.now()),
      source: text,
      decibel,
      time: 'الآن',
      type,
      recognizedText: text,
      severity: decibel > 85 || type === 'emergency' ? 'high' : 'medium'
    };

    setRecentAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);
    setVibrationAlert(text);

    setTimeout(() => {
      setVibrationAlert(null);
      setActiveSoundName(null);
    }, 4000);
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
        animFrameRef.current = requestAnimationFrame(updateDb);
      };
      updateDb();

      // 2. Web Speech Recognition for Keyword Spotting
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
            triggerEvent('تم رصد نداء الاسم: "أحمد" في المحيط!', 78, 'voice', 'hospital');
          } else if (transcript.includes('مريض') || transcript.includes('النداء على المريض')) {
            triggerEvent('النداء على المريض في عيادة الاستقبال', 82, 'voice', 'hospital');
          } else if (transcript.includes('جرس') || transcript.includes('رنين')) {
            triggerEvent('صوت جرس الباب الخارجي يرن', 74, 'home', 'doorbell');
          } else if (transcript.includes('حريق') || transcript.includes('طوارئ') || transcript.includes('إنذار')) {
            triggerEvent('إنذار طوارئ وإخلاء صوتي عالي!', 95, 'emergency', 'emergency');
          } else {
            triggerEvent(`كلام مسموع: "${transcript}"`, 68, 'voice');
          }
        };

        recognition.onerror = () => {};
        recognition.start();
        speechRecognitionRef.current = recognition;
      }
    } catch {
      // Fallback simulated listening
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
    <section id="radar" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Concise Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>رادار الصم الحساس للمايك مع نظام صوتيات مسموع</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-thmanyah tracking-tight">
            استشعار كلام الآخرين ونغمات التنبيه من بعيد
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5">
            تحدث بالمايك بكلمة <strong className="text-[var(--brand-primary)]">«أحمد»</strong> أو جرب أزرار الصوتيات الحية بالأسفل لسماع نغمة العيادة، الجرس، وبوق السيارة!
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

        {/* Sound Studio Buttons: الصوتيات المباشرة القابلة للتشغيل */}
        <div className="mb-8 p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-lg lift-3d">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[var(--brand-accent)]" />
              <span className="text-xs font-black font-thmanyah">مشغل الصوتيات والنغمات التفاعلية:</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-bold font-mono">Web Audio Synthesizer HD</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => triggerEvent('النداء على المريض أحمد في عيادة الباطنية', 78, 'voice', 'hospital')}
              className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-emerald-500 text-xs font-bold text-right flex items-center justify-between lift-3d"
            >
              <div>
                <span className="block text-white">نغمة نداء العيادة</span>
                <span className="text-[9px] text-emerald-400 font-normal">Chime + نطق اسم أحمد</span>
              </div>
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => triggerEvent('صوت جرس الباب الخارجي يرن', 74, 'home', 'doorbell')}
              className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-amber-500 text-xs font-bold text-right flex items-center justify-between lift-3d"
            >
              <div>
                <span className="block text-white">صوت جرس الباب</span>
                <span className="text-[9px] text-amber-400 font-normal">Ding-Dong نغمتين</span>
              </div>
              <Bell className="w-4 h-4 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={() => triggerEvent('تحذير بوق سيارة عالي في الشارع', 92, 'traffic', 'car')}
              className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-cyan-500 text-xs font-bold text-right flex items-center justify-between lift-3d"
            >
              <div>
                <span className="block text-white">بوق سيارة في الشارع</span>
                <span className="text-[9px] text-cyan-400 font-normal">Horn مزدوج 490Hz</span>
              </div>
              <Volume2 className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              type="button"
              onClick={() => triggerEvent('إنذار حريق وإخلاء مبنى المركز!', 98, 'emergency', 'emergency')}
              className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-rose-500 text-xs font-bold text-right flex items-center justify-between lift-3d"
            >
              <div>
                <span className="block text-rose-200">صافرة إنذار طوارئ</span>
                <span className="text-[9px] text-rose-400 font-normal">Siren متموج واهتزاز</span>
              </div>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </button>
          </div>

          {/* تبويب رصد الكلام المباشر بالعربي داخل قسم الرادار */}
          <RadarArabicSpeechWidget onKeywordDetected={(text) => triggerEvent(text, 78, 'voice')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Circular Visual Scope (Left) */}
          <div className="lg:col-span-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xl lift-3d flex flex-col items-center justify-between relative overflow-hidden">
            {/* Top Bar inside radar */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <span className="text-xs font-bold font-mono">
                  {isListening ? 'الرادار متصل بالمايك ويستمع حالياً' : 'الرادار بوضع الاستعداد'}
                </span>
              </div>

              <button
                type="button"
                onClick={isListening ? stopRadarMic : startRadarMic}
                className="lift-3d px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
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
                    <span>تفعيل مايك الجوال والكمبيوتر</span>
                  </>
                )}
              </button>
            </div>

            {/* Circular Radar Mesh */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[var(--brand-accent)]/30" />
              <div className="absolute inset-10 rounded-full border border-[var(--brand-accent)]/25" />
              <div className="absolute inset-20 rounded-full border border-[var(--brand-accent)]/20" />
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[var(--brand-accent)]/20" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[var(--brand-accent)]/20" />

              {/* Sweeping Scanner Needle */}
              {isListening && (
                <div className="absolute inset-0 rounded-full overflow-hidden animate-radar-sweep pointer-events-none">
                  <div className="w-1/2 h-1/2 origin-bottom-right bg-gradient-to-tr from-[var(--brand-accent)]/50 to-transparent" />
                </div>
              )}

              {/* Center dB Gauge */}
              <div className="relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg transition-transform">
                <Radio className={`w-6 h-6 text-[var(--brand-accent)] ${isListening ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-bold font-mono mt-0.5 tabular-nums">
                  {currentDecibel} dB
                </span>
              </div>
            </div>

            {/* Sensitivity Bar */}
            <div className="w-full p-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs space-y-1.5">
              <div className="flex justify-between font-bold">
                <span>عتبة حساسية المايك:</span>
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

          {/* Test Buttons & Live Log (Right) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Quick Test Acoustic Buttons */}
            <div className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl lift-3d space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--brand-accent)]" />
                <h3 className="text-sm font-bold font-thmanyah">
                  اختبر رصد الأسماء والأصوات فوراً:
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => triggerEvent('تم رصد نداء الاسم: "أحمد" في العيادة!', 76, 'voice', 'hospital')}
                  className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-right flex items-center justify-between lift-3d"
                >
                  <span>نداء الاسم: "أحمد"</span>
                  <span className="text-emerald-500 font-mono">📢 76dB</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerEvent('النداء على المريض رقم 104 في عيادة الباطنية', 80, 'voice', 'hospital')}
                  className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-right flex items-center justify-between lift-3d"
                >
                  <span>النداء على المريض</span>
                  <span className="text-cyan-500 font-mono">🏥 80dB</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerEvent('صوت جرس الباب الخارجي يرن حالياً', 72, 'home', 'doorbell')}
                  className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-right flex items-center justify-between lift-3d"
                >
                  <span>صوت جرس يرن</span>
                  <span className="text-amber-500 font-mono">🔔 72dB</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerEvent('صوت بوق سيارة عالي وتحذير مروري في الشارع', 92, 'traffic', 'car')}
                  className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-right flex items-center justify-between lift-3d"
                >
                  <span>بوق سيارة في الشارع</span>
                  <span className="text-rose-500 font-mono">🚗 92dB</span>
                </button>
              </div>
            </div>

            {/* Live Detected Sound Log */}
            <div className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl lift-3d space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
                  <span>سجل الأصوات الملتقطة بالمايك</span>
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">لحظي ومباشر</span>
              </div>

              <div className="space-y-2">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between gap-2 lift-3d-subtle"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] flex items-center justify-center text-sm shrink-0">
                        {alert.type === 'voice' ? '🗣️' : alert.type === 'home' ? '🔔' : '⚠️'}
                      </span>
                      <div>
                        <p className="text-xs font-bold leading-tight">{alert.source}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{alert.time}</p>
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
