// Audio pronunciation helper using Web Speech API with fallback to Web Audio API synthesized tones

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export const isSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Play element name in English according to IUPAC nomenclature
export const speakElementName = (
  name: string,
  options?: {
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (e: any) => void;
  }
): void => {
  if (typeof window === 'undefined') return;

  const { rate = 0.88, pitch = 1.0, onStart, onEnd, onError } = options || {};

  try {
    if (synth) {
      synth.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(name);
      utterance.lang = 'en-US';
      utterance.rate = rate; // Slightly slower than normal so students can hear phonetics clearly
      utterance.pitch = pitch;

      // Try selecting an English voice if available
      const voices = synth.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('English'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        console.warn('SpeechSynthesis error:', event);
        if (onEnd) onEnd();
        if (onError) onError(event);
      };

      synth.speak(utterance);
      return;
    }
  } catch (err) {
    console.warn('SpeechSynthesis not available or blocked:', err);
  }

  // Fallback sound chime via Web Audio API if TTS is unsupported
  playSynthesizedChime();
  if (onEnd) {
    setTimeout(onEnd, 300);
  }
};

export const stopSpeech = (): void => {
  if (synth) {
    synth.cancel();
  }
};

// Subtle procedural audio chime using Web Audio API
export const playSynthesizedChime = (freq = 440): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Ignore audio context errors
  }
};
