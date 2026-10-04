import { useState } from 'react';
import { BookOpen, X, Search, Volume2, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { DICTIONARY_WORDS, SignWord } from '../data/mueenData';

interface SignDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord?: (word: SignWord) => void;
}

export function SignDictionaryModal({ isOpen, onClose, onSelectWord }: SignDictionaryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [activeWord, setActiveWord] = useState<SignWord>(DICTIONARY_WORDS[0]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'health', label: 'طبي وصحي 🩺' },
    { id: 'emergency', label: 'طوارئ 🚨' },
    { id: 'daily', label: 'يومي 👋' },
  ];

  const filtered = DICTIONARY_WORDS.filter((w) => {
    const matchesSearch = w.word.includes(searchQuery) || w.description.includes(searchQuery);
    const matchesCat = selectedCat === 'all' || w.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Dictionary Logo */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-card)]">
          <div className="flex items-center gap-3">
            {/* Dictionary Logo */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--brand-primary)] to-[var(--brand-accent)] text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-thmanyah">
                تطبيق قاموس مُعِين الإشاري
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                موسوعة لغة الإشارة الموحدة مع شرح حركة الكف والأصابع
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كلمة أو إشارة..."
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCat(c.id)}
                className={`lift-3d-subtle px-3 py-1.5 rounded-xl text-xs font-bold font-thmanyah whitespace-nowrap ${
                  selectedCat === c.id
                    ? 'bg-[var(--brand-primary)] text-white'
                    : 'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Word Grid + Detail Split */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* List */}
          <div className="md:col-span-5 space-y-2 overflow-y-auto max-h-[45vh] md:max-h-full">
            {filtered.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setActiveWord(w)}
                className={`lift-3d w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  activeWord.id === w.id
                    ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/15 font-bold shadow-md'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{w.visualIcon}</span>
                  <div>
                    <p className="text-xs font-bold font-thmanyah">{w.word}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1">{w.handShape}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[var(--brand-accent)]">عرض</span>
              </button>
            ))}
          </div>

          {/* Active Detail */}
          <div className="md:col-span-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 flex flex-col justify-between lift-3d">
            <div className="space-y-4 text-center sm:text-right">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <span className="text-4xl animate-bounce">{activeWord.visualIcon}</span>
                  <div className="text-right">
                    <h4 className="text-xl font-black font-thmanyah text-[var(--brand-primary)]">
                      {activeWord.word}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">{activeWord.handShape}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => speakText(activeWord.word)}
                  className="lift-3d px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] text-xs font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
                  <span>استماع</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-slate-500/5 text-center">
                <p className="text-xs font-bold mb-1">وصف أداء الإشارة:</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {activeWord.description}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-right">
                <span className="font-bold text-[11px] text-[var(--text-secondary)]">خطوات الأداء:</span>
                {activeWord.gestureFrames.map((f, idx) => (
                  <div key={idx} className="p-2 rounded-lg border border-[var(--border-subtle)] text-[11px] flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[var(--brand-primary)] text-white text-[9px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onSelectWord?.(activeWord);
                  onClose();
                }}
                className="lift-3d px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--brand-cta)' }}
              >
                <span>استخدام هذه الإشارة بالترجمة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
