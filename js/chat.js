// js/chat.js - Floating AI Assistant (auto-opens, minimizes to small button)

document.addEventListener('DOMContentLoaded', () => {
  const chatWidget = document.getElementById('chat-widget');
  const chatMinimize = document.querySelector('.chat-minimize');
  const chatMinimizedBtn = document.getElementById('chat-minimized-btn');
  const chatInput = document.getElementById('chat-user-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');

  // Auto-open chat on page load
  setTimeout(() => {
    if (chatWidget) {
      chatWidget.classList.add('visible');
      addMessage("Hello! 👋 I'm your AI assistant. How can I help you explore Akhil's portfolio today?", false);
    }
  }, 1800);

  // Minimize chat → show small button
  if (chatMinimize) {
    chatMinimize.addEventListener('click', () => {
      chatWidget.classList.remove('visible');
      if (chatMinimizedBtn) chatMinimizedBtn.style.display = 'block';
    });
  }

  // Re-open from minimized button
  if (chatMinimizedBtn) {
    chatMinimizedBtn.addEventListener('click', () => {
      chatWidget.classList.add('visible');
      chatMinimizedBtn.style.display = 'none';
    });
  }

  // Add message
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

    // Fake response (later connect to backend)
    setTimeout(() => {
      let reply = "I'm still under development. Ask me about Akhil's projects or skills!";
      if (text.toLowerCase().includes('project') || text.toLowerCase().includes('usb') || text.toLowerCase().includes('gnn')) {
        reply = "Akhil has developed USB Rubber Ducky Defender and GNN-DTA for 5G intrusion detection.";
      } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        reply = "Hi there! How can I assist you today?";
      } else if (text.toLowerCase().includes('skill') || text.toLowerCase().includes('know')) {
        reply = "Akhil specializes in Penetration Testing, AI/ML Security, Secure Coding, and Network Defense.";
      }
      addMessage(reply, false);
    }, 800);
  }

  if (chatSend) chatSend.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});
