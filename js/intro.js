// js/intro.js - Core logic for lab1.html (typing, firewall, matrix, redirect)

import { playKeystroke, playVoice, getDeviceInfo } from './utils.js';

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const terminalStage = document.getElementById('terminal-stage');
  const firewallStage = document.getElementById('firewall-stage');
  const decryptionStage = document.getElementById('decryption-stage');

  // Fetch dynamic info
  const device = getDeviceInfo();
  const fakeIp = '103.XXX.XX.1'; // Replace with real fetch later
  const fakeLocation = 'Hyderabad, Telangana, India'; // Replace with real fetch

  // TypeIt typing sequence
  new TypeIt(terminalOutput, {
    speed: 40,
    afterStep: playKeystroke,
    afterComplete: () => {
      new TypeIt(terminalInput, {
        strings: 'akhil_2025_init()',
        speed: 80,
        afterStep: playKeystroke,
        afterComplete: () => {
          terminalOutput.innerHTML += `
            <p>Authenticating user: Akhil Akash Bindla</p>
            <p>Clearance Level: Top Secret [██████████]</p>
            <p>Login: admin</p>
            <p>Password: ********</p>
            <p>✅ Access granted.</p>
          `;
          terminalStage.classList.add('scroll-out');
          setTimeout(() => {
            terminalStage.style.display = 'none';
            firewallStage.style.display = 'block';
          }, 1000);
        }
      }).go();
    }
  })
  .type(`>> IP: ${fakeIp} | Location: ${fakeLocation}<br>`)
  .pause(500)
  .type(`>> Device: ${device.os}, ${device.browser}<br>`)
  .pause(500)
  .type('Connecting to secure interface...<br>')
  .pause(500)
  .type('Initializing defense protocols...<br>')
  .pause(500)
  .type('>> Enter access code:')
  .go();

  // Firewall button logic
  let correctCount = 0;
  const firewallButtons = document.querySelectorAll('.firewall-btn');
  const firewallLogs = document.getElementById('firewall-logs');
  const firewallStatus = document.getElementById('firewall-status');

  firewallButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.correct === 'true') {
        btn.style.background = 'linear-gradient(90deg, #00ff9d, #00d4ff)';
        correctCount++;
        firewallLogs.innerHTML += btn.textContent.includes('Nmap') 
          ? '<p>➜ Nmap scan complete: Ports 22 & 443 OPEN</p>'
          : '<p>➜ Nessus scan complete: No critical vulnerabilities</p>';
      } else {
        btn.style.background = '#ff5555';
        firewallStatus.textContent = '❌ Unauthorized action detected. Try again.';
        setTimeout(() => {
          btn.style.background = '#333';
          firewallStatus.textContent = '';
        }, 3000);
      }

      if (correctCount === 2) {
        firewallStatus.textContent = '✅ Firewall bypassed. Initiating decryption...';
        setTimeout(() => {
          firewallStage.style.display = 'none';
          decryptionStage.style.display = 'block';
          startDecryption();
        }, 1500);
      }
    });
  });

  // Matrix rain + decryption
  function startDecryption() {
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const chars = '01';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(0);

    function draw() {
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

    setInterval(draw, 50);

    // Decryption logs
    const logs = document.getElementById('decryption-logs');
    const complete = document.getElementById('decryption-complete');
    const messages = [
      '▶ AES-256 decryption initiated...',
      '🔍 Signature verified',
      '📄 Extracting portfolio data...',
      '✅ Decryption complete'
    ];
    let i = 0;

    const interval = setInterval(() => {
      if (i < messages.length) {
        logs.innerHTML += `<p>${messages[i]}</p>`;
        i++;
      } else {
        clearInterval(interval);
        complete.style.display = 'block';
        playVoice();
        setTimeout(() => {
          window.location.href = 'portfolio.html';
        }, 2000);
      }
    }, 1200);
  }
});
