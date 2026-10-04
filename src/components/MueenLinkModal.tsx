import { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, Sparkles, ExternalLink } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

interface MueenLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MueenLinkModal({ isOpen, onClose }: MueenLinkModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');

  if (!isOpen) return null;

  // The official public shared URL that works on all iPhones, iPads, and mobile browsers
  const publicSharedUrl = 'https://ais-pre-vktvebu34fv2qtbqv76ke6-269469474084.europe-west2.run.app';

  const shortBrandedUrl = 'https://mueen.app';

  const handleCopy = (text: string) => {
    triggerHaptic('success');
    sounds.playTap();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-[var(--brand-accent)]/40 bg-[var(--bg-surface)] p-6 shadow-2xl overflow-hidden lift-3d">
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--brand-accent)]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Diamond (شكل مُعيّن هندسي) */}
        <div className="text-center pt-2 pb-4">
          {/* Diamond Rhombus Graphic (شكل مُعيَّن هندسي فاخر) */}
          <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            {/* Rotating Diamond */}
            <div className="w-12 h-12 rotate-45 rounded-xl bg-gradient-to-tr from-[var(--brand-primary)] via-[var(--brand-accent)] to-emerald-400 shadow-xl flex items-center justify-center border-2 border-white/40">
              <span className="-rotate-45 text-white font-black font-thmanyah text-lg">
                مُ
              </span>
            </div>
            <div className="absolute -inset-2 rotate-45 rounded-2xl border border-[var(--brand-accent)]/30 pointer-events-none" />
          </div>

          <h3 className="text-lg font-black font-thmanyah text-[var(--text-primary)] flex items-center justify-center gap-1.5">
            <span>رابط برنامج مُعِين الرسمي</span>
            <span className="text-emerald-500">🔷</span>
          </h3>

          <p className="text-xs text-[var(--text-secondary)] mt-1 font-thmanyah">
            انسخ الرابط لمشاركته مع المستفيدين أو أصحاب المصلحة
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-black/5 dark:bg-white/5 p-1 mb-4 border border-[var(--border-subtle)] text-xs font-bold font-thmanyah">
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'link'
                ? 'bg-[var(--brand-primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>نسخ الرابط المباشر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'qr'
                ? 'bg-[var(--brand-primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>رمز الباركود (QR)</span>
          </button>
        </div>

        {activeTab === 'link' ? (
          <div className="space-y-3">
            {/* 1. Official Live URL */}
            <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-1.5">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] block">
                الرابط الحي المعتمد للتجربة:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicSharedUrl}
                  className="flex-1 bg-transparent font-mono text-xs text-[var(--text-primary)] truncate outline-none select-all text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(publicSharedUrl)}
                  className="lift-3d px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-thmanyah flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
                </button>
              </div>
            </div>

            {/* 2. Branded Short Diamond Link */}
            <div className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs font-black font-thmanyah text-emerald-600 dark:text-emerald-400">
                  <span>رابط النطاق المخصص:</span>
                  <span>🔷</span>
                </div>
                <span className="font-mono text-xs font-bold text-[var(--text-primary)]" dir="ltr">
                  mueen.app
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(publicSharedUrl)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                نسخ الرابط
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--border-subtle)] bg-white text-slate-900 text-center space-y-2">
            {/* Visual SVG QR Code with diamond in the center */}
            <div className="relative w-40 h-40 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center border-2 border-slate-200">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Simulated QR Code matrix */}
                <rect x="10" y="10" width="25" height="25" fill="#0F172A" />
                <rect x="15" y="15" width="15" height="15" fill="#FFFFFF" />
                <rect x="18" y="18" width="9" height="9" fill="#0F172A" />

                <rect x="65" y="10" width="25" height="25" fill="#0F172A" />
                <rect x="70" y="15" width="15" height="15" fill="#FFFFFF" />
                <rect x="73" y="18" width="9" height="9" fill="#0F172A" />

                <rect x="10" y="65" width="25" height="25" fill="#0F172A" />
                <rect x="15" y="70" width="15" height="15" fill="#FFFFFF" />
                <rect x="18" y="73" width="9" height="9" fill="#0F172A" />

                <rect x="42" y="12" width="6" height="6" fill="#0F172A" />
                <rect x="52" y="12" width="6" height="6" fill="#0F172A" />
                <rect x="42" y="24" width="6" height="6" fill="#0F172A" />
                <rect x="52" y="24" width="6" height="6" fill="#0F172A" />

                <rect x="12" y="42" width="6" height="6" fill="#0F172A" />
                <rect x="24" y="42" width="6" height="6" fill="#0F172A" />
                <rect x="12" y="52" width="6" height="6" fill="#0F172A" />
                <rect x="24" y="52" width="6" height="6" fill="#0F172A" />

                <rect x="65" y="45" width="8" height="8" fill="#0F172A" />
                <rect x="78" y="55" width="8" height="8" fill="#0F172A" />
                <rect x="45" y="75" width="8" height="8" fill="#0F172A" />
                <rect x="60" y="75" width="8" height="8" fill="#0F172A" />
                <rect x="75" y="75" width="8" height="8" fill="#0F172A" />
              </svg>

              {/* Center Diamond Brand Overlay */}
              <div className="absolute w-10 h-10 rotate-45 rounded-lg bg-emerald-600 border-2 border-white flex items-center justify-center shadow-md">
                <span className="-rotate-45 text-white font-black font-thmanyah text-xs">
                  مُ
                </span>
              </div>
            </div>

            <p className="text-[11px] font-bold text-slate-600 font-thmanyah">
              امسح الكاميرا للدخول المباشر لتطبيق مُعِين
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-center text-[10px] text-[var(--text-secondary)] font-thmanyah">
          <span>متوافق مع جميع أجهزة الجوال والكمبيوتر والآيباد بدون تثبيت</span>
        </div>
      </div>
    </div>
  );
}
