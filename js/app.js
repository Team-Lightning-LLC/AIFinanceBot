// Main application controller
class AssistantAI {
  constructor() {
    this.init();
    this.startIncomingCallTimer(); // Add this line
  }
  
  init() {
    this.bindEvents();
    this.showWelcomeState();
    this.hideClientBanner(); // Hide banner initially
  }
  
  // Add this new method
  startIncomingCallTimer() {
    // Show incoming call after 30 seconds
    setTimeout(() => {
      this.showIncomingCall();
    }, 30000); // 30 seconds = 30000ms
  }
  
  // Add this new method
  showIncomingCall() {
    const banner = document.getElementById('client-banner');
    banner.style.display = 'flex';
    banner.style.transform = 'translateY(-100%)';
    banner.style.opacity = '0';
    
    // Animate in
    setTimeout(() => {
      banner.style.transform = 'translateY(0)';
      banner.style.opacity = '1';
    }, 100);
  }
  
  bindEvents() {
    // Client banner actions
    document.getElementById('accept-client-btn')?.addEventListener('click', () => {
      this.acceptClient('james-jackson');
    });
    
    document.getElementById('decline-client-btn')?.addEventListener('click', () => {
      this.declineClient();
    });
    
    // Manual new consultation
    document.getElementById('manual-new-chat-btn')?.addEventListener('click', () => {
      this.startNewConsultation('eleanor-chen');
    });
    
    // Message input
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    
    sendBtn?.addEventListener('click', () => {
      this.sendMessage();
    });
    
    messageInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Auto-resize textarea
    messageInput?.addEventListener('input', (e) => {
      this.autoResizeTextarea(e.target);
    });
    
    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const suggestion = btn.dataset.suggestion;
        messageInput.value = suggestion;
        this.sendMessage();
      });
    });
    
    // Header actions
    document.getElementById('call-btn')?.addEventListener('click', () => {
      this.showCallModal();
    });
    
    document.getElementById('export-btn')?.addEventListener('click', () => {
      this.showExportModal();
    });
    
    // Modal actions
    document.getElementById('end-call-btn')?.addEventListener('click', () => {
      this.hideCallModal();
    });
    
    document.getElementById('close-export-btn')?.addEventListener('click', () => {
      this.hideExportModal();
    });
    
    document.getElementById('cancel-export-btn')?.addEventListener('click', () => {
      this.hideExportModal();
    });
    
    // Settings
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      window.location.href = 'settings.html';
    });
    
    // Click outside modals to close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.hideAllModals();
      }
    });
  }
  
  showWelcomeState() {
    document.getElementById('welcome-state').style.display = 'block';
    document.getElementById('chat-interface').style.display = 'none';
    // Don't show client banner here anymore
  }
  
  hideClientBanner() {
    const banner = document.getElementById('client-banner');
    banner.style.display = 'none';
  }
  
  acceptClient(clientId) {
    this.hideClientBannerWithAnimation();
    this.startNewConsultation(clientId, true);
  }
  
  declineClient() {
    this.hideClientBannerWithAnimation();
    this.showDeclineMessage();
  }
  
  hideClientBannerWithAnimation() {
    const banner = document.getElementById('client-banner');
    banner.style.transform = 'translateY(-100%)';
    banner.style.opacity = '0';
    setTimeout(() => {
      banner.style.display = 'none';
    }, 300);
  }
  
  showDeclineMessage() {
    // Show a brief message that client was declined
    const welcomeContent = document.querySelector('.welcome-content');
    const originalContent = welcomeContent.innerHTML;
    
    welcomeContent.innerHTML = `
      <div class="decline-message">
        <div class="decline-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2>Client Consultation Declined</h2>
        <p>The consultation request has been declined and the client has been notified.</p>
      </div>
    `;
    
    // Restore original content after 3 seconds
    setTimeout(() => {
      welcomeContent.innerHTML = originalContent;
    }, 3000);
  }
  
  startNewConsultation(clientId, isAccepted = false) {
    const consultation = ChatManager.createConsultation(clientId);
    if (!consultation) return;
    
    // Add to sidebar
    ChatManager.addToSidebar(consultation);
    
    // Activate consultation
    ChatManager.activateConsultation(consultation.id);
    
    // No auto-fill for James Jackson - user must type the question manually
    // For Eleanor Chen (manual new consultation), we can still auto-fill if desired
    if (isAccepted && clientId === 'eleanor-chen') {
      setTimeout(() => {
        const initialQuestion = initialQuestions[clientId];
        if (initialQuestion) {
          ChatManager.addMessage(consultation.id, initialQuestion, true);
          ChatManager.processAIResponse(initialQuestion, clientId);
        }
      }, 500);
    }
  }
  
  sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (!message || !ChatManager.activeChat) return;
    
    // Add user message
    ChatManager.addMessage(ChatManager.activeChat.id, message, true);
    
    // Clear input
    messageInput.value = '';
    this.autoResizeTextarea(messageInput);
    
    // Process AI response
    ChatManager.processAIResponse(message, ChatManager.activeChat.clientId);
  }
  
  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }
  
  showCallModal() {
    document.getElementById('call-modal').classList.add('active');
  }
  
  hideCallModal() {
    document.getElementById('call-modal').classList.remove('active');
  }
  
  showExportModal() {
    const summary = ChatManager.generateExportSummary();
    document.getElementById('export-summary').textContent = summary;
    document.getElementById('export-modal').classList.add('active');
  }
  
  hideExportModal() {
    document.getElementById('export-modal').classList.remove('active');
  }
  
  hideAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AssistantAI();
});
