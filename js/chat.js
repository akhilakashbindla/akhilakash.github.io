// js/chat.js - Cipher AI Assistant (advanced: name once, page context, history persistence)

document.addEventListener('DOMContentLoaded', () => {
  const chatWidget = document.getElementById('chat-widget');
  const chatMinimize = document.querySelector('.chat-minimize');
  const chatMinimizedBtn = document.getElementById('chat-minimized-btn');
  const chatInput = document.getElementById('chat-user-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');

  // Get current page for context
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  let pageContext = '';
  if (currentPage === 'portfolio.html') pageContext = 'You are currently viewing the Portfolio page.';
  else if (currentPage === 'lab.html') pageContext = 'You are currently in the Security Lab simulation.';
  else if (currentPage === 'site-security.html') pageContext = 'You are viewing the Site Security Architecture page.';
  else pageContext = 'You are on the homepage.';

  // Load saved data
  let visitorName = localStorage.getItem('visitorName') || '';
  let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  let nameAsked = localStorage.getItem('nameAsked') === 'true';

  // Load chat history
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

  // Auto-open chat (only if not previously closed)
  if (!localStorage.getItem('chatClosed')) {
    setTimeout(() => {
      if (chatWidget) {
        chatWidget.classList.add('visible');

        if (!visitorName && !nameAsked) {
          addMessage("Hello! 👋 I'm Cipher, your AI assistant. Before we continue, may I know your name?", false);
          localStorage.setItem('nameAsked', 'true');
        } else if (visitorName) {
          addMessage(`Hey ${visitorName}! 👋 Welcome back. ${pageContext} How's your day going?`, false);
        } else {
          addMessage(`Hello! 👋 I'm Cipher. ${pageContext} How can I help you explore Akhil's portfolio?`, false);
        }

        loadChatHistory();
      }
    }, 1800);
  } else {
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
    if (!visitorName && chatHistory.length <= 3 && nameAsked) {
      const nameMatch = text.match(/(?:my name is|i am|im|name['s]?|call me)\s+([a-zA-Z\s]+)/i);
      if (nameMatch && nameMatch[1]) {
        visitorName = nameMatch[1].trim().split(' ')[0];
        localStorage.setItem('visitorName', visitorName);
        addMessage(`Nice to meet you, ${visitorName}! 👋 ${pageContext} How's your day going?`, false);
      } else {
        addMessage("Sorry, I didn't catch that. Could you please tell me your name? 😊", false);
      }
      return;
    }

    // Fake smart response (later backend)
    setTimeout(() => {
      let reply = `Hey ${visitorName || 'there'}! How can I assist you today?`;
      if (text.toLowerCase().includes('project') || text.toLowerCase().includes('usb') || text.toLowerCase().includes('gnn')) {
        reply = `Sure, ${visitorName}! Akhil has built USB Rubber Ducky Defender and GNN-DTA for 5G intrusion detection. Want more details?`;
      } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        reply = `Hi ${visitorName || ''}! Great to see you again. ${pageContext} What's on your mind?`;
      } else if (text.toLowerCase().includes('security') || text.toLowerCase().includes('owasp')) {
        reply = `Akhil's portfolio is secured with layered defenses against OWASP Top 10 and prompt injection. Check the Site Security Architecture page!`;
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
