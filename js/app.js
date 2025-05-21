// Main application logic
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const callBanner = document.getElementById('call-banner');
  const acceptCallBtn = document.getElementById('accept-call-btn');
  const declineCallBtn = document.getElementById('decline-call-btn');
  const manualNewChatBtn = document.getElementById('manual-new-chat-btn');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const callBtn = document.getElementById('call-btn');
  const exportBtn = document.getElementById('export-btn');
  const callModal = document.getElementById('call-modal');
  const endCallBtn = document.getElementById('end-call-btn');
  const exportModal = document.getElementById('export-modal');
  const closeExport = document.getElementById('close-export');
  const cancelExport = document.getElementById('cancel-export');
  const settingsBtn = document.getElementById('settings-btn');
  
  // Show call banner by default for the demo
  callBanner.style.display = 'flex';
  
  // Hide the empty state initially and show it when needed
  document.getElementById('empty-state').style.display = 'flex';
  document.getElementById('chat-content').style.display = 'none';
  
  // Accept Call Button - Create a new chat for John Smith
  acceptCallBtn.addEventListener('click', function() {
    // Hide call banner
    callBanner.style.display = 'none';
    
    // Create a new chat for John Smith
    const newChat = ChatManager.createChat('john-smith');
    if (newChat) {
      const chatItem = ChatManager.addChatToSidebar(newChat);
      // Activate the new chat
      ChatManager.activateChat(newChat.id);
      // Add AI response after a delay
      setTimeout(() => {
        ChatManager.processAIResponse('roth ira', 'john-smith');
      }, 500);
    }
  });
  
  // Decline Call Button
  declineCallBtn.addEventListener('click', function() {
    callBanner.style.display = 'none';
  });
  
  // Manual New Chat Button - Create a new chat for Eleanor Chen
  manualNewChatBtn.addEventListener('click', function() {
    // Create a new chat for Eleanor Chen (as an example)
    const newChat = ChatManager.createChat('eleanor-chen');
    if (newChat) {
      const chatItem = ChatManager.addChatToSidebar(newChat);
      // Activate the new chat
      ChatManager.activateChat(newChat.id);
      // Add AI response after a delay
      setTimeout(() => {
        ChatManager.processAIResponse('daughter roth', 'eleanor-chen');
      }, 500);
    }
  });
  
  // Send Message Button
  sendBtn.addEventListener('click', function() {
    sendMessage();
  });
  
  // Enter key to send message
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Function to send a message
  function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !ChatManager.activeClient) return;
    
    // Find the active chat for current client
    let activeChat = null;
    for (const chatId in ChatManager.chats) {
      if (ChatManager.chats[chatId].clientId === ChatManager.activeClient) {
        activeChat = ChatManager.chats[chatId];
        break;
      }
    }
    
    if (activeChat) {
      // Add user message
      ChatManager.addMessage(activeChat.id, message, true);
      // Clear input
      messageInput.value = '';
      // Process AI response
      ChatManager.processAIResponse(message, ChatManager.activeClient);
    }
  }
  
  // Call Button - Show call modal
  callBtn.addEventListener('click', function() {
    callModal.classList.add('active');
  });
  
  // End Call Button - Hide call modal
  endCallBtn.addEventListener('click', function() {
    callModal.classList.remove('active');
  });
  
  // Export Button - Show export modal
  exportBtn.addEventListener('click', function() {
    exportModal.classList.add('active');
  });
  
  // Close/Cancel Export Buttons
  closeExport.addEventListener('click', function() {
    exportModal.classList.remove('active');
  });
  
  cancelExport.addEventListener('click', function() {
    exportModal.classList.remove('active');
  });
  
  // Settings Button - Navigate to settings page
  settingsBtn.addEventListener('click', function() {
    window.location.href = 'settings.html';
  });
  
  // Initialize the demo
  // We don't auto-create chats, waiting for user interaction instead
});
