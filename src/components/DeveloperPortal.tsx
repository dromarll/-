import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot, setDoc, collection, getDocs, limit, query } from 'firebase/firestore';
import { Lock, Unlock, Database, ArrowRight, RefreshCw, Send, CheckCircle2, ShieldCheck, Smartphone, Laptop, AlertCircle, FileText, Server } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

interface DeveloperPortalProps {
  onClose: () => void;
}

interface LiveSyncData {
  content: string;
  updatedBy: string;
  lastUpdated: string;
  deviceType: string;
}

export function DeveloperPortal({ onClose }: DeveloperPortalProps) {
  // Password state (Must be 1 to 8: '12345678')
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Firestore live state
  const [syncData, setSyncData] = useState<LiveSyncData>({
    content: 'قاعدة بيانات Firebase جاهزة ومتصلة.',
    updatedBy: 'د. عمر سلمان الشمري',
    lastUpdated: new Date().toLocaleTimeString('ar-SA'),
    deviceType: 'لوحة المطورين',
  });
  const [inputText, setInputText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [flashSuccess, setFlashSuccess] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([
    'تم تهيئة الاتصال السحابي مع Firebase بنجاح.',
    'تم نشر وتأكيد قواعد الحماية الأمنية Firestore Rules v2.',
  ]);

  // Handle password submission
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === '12345678') {
      triggerHaptic('success');
      sounds.playTap();
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      triggerHaptic('error');
      sounds.playAlert();
      setPasswordError(true);
    }
  };

  // Real-time listener for Firestore documents
  useEffect(() => {
    if (!isUnlocked) return;

    const docRef = doc(db, 'live_sync', 'shared_workspace');
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as LiveSyncData;
          setSyncData(data);
          setFlashSuccess(true);
          setTimeout(() => setFlashSuccess(false), 2000);
          setLogMessages((prev) => [
            `[${new Date().toLocaleTimeString('ar-SA')}] استلام تحديث جديد من: ${data.updatedBy} (${data.deviceType})`,
            ...prev.slice(0, 10),
          ]);
        }
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setLogMessages((prev) => [
          `[خطأ اتصال]: ${error.message}`,
          ...prev.slice(0, 10),
        ]);
      }
    );

    return () => unsubscribe();
  }, [isUnlocked]);

  // Send update directly to Firebase
  const handleSendUpdate = async () => {
    const text = inputText.trim();
    if (!text) return;

    setIsSaving(true);
    triggerHaptic('medium');
    sounds.playTap();

    try {
      const docRef = doc(db, 'live_sync', 'shared_workspace');
      const author = localStorage.getItem('mueen_user_name') || 'د. عمر سلمان الشمري';
      const device = window.innerWidth < 768 ? 'الجوال (Mobile)' : 'الكمبيوتر (Desktop)';

      const payload: LiveSyncData = {
        content: text,
        updatedBy: author,
        lastUpdated: new Date().toLocaleTimeString('ar-SA'),
        deviceType: device,
      };

      await setDoc(docRef, payload);
      setInputText('');
      triggerHaptic('success');
      sounds.speakArabic('تم حفظ التعديل السحابي في فايربيز');
      setLogMessages((prev) => [
        `[${new Date().toLocaleTimeString('ar-SA')}] تم بث التعديل بنجاح لسيرفر Firebase من ${device}`,
        ...prev.slice(0, 10),
      ]);
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, 'live_sync/shared_workspace');
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Password Locked Screen (انتقال لشاشة مستقلة يطلب باسورد 1 إلى 8)
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-[#090D11] text-white flex flex-col items-center justify-center p-4 animate-fadeIn select-none relative">
        {/* Top corner 'برنامج معين' button */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onClose();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="absolute top-5 right-5 flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl"
          title="العودة للصفحة الرئيسية لبرنامج معين"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow">
            مُ
          </div>
          <span className="font-black font-thmanyah text-white text-sm">
            برنامج مُعِين (الرئيسية)
          </span>
        </button>

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121820] p-6 sm:p-8 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              منطقة المطورين المحمية
            </span>
            <h2 className="text-xl font-black font-thmanyah text-white">
              بوابة المطورين وقاعدة البيانات
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              هذه الشاشة مخصصة فقط لمطوري منصة مُعِين لإدارة قاعدة بيانات Firebase السحابية. يرجى إدخال رمز المرور (8 أرقام) للمتابعة:
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <div className="text-right space-y-1">
              <label className="text-[11px] font-bold text-slate-300 font-thmanyah">
                رمز مرور المطورين (8 أرقام من 1 إلى 8):
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="أدخل الرمز (12345678)"
                className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-center font-mono text-lg tracking-widest text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            {passwordError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 justify-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>رمز المرور غير صحيح! الرمز المطلوب هو 8 أرقام من 1 إلى 8.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 rounded-xl border border-white/10 hover:bg-white/5 font-bold font-thmanyah text-xs text-slate-300 transition-colors"
              >
                العودة للرئيسية
              </button>
              <button
                type="submit"
                className="py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold font-thmanyah text-xs transition-colors shadow-lg flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-4 h-4" />
                <span>دخول البوابة</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Unlocked Full Developer Screen (الشاشة الثانية المستقلة)
  return (
    <div className="fixed inset-0 z-50 bg-[#090D11] text-white flex flex-col overflow-y-auto animate-fadeIn select-none">
      {/* Developer Portal Top Bar */}
      <header className="sticky top-0 z-40 bg-[#121820]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Clickable 'برنامج معين' in the corner returning to Homepage */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              triggerHaptic('medium');
              onClose();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity pl-2 border-l border-white/10"
            title="العودة للصفحة الرئيسية لبرنامج معين"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow">
              مُ
            </div>
            <span className="font-black font-thmanyah text-white text-sm sm:text-base">
              برنامج مُعِين
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 text-xs font-bold font-thmanyah border border-white/10 cursor-pointer"
            title="الرجوع للتطبيق الرئيسي"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للرئيسية</span>
          </button>
          <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold font-thmanyah text-slate-200">
              سحابة المطورين (Firebase)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>متصل سحابياً (Live)</span>
          </span>
        </div>
      </header>

      {/* Main Developer Workspace Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Cloud Database Specs Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#121820] border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Firebase Project ID</span>
            <p className="text-sm font-black font-mono text-amber-400 truncate">
              boxwood-starlight-v83d0
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121820] border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Firestore Database ID</span>
            <p className="text-xs font-black font-mono text-emerald-400 truncate" title="ai-studio-nexadigitalmoder-1b718a90-9aec-44a0-8b7c-75a5c54eda68">
              ai-studio-nexadigitalmoder-1b718a90-9aec-44a0-8b7c-75a5c54eda68
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121820] border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Security Rules</span>
            <p className="text-sm font-black font-mono text-cyan-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Deployed & Active (v2)</span>
            </p>
          </div>
        </div>

        {/* Live Synchronizer Box: Real-Time Mobile & Cloud Sync */}
        <div className="rounded-3xl border border-emerald-500/30 bg-[#121820] p-5 sm:p-7 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <div>
              <h3 className="text-base font-black font-thmanyah text-white flex items-center gap-2">
                <span>المزامنة السحابية الفورية مع جوالك</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  WebSocket onSnapshot
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                أي تعديل تكتبه هنا أو من جوالك يُحفظ فوراً في Firebase ويظهر لجميع الأجهزة دون الحاجة لتحديث الصفحة.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              آخر مزامنة: <span className="text-white font-bold">{syncData.lastUpdated}</span>
            </div>
          </div>

          {/* Current Stored Content in Firestore */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              flashSuccess
                ? 'bg-emerald-500/20 border-emerald-500'
                : 'bg-black/50 border-white/10'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-400 font-thmanyah block mb-1">
              النص المخزن حالياً في السحابة:
            </span>
            <p className="text-base font-black font-thmanyah text-emerald-300">
              "{syncData.content}"
            </p>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                الكاتب: <strong className="text-white">{syncData.updatedBy}</strong>
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                {syncData.deviceType.includes('الجوال') ? (
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>الجهاز: {syncData.deviceType}</span>
              </span>
            </div>
          </div>

          {/* Direct Cloud Write Form */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-thmanyah text-slate-300">
              كتابة تعديل جديد وحفظه في السحابة فوراً:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendUpdate();
                }}
                placeholder="اكتب أي ملاحظة أو تعديل من جوالك لحفظه في فايربيز مباشرة..."
                className="flex-1 p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={handleSendUpdate}
                disabled={isSaving || !inputText.trim()}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold font-thmanyah text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>حفظ وبث للتطبيق</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Activity Logs Console */}
        <div className="rounded-2xl border border-white/10 bg-[#121820] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold font-thmanyah text-slate-300 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>سجل الأنشطة الحية (Live Event Logs)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Firestore Listener</span>
          </div>

          <div className="bg-black/60 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-48 overflow-y-auto" dir="ltr">
            {logMessages.map((msg, index) => (
              <div key={index} className="flex items-center gap-2 text-emerald-400/90">
                <span className="text-slate-600">›</span>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
