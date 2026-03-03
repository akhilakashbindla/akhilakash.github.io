// js/lab.js - Professional AI Defense Simulation (frontend only)

document.addEventListener('DOMContentLoaded', () => {
  const initTerminal = document.getElementById('init-output');
  const initStage = document.getElementById('init-terminal');
  const simPanel = document.getElementById('simulation-panel');
  const testInput = document.getElementById('test-input');
  const evaluateBtn = document.getElementById('evaluate-btn');
  const resultSection = document.getElementById('result-section');
  const threatIndicator = document.getElementById('threat-indicator');
  const resultTitle = document.getElementById('result-title');
  const resultCategory = document.getElementById('result-category');
  const resultScore = document.getElementById('result-score');
  const resultAction = document.getElementById('result-action');
  const explanation = document.getElementById('explanation');

  // Professional initialization typing
  new TypeIt(initTerminal, {
    speed: 50,
    cursorChar: '_',
    afterComplete: () => {
      setTimeout(() => {
        initStage.style.opacity = '0';
        setTimeout(() => {
          initStage.style.display = 'none';
          simPanel.style.display = 'block';
        }, 800);
      }, 1500);
    }
  })
  .type('AI Defense Simulation Environment<br>', { delay: 300 })
  .type('Initializing Adaptive Firewall Engine...<br>', { delay: 400 })
  .type('Loading Behavioral Analytics Module...<br>', { delay: 400 })
  .type('Activating Prompt Injection Filter...<br>', { delay: 400 })
  .type('System Integrity: Verified<br>', { delay: 400 })
  .type('Status: Operational<br><br>', { delay: 600 })
  .type('Simulation ready. Enter input to test.')
  .go();

  // Subtle matrix rain
  const canvas = document.getElementById('matrix-rain');
  const ctx = canvas.getContext('2d');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  const chars = '01';
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(0);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00f7ff';
    ctx.font = fontSize + 'px monospace';
    drops.forEach((y, i) => {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(drawMatrix, 50);

  // Detection rules
  const threatPatterns = [
    /ignore previous instructions/i,
    /override system/i,
    /drop table/i,
    /admin password/i,
    /system prompt/i,
    /jailbreak/i,
    /developer mode/i,
    /forget all previous/i,
    /act as/i
  ];

  evaluateBtn.addEventListener('click', () => {
    const input = testInput.value.trim();
    if (!input) {
      alert('Please enter some input to evaluate.');
      return;
    }

    let isThreat = false;
    let matchedPattern = '';

    for (const pattern of threatPatterns) {
      if (pattern.test(input)) {
        isThreat = true;
        matchedPattern = pattern.source;
        break;
      }
    }

    resultSection.style.display = 'block';

    if (isThreat) {
      threatIndicator.textContent = '⚠ Threat Detected';
      threatIndicator.className = 'threat-indicator threat';
      resultTitle.textContent = 'Prompt Injection Attempt';
      resultCategory.textContent = 'Category: Instruction Override / Jailbreak';
      resultScore.textContent = 'Risk Score: 75–90%';
      resultAction.textContent = 'Action: Blocked';
      explanation.innerHTML = `
        <strong>Explanation:</strong><br>
        The input contains patterns commonly used in prompt injection attacks to override AI instructions.<br>
        Matched rule: <code>${matchedPattern}</code><br>
        The request was blocked to maintain system integrity.
      `;
    } else {
      threatIndicator.textContent = '✔ Safe';
      threatIndicator.className = 'threat-indicator safe';
      resultTitle.textContent = 'Input Classified as Safe';
      resultCategory.textContent = 'Category: Normal Query / Legitimate';
      resultScore.textContent = 'Risk Score: 5–25%';
      resultAction.textContent = 'Action: Allowed';
      explanation.innerHTML = `
        <strong>Explanation:</strong><br>
        No override, jailbreak, or malicious patterns detected.<br>
        Input passed semantic and behavioral evaluation.
      `;
    }

    resultSection.scrollIntoView({ behavior: 'smooth' });
  });
});
