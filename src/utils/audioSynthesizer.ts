import { AdhanMakam, AdhanMakamInfo } from '../types/prayer';

export const ADHAN_MAKAMLARI: AdhanMakamInfo[] = [
  {
    id: 'saba',
    name: 'Saba Makamı',
    prayerName: 'Sabah Ezanı',
    description: 'Hüzünlü, dokunaklı ve uykudan uyandıran derin teslimiyet tınısı.',
    mood: 'Duygusal & Huşû'
  },
  {
    id: 'rast',
    name: 'Rast Makamı',
    prayerName: 'Öğle Ezanı',
    description: 'Günün yoğunluğunda sefa, berraklık ve iç huzur veren canlı nağmeler.',
    mood: 'Canlı & Dingin'
  },
  {
    id: 'hicaz',
    name: 'Hicaz Makamı',
    prayerName: 'İkindi Ezanı',
    description: 'Yanık, derin ve kalbi titreten yakarış ve tevazu tınıları.',
    mood: 'Derin & Yanık'
  },
  {
    id: 'segah',
    name: 'Segah Makamı',
    prayerName: 'Akşam Ezanı',
    description: 'Vaktin kısalığı sebebiyle çevik, tatlı ve huşû dolu bir teslimiyet.',
    mood: 'Akıcı & Teslimiyet'
  },
  {
    id: 'ussak',
    name: 'Uşşak Makamı',
    prayerName: 'Yatsı Ezanı',
    description: 'Günün sonunda gece sükûnetine ve tefekküre hazırlayan ağırbaşlı tını.',
    mood: 'Ağırbaşlı & Dingin'
  },
  {
    id: 'mekke',
    name: 'Mekke-i Mükerreme Ezanı',
    prayerName: 'Kâbe Ezanı',
    description: 'Mescid-i Haram makamı; geniş yankılı, vakur ve cihanşümul nida.',
    mood: 'Vakur & Heybetli'
  },
  {
    id: 'bip',
    name: 'Kısa Uyarı Sesi',
    prayerName: 'Nezaket Tonu',
    description: 'Toplantı ve sessiz ortamlar için kibar dijital uyarı sesi.',
    mood: 'Sade & Kısa'
  }
];

class AdhanAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private activeNodes: { stop: () => void }[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a Ney / Vocal-like note with harmonics
  private playHarmonicNote(
    ctx: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
    gainLevel: number = 0.25,
    vibrato: boolean = true
  ) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Warm Ney / Vocal formant filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, startTime);
    filter.Q.setValueAtTime(2.5, startTime);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Harmonic overtone
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, startTime);

    if (vibrato) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(4.5, startTime); // 4.5 Hz natural Turkish vocal vibrato
      lfoGain.gain.setValueAtTime(freq * 0.015, startTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);
      lfo.start(startTime);
      lfo.stop(startTime + duration);
    }

    // Envelope
    gainNode.gain.setValueAtTime(0.0001, startTime);
    // Smooth attack
    gainNode.gain.exponentialRampToValueAtTime(gainLevel, startTime + Math.min(0.3, duration * 0.3));
    // Sustain
    gainNode.gain.setValueAtTime(gainLevel * 0.8, startTime + duration * 0.7);
    // Release
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    subOsc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    subOsc.start(startTime);

    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    subOsc.stop(startTime + duration);

    this.activeNodes.push({
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
          subOsc.stop();
        } catch {
          // ignore already stopped
        }
      }
    });
  }

  // Play Makam Melody
  public playMakam(makam: AdhanMakam, onEnd?: () => void) {
    this.stop();
    const ctx = this.getContext();
    this.isPlaying = true;
    const now = ctx.currentTime + 0.05;

    if (makam === 'bip') {
      // Gentle chime
      this.playHarmonicNote(ctx, 587.33, now, 0.4, 0.3, false); // D5
      this.playHarmonicNote(ctx, 880.00, now + 0.35, 0.8, 0.35, false); // A5
      setTimeout(() => {
        this.isPlaying = false;
        if (onEnd) onEnd();
      }, 1300);
      return;
    }

    // Authentic Makam scales and melodic motifs
    // Base pitch around D4 / A3
    let melody: { freq: number; dur: number }[] = [];

    if (makam === 'saba') {
      // Saba: D4, Eb4 (koma), F4, Gb4, A4, Bb4, C5
      // Typical motif: "Allahu Akbar Allahu Akbar" in Saba
      melody = [
        { freq: 293.66, dur: 1.1 }, // D4 - Al-
        { freq: 315.00, dur: 0.9 }, // Eb4 (Saba koma) - la-
        { freq: 349.23, dur: 1.5 }, // F4 - hu
        { freq: 365.00, dur: 1.2 }, // Gb4 - Ak-
        { freq: 349.23, dur: 1.8 }, // F4 - bar
        { freq: 315.00, dur: 1.0 }, // Eb4
        { freq: 293.66, dur: 2.2 }, // D4 resolution
      ];
    } else if (makam === 'rast') {
      // Rast: G3, A3, B3(koma), C4, D4, E4, F#4, G4
      // Joyful, upright motif
      melody = [
        { freq: 196.00, dur: 0.8 }, // G3
        { freq: 220.00, dur: 0.8 }, // A3
        { freq: 242.00, dur: 1.2 }, // B3(rast)
        { freq: 261.63, dur: 1.4 }, // C4
        { freq: 293.66, dur: 1.8 }, // D4
        { freq: 261.63, dur: 1.0 }, // C4
        { freq: 242.00, dur: 1.0 }, // B3
        { freq: 220.00, dur: 0.9 }, // A3
        { freq: 196.00, dur: 2.4 }, // G3 resolution
      ];
    } else if (makam === 'hicaz') {
      // Hicaz: D4, Eb4, F#4, G4, A4, Bb4, C5, D5
      // Burning, poignant motif
      melody = [
        { freq: 293.66, dur: 1.0 }, // D4
        { freq: 311.13, dur: 0.9 }, // Eb4
        { freq: 369.99, dur: 1.6 }, // F#4
        { freq: 392.00, dur: 1.4 }, // G4
        { freq: 369.99, dur: 1.1 }, // F#4
        { freq: 311.13, dur: 1.2 }, // Eb4
        { freq: 293.66, dur: 2.6 }, // D4
      ];
    } else if (makam === 'segah') {
      // Segah: B3 (segah koma), C4, D4, E4, F#4
      // Flowing, brisk motif
      melody = [
        { freq: 242.00, dur: 1.2 }, // B3 (Segah)
        { freq: 261.63, dur: 0.9 }, // C4
        { freq: 293.66, dur: 1.4 }, // D4
        { freq: 329.63, dur: 1.5 }, // E4
        { freq: 293.66, dur: 1.0 }, // D4
        { freq: 261.63, dur: 0.9 }, // C4
        { freq: 242.00, dur: 2.5 }, // Segah resolution
      ];
    } else if (makam === 'ussak') {
      // Uşşak: A3, B3(koma), C4, D4, E4, F4, G4
      // Contemplative, nocturnal motif
      melody = [
        { freq: 220.00, dur: 1.2 }, // A3
        { freq: 240.00, dur: 1.1 }, // B3(uşşak)
        { freq: 261.63, dur: 1.3 }, // C4
        { freq: 293.66, dur: 1.6 }, // D4
        { freq: 261.63, dur: 1.2 }, // C4
        { freq: 240.00, dur: 1.1 }, // B3
        { freq: 220.00, dur: 2.8 }, // A3
      ];
    } else {
      // Mekke / Kabe: Resonant Bayati/Hicaz broad dynamic range
      melody = [
        { freq: 220.00, dur: 1.0 },
        { freq: 261.63, dur: 1.1 },
        { freq: 293.66, dur: 1.8 },
        { freq: 349.23, dur: 1.4 },
        { freq: 329.63, dur: 1.2 },
        { freq: 293.66, dur: 1.5 },
        { freq: 261.63, dur: 1.2 },
        { freq: 220.00, dur: 3.0 },
      ];
    }

    let timeAcc = now;
    let totalDur = 0;
    melody.forEach((note) => {
      this.playHarmonicNote(ctx, note.freq, timeAcc, note.dur, 0.28, true);
      timeAcc += note.dur * 0.88; // subtle overlap for smooth legato
      totalDur += note.dur * 0.88;
    });

    setTimeout(() => {
      this.isPlaying = false;
      if (onEnd) onEnd();
    }, (totalDur + 1.2) * 1000);
  }

  public stop() {
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const adhanEngine = new AdhanAudioEngine();
