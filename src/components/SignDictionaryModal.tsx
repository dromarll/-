import { useState } from 'react';
import { BookOpen, X, Search, Volume2, ArrowLeft, Sparkles, Hand, ChevronRight, Check } from 'lucide-react';
import { DICTIONARY_WORDS, SignWord } from '../data/mueenData';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

interface SignDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord?: (word: SignWord) => void;
}

export function SignDictionaryModal({ isOpen, onClose, onSelectWord }: SignDictionaryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [activeWord, setActiveWord] = useState<SignWord>(DICTIONARY_WORDS[0]);
  const [mobileTab, setMobileTab] = useState<'list' | 'detail'>('list');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'health', label: 'طبي وصحي 🩺' },
    { id: 'emergency', label: 'طوارئ 🚨' },
    { id: 'daily', label: 'يومي 👋' },
    { id: 'family', label: 'العائلة 👨‍👩‍👧' },
  ];

  const filtered = DICTIONARY_WORDS.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || w.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleSelectWord = (w: SignWord) => {
    triggerHaptic('selection');
    sounds.playTap();
    setActiveWord(w);
    setMobileTab('detail');
    sounds.speakArabic(w.word);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[92vh] sm:h-[86vh] rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className="p-3.5 sm:p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-card)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md text-lg">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-thmanyah">
                  قاموس مُعِين الإشاري المعتمد
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  22 دولة عربية 🇸🇦
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                تصفح الكلمات وتعرف على حركة اليد ومفاصل الأصابع
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-black/10 transition-colors text-slate-400 hover:text-white"
            aria-label="إغلاق القاموس"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile View Switcher (قائمة الكلمات vs بطاقة الإشارة) */}
        <div className="flex md:hidden p-2 bg-[var(--bg-card)]/50 border-b border-[var(--border-subtle)] gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold font-thmanyah transition-colors ${
              mobileTab === 'list'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white/5 text-[var(--text-secondary)]'
            }`}
          >
            قائمة الكلمات ({filtered.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('detail')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold font-thmanyah transition-colors ${
              mobileTab === 'detail'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white/5 text-[var(--text-secondary)]'
            }`}
          >
            تفاصيل الإشارة: {activeWord.word}
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-3 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row gap-2.5 items-center justify-between shrink-0 bg-[var(--bg-surface)]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كلمة، مرض، أو إشارة..."
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCat(c.id);
                }}
                className={`lift-3d-subtle px-3 py-1.5 rounded-xl text-xs font-bold font-thmanyah whitespace-nowrap transition-all ${
                  selectedCat === c.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area: Responsive Grid (No scroll-traps) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Words List Column */}
          <div
            className={`md:col-span-5 border-l border-[var(--border-subtle)] p-3 overflow-y-auto space-y-2 ${
              mobileTab === 'list' ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="flex items-center justify-between pb-1 text-xs text-[var(--text-secondary)] font-bold">
              <span>الكلمات المتوفرة:</span>
              <span>{filtered.length} إشارة</span>
            </div>

            {filtered.map((w) => {
              const isSelected = activeWord.id === w.id;
              return (
                <div
                  key={w.id}
                  onClick={() => handleSelectWord(w)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
                      {w.visualIcon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black font-thmanyah text-white">
                        {w.word}
                      </h4>
                      <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                        {w.handShape}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-400 font-thmanyah">
                      عرض
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 rotate-180" />
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <p className="text-sm font-bold font-thmanyah">لا توجد نتائج مطابقة</p>
                <p className="text-xs">جرّب كتابة كلمة أخرى مثل: طبيب، ألم، سلام، دواء</p>
              </div>
            )}
          </div>

          {/* Word Detail & 3D Vector Hand Preview */}
          <div
            className={`md:col-span-7 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-4 ${
              mobileTab === 'detail' ? 'block' : 'hidden md:flex'
            }`}
          >
            <div className="space-y-4">
              {/* Word Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/50 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner">
                    {activeWord.visualIcon}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black font-thmanyah text-white">
                      {activeWord.word}
                    </h3>
                    <p className="text-xs text-emerald-300 font-thmanyah mt-0.5">
                      {activeWord.handShape}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    sounds.playTap();
                    sounds.speakArabic(activeWord.word);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-thmanyah flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                  title="استماع للنطق بصوت جيمناي الفصيح"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استماع</span>
                </button>
              </div>

              {/* Movement & Action Description */}
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-thmanyah">
                  <Hand className="w-4 h-4" />
                  <span>طريقة أداء حركة الإشارة:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {activeWord.description}
                </p>
                {activeWord.movementNote && (
                  <p className="text-[11px] text-emerald-300/90 pt-1 border-t border-white/5">
                    💡 <span className="font-bold font-thmanyah">ملاحظة الاستخدام:</span> {activeWord.movementNote}
                  </p>
                )}
              </div>

              {/* Step-by-Step Gesture Sequence */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-[var(--text-secondary)] font-thmanyah">
                  خطوات الحركة بالتسلسل:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeWord.gestureFrames.map((frame, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between text-right"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center mb-1.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-white font-bold font-thmanyah">{frame}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className="md:hidden px-3 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-bold"
              >
                ← العودة للقائمة
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('success');
                  sounds.playTap();
                  onSelectWord?.(activeWord);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs font-thmanyah text-white flex items-center gap-2 shadow-md transition-colors mr-auto"
              >
                <span>استخدام الإشارة في الكاميرا والترجمة</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
