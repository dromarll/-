import { DeviceMode } from './DeviceSimulatorBar';
import { Tablet, Monitor, BookOpen, Radio, Sparkles } from 'lucide-react';
import { DICTIONARY_WORDS } from '../data/mueenData';

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
  // If user selected mobile, scroll to or show iPhone 17 preview
  if (device === 'mobile') {
    return null; // The dedicated iPhone 17 section handles mobile elegantly!
  }

  const sampleSign = DICTIONARY_WORDS[0];

  return (
    <section id="device-preview" className="py-12 relative flex justify-center items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col items-center">
        <div className="mb-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-accent)]">
            معاينة الواجهة التفاعلية
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-thmanyah mt-1">
            {device === 'ipad' ? 'واجهة جهاز الآيباد (مخصصة للعيادات والمراكز الصحية)' : 'واجهة الكمبيوتر المكتبي والشاشات العريضة'}
          </h3>
        </div>

        {/* IPAD TABLET MOCKUP */}
        {device === 'ipad' && (
          <div className="relative w-full max-w-3xl h-[520px] rounded-[40px] p-4 bg-[#21242B] border-[6px] border-[#3E424B] shadow-2xl flex flex-col lift-3d animate-fadeIn text-white">
            <div className="w-full h-full rounded-[28px] bg-[#0E1511] p-5 flex flex-col justify-between border border-white/10">
              {/* Tablet Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold font-thmanyah">برنامج مُعِين — محطة الآيباد للعيادات</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onOpenRadar}
                    className="px-2.5 py-1 text-xs rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                  >
                    رادار المايك
                  </button>
                  <button
                    type="button"
                    onClick={onOpenDictionary}
                    className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                  >
                    القاموس
                  </button>
                </div>
              </div>

              {/* Split Tablet Screen */}
              <div className="flex-1 grid grid-cols-2 gap-4 py-3">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl animate-bounce mb-2">{sampleSign.visualIcon}</span>
                  <h4 className="text-base font-bold font-thmanyah">{sampleSign.word}</h4>
                  <p className="text-xs text-slate-400 mt-1">{sampleSign.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between text-right">
                  <p className="text-xs text-slate-400">توجيهات الطبيب للترجمة الإشارية:</p>
                  <p className="text-sm font-bold font-thmanyah text-emerald-300 my-auto">
                    "أهلاً بك، لا تقلق سنقوم بالفحص الطبي والتشخيص السريع."
                  </p>
                  <span className="text-[10px] text-slate-400">ترجمة عصبية فورية عالية الدقة</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
                <span>معتمد في غرف الطوارئ والمستشفيات</span>
                <span>رؤية 2030</span>
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP WIDESCREEN MOCKUP */}
        {device === 'desktop' && (
          <div className="w-full max-w-4xl rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl lift-3d space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[var(--brand-accent)]" />
                <h4 className="text-base font-bold font-thmanyah">واجهة الكمبيوتر والشاشات الكبيرة</h4>
              </div>
              <span className="text-xs font-mono text-[var(--brand-accent)] bg-[var(--brand-accent)]/15 px-2.5 py-0.5 rounded">
                Widescreen Hub
              </span>
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
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">رصد نداء الأسماء والأصوات</p>
              </div>
              <div className="p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] lift-3d-subtle">
                <p className="text-xs font-bold font-thmanyah">القاموس المعتمد</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">مرجع إشاري موحد للجهات</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
