import React, { useState, useEffect } from 'react';
import { Radio, AlertTriangle, Bell, Moon, MapPin, Volume2, ShieldAlert, Sparkles, X, Compass, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { triggerHaptic } from '../utils/haptics';

interface AppleCarPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppleCarPlayModal({ isOpen, onClose }: AppleCarPlayModalProps) {
  const [activeAlert, setActiveAlert] = useState<'ambulance' | 'car-horn' | 'adhan' | null>(null);
  const [isBeaconFlashing, setIsBeaconFlashing] = useState(false);
  const [currentTime, setCurrentTime] = useState('14:35');
  const [radarDb, setRadarDb] = useState(48);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  // Trigger Ambulance Emergency Red Beacon
  const triggerAmbulanceAlert = () => {
    triggerHaptic('heavy');
    sounds.playAlert('emergency');
    setActiveAlert('ambulance');
    setIsBeaconFlashing(true);
    setRadarDb(94);
    sounds.speakArabic('تحذير بصري: اقتراب سيارة إسعاف من مسافة قريبة، أفسح المسار');

    setTimeout(() => {
      setIsBeaconFlashing(false);
    }, 6000);
  };

  // Trigger Car Horn Alert
  const triggerCarHornAlert = () => {
    triggerHaptic('warning');
    sounds.playAlert('radar');
    setActiveAlert('car-horn');
    setIsBeaconFlashing(true);
    setRadarDb(86);
    sounds.speakArabic('تنبيه بصري: رصد منبه سيارة قوي بالقرب منك');

    setTimeout(() => {
      setIsBeaconFlashing(false);
    }, 4500);
  };

  // Trigger Adhan Visual Notification
  const triggerAdhanAlert = () => {
    triggerHaptic('success');
    sounds.playTone(440, 0, 0.4, 0.2);
    setActiveAlert('adhan');
    setIsBeaconFlashing(false);
    sounds.speakArabic('حان الآن موعد أذان العصر، تقبل الله طاعتكم');
  };

  const clearAlert = () => {
    setActiveAlert(null);
    setIsBeaconFlashing(false);
    setRadarDb(48);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-[38px] border-4 border-[#353942] bg-[#0E1015] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Car In-Dash Frame Header Bar */}
        <div className="bg-[#181B22] px-6 py-3 border-b border-white/10 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black font-thmanyah text-white">
                شاشة السيارة الذكية — وضع أبل كار بلاي (Apple CarPlay)
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                اتصال آمن للسيارة
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="إغلاق شاشة السيارة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CarPlay Screen Body (Simulating 16:9 In-Dash Display) */}
        <div className="relative bg-[#000000] p-4 sm:p-6 flex flex-col md:flex-row gap-4 min-h-[440px] overflow-hidden">
          {/* Flashing Red Visual Beacon (نور أحمر وامض للطوارئ في الشاشة) */}
          {isBeaconFlashing && (
            <div className="absolute inset-0 z-30 pointer-events-none border-[12px] border-rose-600/90 bg-rose-600/20 animate-pulse flex items-center justify-center">
              <div className="absolute top-4 inset-x-4 bg-rose-600/95 text-white py-3 px-6 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-white animate-bounce">
                <div className="flex items-center gap-3">
                  <span className="text-3xl animate-ping">🚨</span>
                  <div>
                    <h4 className="text-base sm:text-lg font-black font-thmanyah">
                      {activeAlert === 'ambulance'
                        ? 'نور تحذيري أحمر: اقتراب سيارة إسعاف (أفسح الطريق فوراً)'
                        : 'نور تحذيري أحمر: منبه سيارة قوي (بوري) بجانبك'}
                    </h4>
                    <p className="text-xs text-rose-100">
                      تم رصد التردد الصوتي الحرج عبر رادار مُعِين في شاشة السيارة
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearAlert}
                  className="px-4 py-1.5 rounded-xl bg-white text-rose-600 text-xs font-bold font-thmanyah pointer-events-auto cursor-pointer shadow-md"
                >
                  تم الانتباه
                </button>
              </div>
            </div>
          )}

          {/* Adhan Visual Notification Overlay */}
          {activeAlert === 'adhan' && (
            <div className="absolute inset-0 z-30 pointer-events-none bg-emerald-950/80 border-[8px] border-emerald-500/80 flex items-center justify-center animate-fadeIn p-4">
              <div className="max-w-md w-full bg-[#0A1810] border-2 border-emerald-400 p-6 rounded-3xl text-center text-white shadow-2xl space-y-4 pointer-events-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-3xl mx-auto shadow-inner animate-bounce">
                  🕌
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-emerald-300">تنبيه مواقيت الصلاة للصم</span>
                  <h4 className="text-xl font-black font-thmanyah text-white">
                    حان الآن موعد أذان العصر
                  </h4>
                  <p className="text-xs text-slate-300">
                    وفق توقيت المملكة العربية السعودية · تقبل الله طاعتكم
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>أقرب مسجد على طريقك:</span>
                  </div>
                  <span className="font-bold text-emerald-300">جامع الراجحي (800 م)</span>
                </div>

                <button
                  type="button"
                  onClick={clearAlert}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs font-thmanyah text-white shadow-md cursor-pointer"
                >
                  إغلاق التنبيه ومتابعة القيادة
                </button>
              </div>
            </div>
          )}

          {/* Apple CarPlay Side Dock (Left Side in CarPlay) */}
          <div className="w-full md:w-20 bg-[#16181E] rounded-2xl p-2 flex md:flex-col items-center justify-between border border-white/10 shrink-0">
            <div className="text-center font-mono font-bold text-white text-xs py-1">
              {currentTime}
            </div>

            <div className="flex md:flex-col items-center gap-2">
              <button
                type="button"
                onClick={clearAlert}
                className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-lg hover:scale-105 transition-transform"
                title="تطبيق مُعِين"
              >
                🤟
              </button>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">
                🗺️
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                🎵
              </div>
            </div>

            <div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
            </div>
          </div>

          {/* CarPlay Main Display Area */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {/* Top Road HUD */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#141820] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-thmanyah block">مستوى ضجيج الطريق</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">{radarDb} dB</span>
                </div>
                <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141820] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-thmanyah block">الاستشعار البصري</span>
                  <span className="text-xs font-bold text-white font-thmanyah">
                    {activeAlert ? '🚨 رصد صوتي نشط' : '✅ الطريق آمن'}
                  </span>
                </div>
                <ShieldAlert className={`w-6 h-6 ${activeAlert ? 'text-rose-500 animate-ping' : 'text-slate-400'}`} />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141820] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-thmanyah block">أقرب صلاة</span>
                  <span className="text-xs font-bold text-emerald-300 font-thmanyah">صلاة العصر 03:45 م</span>
                </div>
                <span className="text-2xl">🕌</span>
              </div>
            </div>

            {/* Visual Driving Radar Map Simulator */}
            <div className="relative flex-1 min-h-[190px] rounded-2xl bg-[#080B10] border border-white/10 overflow-hidden flex flex-col items-center justify-center text-center p-4">
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              {/* Pulsing Concentric Safe Radar Rings */}
              <div className="absolute w-36 h-36 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none" />
              <div className="absolute w-56 h-56 rounded-full border border-cyan-500/15 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-4xl mb-1">🚘</span>
                <h4 className="text-sm font-black font-thmanyah text-white">
                  رادار القيادة الآمنة للصم من «مُعِين»
                </h4>
                <p className="text-xs text-slate-300 max-w-md mt-1">
                  يحول أصوات الإسعاف، بوري السيارات، وتنبيهات الأذان إلى إشارات بصرية ضوئية ملونة على شاشة السيارة فوراً.
                </p>
              </div>
            </div>

            {/* Test Simulation Triggers for User */}
            <div className="p-3.5 rounded-2xl bg-[#131720] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-thmanyah text-white">
                  جرّب محاكاة تنبيهات السيارة الآن:
                </span>
                <span className="text-[10px] font-mono text-slate-400">انقر لتشغيل التنبيه على الشاشة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={triggerAmbulanceAlert}
                  className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold font-thmanyah flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>🚨</span>
                  <span>اقتراب إسعاف (نور أحمر)</span>
                </button>

                <button
                  type="button"
                  onClick={triggerCarHornAlert}
                  className="px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold font-thmanyah flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>🚗</span>
                  <span>منبه سيارة (بوري)</span>
                </button>

                <button
                  type="button"
                  onClick={triggerAdhanAlert}
                  className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-thmanyah flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>🕌</span>
                  <span>تنبيه وقت الأذان</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
