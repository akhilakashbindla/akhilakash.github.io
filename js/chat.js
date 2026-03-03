// js/chat.js - Persistent floating AI Assistant (auto-opens on page load)

document.addEventListener('DOMContentLoaded', () => {
  const chatWidget = document.getElementById('chat-widget');
  const chatClose = document.querySelector('.chat-close');
  const chatInput = document.getElementById('chat-user-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');

  // Auto-show chat widget after a short delay
  setTimeout(() => {
    if (chatWidget) {
      chatWidget.classList.add('visible');
      addMessage("Hello! 👋 I'm your AI assistant. How can I help you explore Akhil's portfolio today?", false);
    }
  }, 1800); // 1.8 seconds delay – feels natural

  // Close chat
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatWidget.classList.remove('visible');
    });
  }

  // Add message to chat
  function addMessage(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Send message
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatInput.value = '';

    // Fake response (replace with real backend call later)
    setTimeout(() => {
      let reply = "I'm still under development. Ask me about Akhil's projects, skills, or certifications!";
      if (text.toLowerCase().includes('project') || text.toLowerCase().includes('usb') || text.toLowerCase().includes('gnn')) {
        reply = "Akhil has developed USB Rubber Ducky Defender (ML-based malicious USB detection) and GNN-DTA for 5G intrusion detection.";
      } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        reply = "Hi there! How can I assist you today?";
      } else if (text.toLowerCase().includes('skill') || text.toLowerCase().includes('know')) {
        reply = "Akhil specializes in Penetration Testing (Nmap, Metasploit), AI/ML Security, Secure Coding (Python, Rust), and Network Defense (5G, SDN).";
      }
      addMessage(reply, false);
    }, 800);
  }

  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});
