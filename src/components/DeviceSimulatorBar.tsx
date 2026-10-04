import { useState } from 'react';
import { BookOpen, Radio, Monitor, Tablet, Smartphone, ChevronUp } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

export type DeviceMode = 'desktop' | 'ipad' | 'mobile';

interface DeviceSimulatorBarProps {
  currentDevice: DeviceMode;
  onSelectDevice: (device: DeviceMode) => void;
  onOpenDictionary: () => void;
  onOpenRadar: () => void;
}

export function DeviceSimulatorBar({
  currentDevice,
  onSelectDevice,
  onOpenDictionary,
  onOpenRadar,
}: DeviceSimulatorBarProps) {
  const [deviceMenuOpen, setDeviceMenuOpen] = useState(false);

  // Cycle to next device on mobile tap
  const handleCycleDevice = () => {
    triggerHaptic('selection');
    sounds.playTap();
    if (currentDevice === 'mobile') {
      onSelectDevice('ipad');
    } else if (currentDevice === 'ipad') {
      onSelectDevice('desktop');
    } else {
      onSelectDevice('mobile');
    }
  };

  const getDeviceLabel = () => {
    if (currentDevice === 'mobile') return 'واجهة جوال';
    if (currentDevice === 'ipad') return 'واجهة آيباد';
    return 'واجهة كمبيوتر';
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 inset-x-0 z-40 flex items-center justify-center px-2 sm:px-6 pointer-events-none select-none">
      {/* 3 Balanced Sections Dock (3 جهات واضحة ومنمقة على الجوال والكمبيوتر) */}
      <div className="pointer-events-auto w-full max-w-xl mx-auto grid grid-cols-3 gap-1.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-2xl shadow-2xl">
        
        {/* 1. Left Side: تطبيق قاموس مع إيموجي القاموس والكتاب 📖 */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            sounds.playTap();
            onOpenDictionary();
          }}
          className="lift-3d p-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--brand-accent)] text-[var(--brand-primary)] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 font-bold text-[11px] sm:text-xs font-thmanyah transition-all cursor-pointer text-center"
          aria-label="فتح تطبيق القاموس"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-sm shadow-sm shrink-0">
            📖
          </div>
          <div className="flex flex-col text-center sm:text-right leading-tight">
            <span className="font-black text-xs sm:text-xs truncate">تطبيق قاموس</span>
            <span className="text-[9px] text-[var(--text-secondary)] font-normal hidden md:inline">
              لغة الإشارة
            </span>
          </div>
        </button>

        {/* 2. Center: الواجهات مع إيموجي الأجهزة الثلاثة جنب بعض (💻📱📟) */}
        <div className="relative">
          <button
            type="button"
            onClick={handleCycleDevice}
            onContextMenu={(e) => {
              e.preventDefault();
              setDeviceMenuOpen(!deviceMenuOpen);
            }}
            className="w-full h-full lift-3d p-2 sm:px-3 sm:py-2.5 rounded-xl sm:rounded-2xl border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10 hover:bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 font-bold text-[11px] sm:text-xs font-thmanyah transition-all cursor-pointer text-center"
            title="انقر للتبديل بين واجهات الجوال والآيباد والكمبيوتر"
          >
            {/* Emojis of 3 devices side by side as requested: 💻📱📟 */}
            <div className="flex items-center gap-0.5 text-xs sm:text-sm tracking-tighter shrink-0 bg-white/10 px-1 py-0.5 rounded-lg border border-white/15">
              <span>💻</span>
              <span>📱</span>
              <span>📟</span>
            </div>

            <div className="flex flex-col text-center sm:text-right leading-tight min-w-0">
              <span className="font-black text-[11px] sm:text-xs truncate text-[var(--brand-primary)]">
                {getDeviceLabel()}
              </span>
              <span className="text-[9px] text-[var(--text-secondary)] font-normal hidden md:inline">
                تبديل الواجهة
              </span>
            </div>
          </button>

          {/* Quick Dropdown Picker for desktop click */}
          {deviceMenuOpen && (
            <div className="absolute bottom-full mb-2 inset-x-0 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-1.5 rounded-2xl shadow-2xl flex flex-col gap-1 z-50 animate-fadeIn text-xs font-thmanyah">
              {(['mobile', 'ipad', 'desktop'] as DeviceMode[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    onSelectDevice(d);
                    setDeviceMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl text-right flex items-center justify-between font-bold ${
                    currentDevice === d
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'hover:bg-black/5 text-[var(--text-primary)]'
                  }`}
                >
                  <span>{d === 'mobile' ? '📱 واجهة جوال' : d === 'ipad' ? '📟 واجهة آيباد' : '💻 واجهة كمبيوتر'}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Right Side: تطبيق رادار مع إيموجي رادار صريح 📡 */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('radarPing');
            sounds.playTap();
            onOpenRadar();
          }}
          className="lift-3d p-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-rose-500/50 text-[var(--brand-primary)] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 font-bold text-[11px] sm:text-xs font-thmanyah transition-all cursor-pointer text-center"
          aria-label="فتح تطبيق رادار"
        >
          <div className="w-7 h-7 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center text-sm shadow-sm shrink-0">
            📡
          </div>
          <div className="flex flex-col text-center sm:text-right leading-tight">
            <span className="font-black text-xs sm:text-xs truncate">تطبيق رادار</span>
            <span className="text-[9px] text-[var(--text-secondary)] font-normal hidden md:inline">
              رصد الأصوات
            </span>
          </div>
        </button>

      </div>
    </div>
  );
}
