// js/utils.js - Shared helpers for intro/lab page (updated with AudioContext gesture fix)

// Global AudioContext (lazy initialized)
let audioCtx = null;

// Initialize or resume AudioContext on first user gesture
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log('AudioContext created');
  }

  // Browsers suspend context until gesture — resume it now
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      console.log('AudioContext resumed after user gesture');
    }).catch(err => {
      console.warn('Failed to resume AudioContext:', err);
    });
  }
}

// Automatically resume on first real user interaction (click or touch)
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

// Keystroke sound effect (now safe to call anytime)
function playKeystroke() {
  // Ensure context is ready
  initAudio();

  if (!audioCtx || audioCtx.state !== 'running') {
    console.warn('AudioContext not ready yet — waiting for gesture');
    return;
  }

  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);           // Slightly louder
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08); // Smooth fade-out

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.08);                    // Slightly longer beep
}

// Voice playback (also safe — resumes context if needed)
function playVoice() {
  initAudio(); // Ensure context is active

  const utterance = new SpeechSynthesisUtterance(
    "Decryption complete. Welcome to Akhil Akash Bindla's portfolio."
  );
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 0.9;

  window.speechSynthesis.speak(utterance);
}

// Basic device & browser detection (unchanged but improved regex)
function getDeviceInfo() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  // OS detection
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/linux/i.test(ua) && !/android/i.test(ua)) os = 'Linux';
  else if (/macintosh|mac os/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

  // Browser detection with version
  const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edg|OPR)\/([\d.]+)/i);
  if (browserMatch) {
    browser = browserMatch[1];
    const version = browserMatch[2];
    if (browser === 'Edg') browser = 'Edge';
    if (browser === 'OPR') browser = 'Opera';
    browser += ` ${version.split('.')[0]}`;
  } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    browser = 'Safari';
  }

  return { os, browser };
}

// Export all helpers
export { playKeystroke, playVoice, getDeviceInfo, initAudio };s
