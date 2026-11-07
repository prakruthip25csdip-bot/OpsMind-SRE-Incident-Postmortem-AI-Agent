// Web Audio API Synthesizer for MemoraDesk UI Soundscapes
// Generates pleasant, non-intrusive micro-audio directly in the browser without any external sound assets

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Check if user has muted sound in settings / localStorage
export const isSoundEnabled = () => {
  if (typeof window === 'undefined') return false;
  const setting = localStorage.getItem('memoradesk_sound_enabled');
  return setting !== 'false'; // Enabled by default
};

export const setSoundEnabled = (enabled) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('memoradesk_sound_enabled', enabled ? 'true' : 'false');
};

// 1. Futuristic Memory Recall Chime (two rising harmonics)
export const playMemoryChime = () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // First harmonic
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Second harmonic (sparkle)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.08); // A5
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28); // D6
    gain2.gain.setValueAtTime(0.05, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.35);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.45);
  } catch (e) {
    // Audio context may be blocked by autoplay policies before user interaction
  }
};

// 2. Crisp Message Send Click/Pop
export const playMessagePop = () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {}
};

// 3. Success / Resolution Harmonic Chord
export const playSuccessChime = () => {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major chord)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.06, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + 0.5);
    });
  } catch (e) {}
};
