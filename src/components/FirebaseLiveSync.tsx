import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Cloud, CheckCircle2, RefreshCw, Smartphone, Laptop, Send, Sparkles, Database } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

interface LiveSyncData {
  content: string;
  updatedBy: string;
  lastUpdated: string;
  deviceType: string;
}

export function FirebaseLiveSync() {
  const [syncData, setSyncData] = useState<LiveSyncData>({
    content: 'برنامج مُعِين متصل الآن بقاعدة بيانات Firebase السحابية!',
    updatedBy: 'د. عمر سلمان الشمري',
    lastUpdated: new Date().toLocaleTimeString('ar-SA'),
    deviceType: 'جوال',
  });

  const [inputText, setInputText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [flashSuccess, setFlashSuccess] = useState(false);

  // 1. Real-time listener: any edit anywhere (on phone or PC) syncs instantly!
  useEffect(() => {
    const docRef = doc(db, 'live_sync', 'shared_workspace');

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setIsOnline(true);
        if (snapshot.exists()) {
          const data = snapshot.data() as LiveSyncData;
          setSyncData(data);
          setFlashSuccess(true);
          setTimeout(() => setFlashSuccess(false), 2000);
        }
      },
      (error) => {
        setIsOnline(false);
        try {
          handleFirestoreError(error, OperationType.GET, 'live_sync/shared_workspace');
        } catch {
          // Handled and logged
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Save and broadcast to Firebase immediately
  const handleSaveToFirebase = async () => {
    const textToSave = inputText.trim();
    if (!textToSave) return;

    setIsSaving(true);
    triggerHaptic('medium');
    sounds.playTap();

    try {
      const docRef = doc(db, 'live_sync', 'shared_workspace');
      const payload: LiveSyncData = {
        content: textToSave,
        updatedBy: localStorage.getItem('mueen_user_name') || 'د. عمر سلمان الشمري',
        lastUpdated: new Date().toLocaleTimeString('ar-SA'),
        deviceType: window.innerWidth < 768 ? 'الجوال (iPhone)' : 'الكمبيوتر (Web)',
      };

      await setDoc(docRef, payload);
      setInputText('');
      triggerHaptic('success');
      sounds.speakArabic('تم حفظ التعديل فورياً في قاعدة بيانات فايربيز');
    } catch (error) {
      console.error('Failed to sync with Firebase:', error);
      handleFirestoreError(error, OperationType.WRITE, 'live_sync/shared_workspace');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="firebase-sync" className="py-10 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="lift-3d rounded-3xl border border-emerald-500/30 bg-[var(--bg-card)] p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Top Firebase Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-thmanyah text-[var(--text-primary)]">
                  المزامنة السحابية الحية (Firebase Firestore)
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  متصل ومربوط
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                أي تعديل تكتبه من جوالك ينحفظ فوراً في السحابة ويظهر لكل الأجهزة بدون تحديث الصفحة!
              </p>
            </div>
          </div>

          <div className="text-left font-mono text-[10px] text-[var(--text-secondary)] space-y-0.5 bg-[var(--bg-surface)] p-2 rounded-xl border border-[var(--border-subtle)]">
            <div>
              <span className="text-emerald-500 font-bold">Project:</span> boxwood-starlight-v83d0
            </div>
            <div>
              <span className="text-amber-500 font-bold">Status:</span> Live Real-time Sync
            </div>
          </div>
        </div>

        {/* Live Cloud State Box */}
        <div className="py-5 space-y-4">
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              flashSuccess
                ? 'bg-emerald-500/20 border-emerald-500'
                : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
              <span className="flex items-center gap-1.5 font-bold font-thmanyah">
                <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                <span>البيانات المحفوظة حالياً في السحابة (تتحدث تلقائياً):</span>
              </span>
              <span className="font-mono text-[10px]">
                آخر تحديث: {syncData.lastUpdated} ({syncData.deviceType})
              </span>
            </div>

            <p className="text-sm sm:text-base font-black font-thmanyah text-[var(--text-primary)]">
              "{syncData.content}"
            </p>

            <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
              <span>
                المعدّل الأخير: <strong className="text-[var(--text-primary)]">{syncData.updatedBy}</strong>
              </span>
              <span className="flex items-center gap-1 text-emerald-500 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>متزامن مع Firebase</span>
              </span>
            </div>
          </div>

          {/* Input Box: Type to sync to phone and cloud instantly */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveToFirebase();
              }}
              placeholder="اكتب أي ملاحظة أو تعديل من جوالك أو كمبيوترك واضغط مزامنة..."
              className="flex-1 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-emerald-500"
            />

            <button
              type="button"
              onClick={handleSaveToFirebase}
              disabled={isSaving || !inputText.trim()}
              className="lift-3d px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs font-thmanyah flex items-center justify-center gap-2 shadow-lg"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري الرفع لـ Firebase...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>مزامنة فورية مع السحابة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
