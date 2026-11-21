// Twin Frames: tiny synthesised sound effects (WebAudio, no audio files).
// The context is created on the first user gesture, so it never blocks load.

let audio = null;

function context() {
  if (audio === null) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audio = new AC();
  }
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

function blip(freqFrom, freqTo, seconds, type, gain) {
  const ac = context();
  if (!ac) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqFrom, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freqTo, ac.currentTime + seconds);
  amp.gain.setValueAtTime(gain, ac.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + seconds);
  osc.connect(amp);
  amp.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + seconds);
}

/** A satisfying two-note pop when a difference is found. */
export function playPop() {
  blip(620, 940, 0.12, 'sine', 0.16);
  window.setTimeout(() => blip(940, 1240, 0.1, 'sine', 0.12), 70);
}

/** A low buzz when a click misses. */
export function playBuzz() {
  blip(180, 120, 0.16, 'square', 0.07);
}

/** A little arpeggio when a level is completed. */
export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => {
    window.setTimeout(() => blip(f, f, 0.14, 'triangle', 0.14), i * 90);
  });
}
