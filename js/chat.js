// js/chat.js - Cipher AI Assistant (name prompt, page context, history persistence)

document.addEventListener('DOMContentLoaded', () => {
  const chatWidget = document.getElementById('chat-widget');
  const chatMinimize = document.querySelector('.chat-minimize');
  const chatMinimizedBtn = document.getElementById('chat-minimized-btn');
  const chatInput = document.getElementById('chat-user-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');

  // Get current page name for context
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  let pageContext = '';
  if (currentPage === 'portfolio.html') pageContext = 'You are currently viewing the Portfolio page.';
  else if (currentPage === 'lab.html') pageContext = 'You are currently in the Security Lab simulation.';
  else if (currentPage === 'site-security.html') pageContext = 'You are viewing the Site Security Architecture page.';
  else pageContext = 'You are on the homepage.';

  // Load or create visitor name & chat history
  let visitorName = localStorage.getItem('visitorName') || '';
  let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

  // Load previous chat history
  function loadChatHistory() {
    chatMessages.innerHTML = '';
    chatHistory.forEach(msg => {
      addMessage(msg.text, msg.isUser);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Save chat history
  function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }

  // Add message
  function addMessage(text, isUser = false) {
    const msg = { text, isUser };
    chatHistory.push(msg);
    saveChatHistory();

    const div = document.createElement('div');
    div.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Auto-open chat on first visit or if history exists
  if (!localStorage.getItem('chatClosed')) {
    setTimeout(() => {
      if (chatWidget) {
        chatWidget.classList.add('visible');
        if (!visitorName && chatHistory.length === 0) {
          addMessage("Hello! 👋 I'm Cipher, your AI assistant. Before we continue, may I know your name?", false);
        } else if (visitorName) {
          addMessage(`Welcome back, ${visitorName}! ${pageContext} How can I help today?`, false);
        } else {
          addMessage(`Hello! ${pageContext} How can I help you explore Akhil's portfolio?`, false);
        }
        loadChatHistory();
      }
    }, 1800);
  } else {
    // Show minimized button if previously closed
    if (chatMinimizedBtn) chatMinimizedBtn.style.display = 'block';
  }

  // Minimize chat
  if (chatMinimize) {
    chatMinimize.addEventListener('click', () => {
      chatWidget.classList.remove('visible');
      if (chatMinimizedBtn) chatMinimizedBtn.style.display = 'block';
      localStorage.setItem('chatClosed', 'true');
    });
  }

  // Re-open from minimized button
  if (chatMinimizedBtn) {
    chatMinimizedBtn.addEventListener('click', () => {
      chatWidget.classList.add('visible');
      chatMinimizedBtn.style.display = 'none';
      localStorage.removeItem('chatClosed');
    });
  }

  // Send message
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatInput.value = '';

    // Handle name input
    if (!visitorName && chatHistory.length <= 2) {
      visitorName = text.trim();
      localStorage.setItem('visitorName', visitorName);
      addMessage(`Nice to meet you, ${visitorName}! ${pageContext} What would you like to know about Akhil's work?`, false);
      return;
    }

    // Fake smart response (later backend)
    setTimeout(() => {
      let reply = `Hi ${visitorName || 'there'}! Ask me about Akhil's projects, skills, or security architecture.`;
      if (text.toLowerCase().includes('project') || text.toLowerCase().includes('usb') || text.toLowerCase().includes('gnn')) {
        reply = `Sure, ${visitorName}! Akhil has built USB Rubber Ducky Defender (malicious USB detection with ML) and GNN-DTA for 5G intrusion detection. Want more details?`;
      } else if (text.toLowerCase().includes('security') || text.toLowerCase().includes('owasp')) {
        reply = `Akhil's portfolio is secured with layered defenses against OWASP Top 10 and prompt injection. Check the Site Security Architecture page for full details.`;
      } else if (text.toLowerCase().includes('skill') || text.toLowerCase().includes('know')) {
        reply = `${visitorName}, Akhil is skilled in Penetration Testing (Nmap, Metasploit), AI/ML Security, Secure Coding (Python, Rust), and Network Defense.`;
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
