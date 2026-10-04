/**
 * Enhanced Web Audio Synthesizer and Voice Manager
 * Works immediately on iOS Safari and Desktop browsers without downloading external files
 */

class SoundManager {
  private ctx: AudioContext | null = null;

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Realistic Camera Shutter Click Snap
  playShutter() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Click 1 (Mirror flip)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(950, now);
      osc1.frequency.exponentialRampToValueAtTime(180, now + 0.04);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.04);

      // Click 2 (Shutter curtain snap)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1400, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain2.gain.setValueAtTime(0.4, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.12);

      if ('vibrate' in navigator) {
        navigator.vibrate([35, 20, 40]);
      }
    } catch {
      // audio fallback silent
    }
  }

  // 2. Hospital / Airport Chime Announcement (Ding - Dong - Dang)
  playHospitalChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Note 1: F5 (698.46 Hz)
      this.playTone(698.46, now, 0.4, 0.25);
      // Note 2: A5 (880 Hz)
      this.playTone(880, now + 0.35, 0.45, 0.25);
      // Note 3: C6 (1046.5 Hz)
      this.playTone(1046.5, now + 0.75, 0.7, 0.25);

      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50, 100, 80]);
      }
    } catch {
      // audio fallback silent
    }
  }

  // 3. Doorbell Ring (Ding - Dong)
  playDoorbell() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Ding (E5: 659.25 Hz)
      this.playTone(659.25, now, 0.6, 0.3);
      // Dong (C5: 523.25 Hz)
      this.playTone(523.25, now + 0.45, 0.9, 0.3);

      if ('vibrate' in navigator) {
        navigator.vibrate([80, 50, 120]);
      }
    } catch {
      // audio fallback silent
    }
  }

  // 4. Car Horn Warning (Dual-tone 400Hz + 480Hz)
  playCarHorn() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(420, now);
      osc2.frequency.setValueAtTime(490, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.setValueAtTime(0.25, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);

      if ('vibrate' in navigator) {
        navigator.vibrate([150, 50, 150]);
      }
    } catch {
      // audio fallback silent
    }
  }

  // 5. Emergency Siren (Wailing siren)
  playEmergencySiren() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1100, now + 0.3);
      osc.frequency.linearRampToValueAtTime(600, now + 0.6);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);

      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch {
      // audio fallback silent
    }
  }

  // 6. Soft Tap Chime
  playTap() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.playTone(587.33, now, 0.06, 0.15); // D5

      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }
    } catch {
      // audio fallback silent
    }
  }

  // 7. Radar Ping
  playAlert(type: 'radar' | 'doorbell' | 'emergency' | 'hospital' = 'radar') {
    if (type === 'doorbell') {
      this.playDoorbell();
    } else if (type === 'emergency') {
      this.playEmergencySiren();
    } else if (type === 'hospital') {
      this.playHospitalChime();
    } else {
      try {
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this.playTone(1174.66, now, 0.22, 0.2); // D6
        if ('vibrate' in navigator) {
          navigator.vibrate([30, 40, 30]);
        }
      } catch {
        // audio fallback silent
      }
    }
  }

  // 8. Natural Arabic Speech Synthesis
  speakArabic(text: string, onEnd?: () => void) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      u.rate = 0.95;
      u.pitch = 1.0;
      if (onEnd) {
        u.onend = onEnd;
      }
      window.speechSynthesis.speak(u);
    }
  }

  private playTone(freq: number, startTime: number, duration: number, volume: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

export const sounds = new SoundManager();
