// js/utils.js - Shared helpers for intro/lab page (updated with full AudioContext gesture fix)

// Global AudioContext (lazy initialized)
let audioCtx = null;

// Initialize or resume AudioContext on first user gesture
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log('AudioContext created');
  }

  // Resume if suspended (required by all modern browsers after user gesture)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      console.log('AudioContext resumed successfully after user gesture');
    }).catch(err => {
      console.warn('Failed to resume AudioContext:', err);
    });
  }
}

// Automatically resume on first real user interaction (click or touch)
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true }); // for mobile

// Keystroke sound effect (now safe — checks context state)
function playKeystroke() {
  // Ensure context is ready
  initAudio();

  if (!audioCtx || audioCtx.state !== 'running') {
    console.warn('AudioContext not ready yet — waiting for user gesture');
    return; // Skip if still suspended
  }

  try {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);           // Slightly louder for clarity
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08); // Smooth fade-out

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.08);                    // Slightly longer beep for better feel

    console.log('Keystroke sound played');
  } catch (err) {
    console.error('Error playing keystroke:', err);
  }
}

// Voice playback (also safe — resumes context if needed)
function playVoice() {
  initAudio(); // Ensure context is active

  if (!audioCtx || audioCtx.state !== 'running') {
    console.warn('AudioContext not ready for voice — waiting for gesture');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(
    "Decryption complete. Welcome to Akhil Akash Bindla's portfolio."
  );
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 0.9;

  window.speechSynthesis.speak(utterance);
  console.log('Voice playback triggered');
}

// Basic device & browser detection (unchanged but slightly improved)
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

  // Browser detection with rough version
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
export { playKeystroke, playVoice, getDeviceInfo, initAudio };
