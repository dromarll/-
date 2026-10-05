import { useState } from 'react';
import { DeviceMode } from './DeviceSimulatorBar';
import { Tablet, Monitor, BookOpen, Radio, Sparkles, Maximize2, Minimize2, X, Volume2, Hand, MessageSquare } from 'lucide-react';
import { DICTIONARY_WORDS } from '../data/mueenData';
import { sounds } from '../utils/soundEffects';
import { triggerHaptic } from '../utils/haptics';

interface InteractiveDevicePreviewProps {
  device: DeviceMode;
  onOpenDictionary: () => void;
  onOpenRadar: () => void;
}

export function InteractiveDevicePreview({
  device,
  onOpenDictionary,
  onOpenRadar
}: InteractiveDevicePreviewProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [sampleIdx, setSampleIdx] = useState(0);
  const sampleSign = DICTIONARY_WORDS[sampleIdx];

  // If user selected mobile, scroll to or show iPhone 17 preview
  if (device === 'mobile') {
    return null; // The dedicated iPhone 17 section handles mobile elegantly!
  }

  const toggleZoom = () => {
    triggerHaptic('medium');
    sounds.playTap();
    setIsZoomed(!isZoomed);
  };

  return (
    <section id="device-preview" className="py-12 relative flex justify-center items-center select-none font-thmanyah">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col items-center">
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>محاكي الواجهات المتعددة</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black font-thmanyah mt-1">
            {device === 'ipad' ? 'واجهة جهاز الآيباد (مخصصة للعيادات والمراكز الصحية)' : 'واجهة الكمبيوتر المكتبي والشاشات العريضة'}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            انقر على زر التكبير أو على الجهاز نفسه لتكبير الشاشة بالكامل (Zoom)
          </p>
        </div>

        {/* IPAD TABLET MOCKUP */}
        {device === 'ipad' && (
          <div className="relative w-full max-w-3xl flex flex-col items-center">
            {/* Zoom Action Bar */}
            <div className="w-full flex justify-end mb-2">
              <button
                type="button"
                onClick={toggleZoom}
                className="lift-3d px-3.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>تكبير واجهة الآيباد (Zoom)</span>
              </button>
            </div>

            <div
              onClick={toggleZoom}
              className="relative w-full h-[520px] rounded-[42px] p-4 bg-[#21242B] border-[6px] border-[#3E424B] shadow-2xl flex flex-col lift-3d animate-fadeIn text-white cursor-pointer group"
            >
              <div className="w-full h-full rounded-[30px] bg-[#0E1511] p-5 flex flex-col justify-between border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                {/* Tablet Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-bold font-thmanyah">برنامج مُعِين — محطة الآيباد للعيادات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md font-mono border border-cyan-500/30">
                      iPad Pro 12.9"
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRadar();
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                    >
                      رادار المايك
                    </button>
                  </div>
                </div>

                {/* Split Tablet Screen */}
                <div className="flex-1 grid grid-cols-2 gap-4 py-3">
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl mb-2 filter drop-shadow">{sampleSign.visualIcon}</span>
                    <h4 className="text-base font-bold font-thmanyah text-white">{sampleSign.word}</h4>
                    <p className="text-xs text-slate-300 mt-1">{sampleSign.description}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.speakArabic(sampleSign.word);
                      }}
                      className="mt-2 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>نطق الإشارة</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between text-right">
                    <div>
                      <p className="text-xs text-slate-400">توجيهات الطبيب للترجمة الإشارية:</p>
                      <p className="text-sm font-bold font-thmanyah text-emerald-300 mt-2">
                        "أهلاً بك، لا تقلق سنقوم بالفحص الطبي والتشخيص السريع."
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[10px] text-slate-300 space-y-1">
                      <span className="text-emerald-400 font-bold block">مزامنة سريعة مع الطبيب:</span>
                      <p>استشارة فورية · خصوصية تامة · تشخيص بالذكاء الاصطناعي</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
                  <span>معتمد في غرف الطوارئ والمستشفيات</span>
                  <span className="text-cyan-400 font-bold">انقر لتكبير الشاشة كاملة 🔍</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP WIDESCREEN MOCKUP */}
        {device === 'desktop' && (
          <div className="w-full max-w-4xl flex flex-col items-center">
            {/* Zoom Action Bar */}
            <div className="w-full flex justify-end mb-2">
              <button
                type="button"
                onClick={toggleZoom}
                className="lift-3d px-3.5 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>تكبير واجهة الكمبيوتر (Zoom)</span>
              </button>
            </div>

            <div
              onClick={toggleZoom}
              className="w-full rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl lift-3d space-y-4 animate-fadeIn cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-[var(--brand-accent)]" />
                  <h4 className="text-base font-bold font-thmanyah">واجهة الكمبيوتر والشاشات الكبيرة</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--brand-accent)] bg-[var(--brand-accent)]/15 px-2.5 py-0.5 rounded">
                    Widescreen Hub 4K
                  </span>
                  <span className="text-xs text-indigo-400 font-bold">انقر للتكبير 🔍</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                توفر محطة الكمبيوتر رؤية شاملة للمؤسسات، والمطارات، والمستشفيات لإدارة الرادار الصوتي وترجمة لغة الإشارة في آنٍ واحد.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] lift-3d-subtle">
                  <p className="text-xs font-bold font-thmanyah">الترجمة الثنائية</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">كاميرا تتبع الكف + نطق فوري</p>
                </div>
                <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] lift-3d-subtle">
                  <p className="text-xs font-bold font-thmanyah">رادار المايك الصوتي</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">رصد نداء الأسماء والأصوات مع الجهة</p>
                </div>
                <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] lift-3d-subtle">
                  <p className="text-xs font-bold font-thmanyah">القاموس المعتمد</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">مرجع إشاري موحد للجهات</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FULLSCREEN ZOOM MODAL FOR IPAD & DESKTOP */}
        {isZoomed && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
            {/* Top Bar of Zoom View */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 max-w-6xl w-full mx-auto">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{device === 'ipad' ? '📟' : '💻'}</span>
                <div>
                  <h3 className="text-base sm:text-xl font-black font-thmanyah text-white">
                    {device === 'ipad' ? 'معاينة شاشة الآيباد المكبرة بالكامل (iPad Zoom Hub)' : 'معاينة شاشة الكمبيوتر المكبرة بالكامل (Desktop Zoom Hub)'}
                  </h3>
                  <span className="text-xs text-slate-400">واجهة تفاعلية حية بكامل أبعاد الشاشة</span>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleZoom}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
                <span>إغلاق التكبير (ESC)</span>
              </button>
            </div>

            {/* Main Interactive Zoom Stage */}
            <div className="flex-1 max-w-6xl w-full mx-auto my-4 rounded-3xl border border-white/20 bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch my-auto">
                <div className="md:col-span-6 p-6 rounded-2xl bg-black/60 border border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-7xl filter drop-shadow">{sampleSign.visualIcon}</span>
                  <h4 className="text-2xl font-black font-thmanyah text-emerald-400">{sampleSign.word}</h4>
                  <p className="text-xs text-slate-300 max-w-md">{sampleSign.description}</p>
                  <button
                    type="button"
                    onClick={() => sounds.speakArabic(sampleSign.word)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-thmanyah flex items-center gap-2 shadow-lg"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>نطق العبارة فورياً</span>
                  </button>
                </div>

                <div className="md:col-span-6 p-6 rounded-2xl bg-[#14202B] border border-cyan-500/30 flex flex-col justify-between space-y-4 text-right">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-cyan-400">توجيهات المحطة المركزية:</span>
                    <h5 className="text-lg font-black font-thmanyah text-white">
                      مستشفى الملك فهد التخصصي — العيادات الخارجية
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      يعمل النظام بتوافق عصبي مباشر مع كاميرات الكف والرادار، ويوفر قراءة واضحة للمراجعين الصم والأطباء.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between font-mono text-emerald-400 text-[11px]">
                      <span>الحالة: متصل 100%</span>
                      <span>زمن الاستجابة: 24ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="max-w-6xl w-full mx-auto flex justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
              <span>برنامج مُعِين التفاعلي</span>
              <span>رؤية المملكة 2030</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
