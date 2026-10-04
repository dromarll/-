import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Copy, Trash2, ChevronUp, ChevronDown, Sparkles, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

// Extended window type for Web Speech API
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function LiveArabicMicTranscriber() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [supportError, setSupportError] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupportError(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA'; // Arabic (Saudi Arabia)
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        const text = item[0].transcript;
        if (item.isFinal) {
          finalStr += text + ' ';
        } else {
          interimStr += text;
        }
      }

      if (finalStr) {
        setTranscript((prev) => (prev ? prev + ' ' + finalStr : finalStr).trim());
        triggerHaptic('selection');
      }
      setInterimTranscript(interimStr);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Auto-restart if user still wants it listening
      if (recognitionRef.current && isListening) {
        try {
          recognition.start();
        } catch {
          // Handled
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Handled
        }
      }
      stopAudioAnalysis();
    };
  }, [isListening]);

  // Audio frequency meter for dynamic pulse
  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setAudioLevel(Math.min(100, Math.round(avg * 1.5)));
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();
    } catch (err) {
      console.warn('Microphone stream access warning:', err);
    }
  };

  const stopAudioAnalysis = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setAudioLevel(0);
  };

  // Toggle listening
  const handleToggleListening = () => {
    triggerHaptic('medium');
    sounds.playTap();

    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Handled
        }
      }
      stopAudioAnalysis();
      sounds.speakArabic('تم إيقاف المايك');
    } else {
      setIsListening(true);
      setIsExpanded(true); // Automatically open to show the live transcript
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn(e);
        }
      }
      startAudioAnalysis();
      sounds.speakArabic('بدأ رصد الكلام بالعربي، تفضل بالتحدث');
    }
  };

  const handleCopy = () => {
    const textToCopy = (transcript + ' ' + interimTranscript).trim();
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    triggerHaptic('success');
    sounds.playTap();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    triggerHaptic('selection');
    sounds.playTap();
    setTranscript('');
    setInterimTranscript('');
  };

  const fullText = (transcript + ' ' + interimTranscript).trim();

  return (
    <aside aria-label="رصد الصوت المباشر" className="fixed bottom-24 sm:bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 select-none animate-fadeIn">
      <div className="lift-3d rounded-2xl sm:rounded-3xl border border-emerald-500/40 bg-[#0F1713]/95 backdrop-blur-xl text-white shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header Tab Bar (تبويب صغير يرصد الكلام بالعربي) */}
        <div className="p-3 sm:p-3.5 flex items-center justify-between border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleListening}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title={isListening ? 'إيقاف المايك' : 'تفعيل المايك'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black font-thmanyah text-white">
                  رصد الكلام المباشر بالعربي
                </span>
                {isListening && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
              <p className="text-[10px] text-slate-300">
                {isListening ? 'تحدث الآن، يرصد كلامك فوراً:' : 'اضغط تفعيل المايك للبدء'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Mic Button */}
            <button
              type="button"
              onClick={handleToggleListening}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black font-thmanyah transition-all cursor-pointer shadow-sm ${
                isListening
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40 hover:bg-rose-600 hover:text-white'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950'
              }`}
            >
              {isListening ? 'إيقاف' : 'تفعيل المايك'}
            </button>

            {/* Expand / Minimize Arrow */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setIsExpanded(!isExpanded);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title={isExpanded ? 'تصغير' : 'توسيع'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer Bar when listening */}
        {isListening && (
          <div className="h-1 bg-black/40 overflow-hidden flex items-center px-1">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-75 rounded-full"
              style={{ width: `${Math.max(8, audioLevel)}%` }}
            />
          </div>
        )}

        {/* Expanded Transcription Box (يحطه بشكل مباشر مكتوب بالعربي) */}
        {isExpanded && (
          <div className="p-3 sm:p-4 space-y-3 bg-[#0A110D]">
            {/* Live Text Area */}
            <div className="min-h-20 max-h-40 overflow-y-auto p-3 rounded-xl bg-black/60 border border-white/10 text-right space-y-1 select-text">
              {fullText ? (
                <p className="text-xs sm:text-sm font-bold font-thmanyah text-emerald-300 leading-relaxed">
                  {transcript}
                  {interimTranscript && (
                    <span className="text-slate-400 font-normal mr-1 animate-pulse">
                      {interimTranscript}...
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic py-3 text-center">
                  {isListening
                    ? 'جاري الاستماع... تحدث باللغة العربية وسيظهر كلامك هنا فوراً.'
                    : 'اضغط على زر (تفعيل المايك) وابدأ التحدث بالعربي.'}
                </p>
              )}
            </div>

            {/* Quick Action Tools: Copy, Clear, Speech */}
            {fullText && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-thmanyah transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => sounds.speakArabic(fullText)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-thmanyah transition-colors"
                    title="نطق النص صوتياً"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>نطق</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 flex items-center gap-1 text-[11px] font-thmanyah transition-colors"
                  title="مسح الكلام"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>مسح</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
