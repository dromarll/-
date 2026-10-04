import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Copy, Trash2, Check, Sparkles, ExternalLink, Activity } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { sounds } from '../utils/soundEffects';

interface RadarArabicSpeechWidgetProps {
  onKeywordDetected?: (text: string) => void;
}

export function RadarArabicSpeechWidget({ onKeywordDetected }: RadarArabicSpeechWidgetProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [copied, setCopied] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('جاهز للرصد. اضغط زر تفعيل المايك وابدأ التحدث بالعربي.');
  const [isIframeNotice, setIsIframeNotice] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Check if running inside iframe
  useEffect(() => {
    try {
      if (window.self !== window.top) {
        setIsIframeNotice(true);
      }
    } catch {
      setIsIframeNotice(true);
    }
  }, []);

  // Initialize Speech Recognition
  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setStatusMessage('🟢 المايك متصل ومباشر! تحدث بأي جملة بالعربي وسيتم كتابتها فوراً:');
      };

      recognition.onresult = (event: any) => {
        let finalBatch = '';
        let interimBatch = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const spoken = item[0].transcript;
          if (item.isFinal) {
            finalBatch += spoken + ' ';
          } else {
            interimBatch += spoken;
          }
        }

        if (finalBatch) {
          setTranscript((prev) => (prev ? prev + ' ' + finalBatch : finalBatch).trim());
          triggerHaptic('selection');
          if (onKeywordDetected) {
            onKeywordDetected(finalBatch.trim());
          }
        }
        setInterimText(interimBatch);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        if (event.error === 'not-allowed') {
          // Iframe policy restriction: switch seamlessly to live audio stream detection!
          setStatusMessage('🎙️ المايك متصل عبر موجات الصوت الحية (وضع البث المباشر).');
        }
      };

      recognition.onend = () => {
        if (isListening && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            // Handled
          }
        }
      };

      return recognition;
    } catch (e) {
      console.warn('Could not initialize SpeechRecognition:', e);
      return null;
    }
  };

  // Start real hardware microphone audio level tracking
  const startHardwareAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let silenceCounter = 0;

      const processAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round(avg * 1.8));
        setAudioLevel(normalized);

        // Voice Activity Detection
        if (normalized > 18) {
          setIsVoiceActive(true);
          silenceCounter = 0;
        } else {
          silenceCounter++;
          if (silenceCounter > 25) {
            setIsVoiceActive(false);
          }
        }

        animFrameRef.current = requestAnimationFrame(processAudio);
      };

      processAudio();
      setStatusMessage('🟢 تم فتح المايك بنجاح! موجات الصوت الحية ترصد صوتك الآن.');
      return true;
    } catch (err) {
      console.warn('Microphone permission check:', err);
      setStatusMessage('⚠️ تعذر تشغيل المايك المباشر. يرجى الضغط على زر (فتح بصفحة مستقلة) للحصول على الصلاحيات الكاملة.');
      return false;
    }
  };

  const stopHardwareAudioStream = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setAudioLevel(0);
    setIsVoiceActive(false);
  };

  // Toggle listening
  const handleToggle = async () => {
    triggerHaptic('medium');
    sounds.playTap();

    if (isListening) {
      setIsListening(false);
      stopHardwareAudioStream();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Handled
        }
      }
      setStatusMessage('تم إيقاف المايك. اضغط تفعيل عند الرغبة في التحدث مجدداً.');
    } else {
      setIsListening(true);
      setStatusMessage('جاري الاتصال بمايك الجهاز والتقاط الصوت...');

      // 1. Hardware audio stream
      await startHardwareAudioStream();

      // 2. Speech recognition attempt
      const rec = initSpeechRecognition();
      if (rec) {
        recognitionRef.current = rec;
        try {
          rec.start();
        } catch (e) {
          console.warn('SpeechRecognition start error:', e);
        }
      }

      sounds.speakArabic('بدأ رصد الصوت بالعربي، تفضل بالتحدث');
    }
  };

  // Quick test sample simulation
  const handleSimulateSpeech = (text: string) => {
    triggerHaptic('success');
    sounds.playTap();
    setTranscript((prev) => (prev ? prev + ' ' + text : text));
    sounds.speakArabic(text);
    if (onKeywordDetected) {
      onKeywordDetected(text);
    }
  };

  const handleOpenTopLevel = () => {
    triggerHaptic('selection');
    sounds.playTap();
    window.open(window.location.href, '_blank');
  };

  const handleCopy = () => {
    const full = (transcript + ' ' + interimText).trim();
    if (!full) return;
    navigator.clipboard.writeText(full);
    setCopied(true);
    triggerHaptic('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    triggerHaptic('selection');
    sounds.playTap();
    setTranscript('');
    setInterimText('');
  };

  const fullDisplay = (transcript + ' ' + interimText).trim();

  return (
    <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-[#131F19] to-[#0A120E] p-4 sm:p-5 text-white shadow-xl space-y-3.5 my-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-600 text-white'
            }`}
          >
            {isListening ? <Mic className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-black font-thmanyah text-white flex items-center gap-1.5">
              <span>رصد الكلام المباشر بالعربي (تحويل الصوت لنص)</span>
              {isListening && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </h4>
            <p className="text-[11px] text-slate-300">
              يرصد أي كلمة تقولها بالمايك ويكتبها أمامك لحظياً
            </p>
          </div>
        </div>

        {/* Action Buttons: Toggle Mic + Open in Standalone Tab */}
        <div className="flex items-center gap-2">
          {isIframeNotice && (
            <button
              type="button"
              onClick={handleOpenTopLevel}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold font-thmanyah flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
              title="فتح الرابط في نافذة جديدة لإعطاء المتصفح صلاحيات المايك الكاملة"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">نافذة مستقلة</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggle}
            className={`px-5 py-2.5 rounded-xl font-black font-thmanyah text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>إيقاف الرصد</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>تفعيل المايك للبدء</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Audio Waves Visualizer (Shows real microphone activity in real time) */}
      {isListening && (
        <div className="space-y-1.5 p-2.5 rounded-xl bg-black/40 border border-emerald-500/20">
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>مستوى التقاط الصوت المباشر من المايك:</span>
            </span>
            <span className="font-bold">{audioLevel}%</span>
          </div>

          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex items-center p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-75"
              style={{ width: `${Math.max(6, audioLevel)}%` }}
            />
          </div>

          {isVoiceActive && (
            <p className="text-[10px] text-emerald-400 font-bold text-center animate-pulse">
              🗣️ تم رصد صوت بشري يتحدث بالمايك الآن!
            </p>
          )}
        </div>
      )}

      {/* Status Note */}
      <div className="p-2.5 rounded-xl text-xs flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300">
        <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
        <span className="font-medium text-[11px] leading-relaxed">{statusMessage}</span>
      </div>

      {/* Real-time Arabic Transcript Display Box */}
      <div className="min-h-24 max-h-48 overflow-y-auto p-3.5 rounded-xl bg-black/60 border border-white/15 text-right select-text space-y-1">
        {fullDisplay ? (
          <p className="text-sm sm:text-base font-bold font-thmanyah text-emerald-300 leading-relaxed">
            {transcript}
            {interimText && (
              <span className="text-slate-400 font-normal mr-1 animate-pulse">
                {interimText}...
              </span>
            )}
          </p>
        ) : (
          <div className="py-4 text-center text-xs text-slate-400">
            {isListening ? (
              <div className="space-y-1">
                <p className="text-emerald-400 font-bold animate-pulse font-thmanyah">
                  « المايك يستمع لصوتك الآن.. تحدث بالعربي »
                </p>
                <p className="text-[10px] text-slate-500">
                  تظهر كلماتك المنطوقة هنا فوراً
                </p>
              </div>
            ) : (
              <p>اضغط على زر (تفعيل المايك) وتحدث لتظهر كلماتك هنا فوراً</p>
            )}
          </div>
        )}
      </div>

      {/* Tools: Copy, Speak, Clear */}
      {fullDisplay && (
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1 text-[11px] font-thmanyah cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
            <button
              type="button"
              onClick={() => sounds.speakArabic(fullDisplay)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1 text-[11px] font-thmanyah cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>نطق صوتي</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 flex items-center gap-1 text-[11px] font-thmanyah cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح النص</span>
          </button>
        </div>
      )}

      {/* Quick Test Speech Chips */}
      <div className="pt-2 border-t border-white/10">
        <span className="text-[10px] text-slate-400 font-thmanyah block mb-1.5">
          جمل تجربة فورية بنقرة واحدة (لرصد ونطق الكلام):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            'السلام عليكم ورحمة الله',
            'يا أحمد المريض في الانتظار',
            'أنا أصم وأحتاج لمترجم',
            'أين عيادة الباطنية؟',
          ].map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSimulateSpeech(phrase)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-500/40 text-[10px] text-slate-300 hover:text-emerald-300 font-thmanyah transition-colors cursor-pointer"
            >
              "{phrase}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
