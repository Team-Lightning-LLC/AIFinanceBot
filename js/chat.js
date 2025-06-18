// Chat management system with API integration
const ChatManager = {
  activeChat: null,
  chats: new Map(),
  typingInterval: null,
  
  // API Configuration
  apiConfig: {
    baseUrl: 'https://studio-server-production.api.vertesia.io/api/v1',
    // You'll need to replace this with your actual API key
    apiKey: 'YOUR_API_KEY_HERE' // Get this from your Vertesia dashboard
  },
  
  // Create new consultation
  createConsultation(clientId) {
    const client = clients[clientId];
    if (!client) return null;
    
    const chatId = `consultation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const consultation = {
      id: chatId,
      clientId: clientId,
      client: client,
      startTime: new Date(),
      messages: [],
      isActive: true,
      isConnectedToAPI: clientId === 'james-jackson' // Only James Jackson uses real API
    };
    
    this.chats.set(chatId, consultation);
    return consultation;
  },
  
  // Add consultation to sidebar
  addToSidebar(consultation) {
    const chatList = document.getElementById('chat-list');
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.dataset.chatId = consultation.id;
    
    const timeStr = this.formatTime(consultation.startTime);
    
    chatItem.innerHTML = `
      <div class="chat-avatar">${consultation.client.avatar}</div>
      <div class="chat-details">
        <div class="chat-name">${consultation.client.name}</div>
        <div class="chat-preview">${consultation.isConnectedToAPI ? 'Live AI Assistant' : 'Demo Mode'}</div>
      </div>
      <div class="chat-time">${timeStr}</div>
    `;
    
    // Add API indicator for James Jackson
    if (consultation.isConnectedToAPI) {
      chatItem.classList.add('api-connected');
    }
    
    // Add click event listener
    chatItem.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.activateConsultation(consultation.id);
    });
    
    // Add to beginning of list (newest first)
    chatList.insertBefore(chatItem, chatList.firstChild);
    return chatItem;
  },
  
  // Activate consultation
  activateConsultation(chatId) {
    const consultation = this.chats.get(chatId);
    if (!consultation) {
      console.error('Consultation not found:', chatId);
      return;
    }
    
    this.activeChat = consultation;
    
    // Show chat interface
    this.showChatInterface();
    
    // Update header
    this.updateChatHeader(consultation.client);
    
    // Render messages
    this.renderMessages(consultation.messages);
    
    // Update sidebar selection
    this.updateSidebarSelection(chatId);
  },
  
  // Show chat interface
  showChatInterface() {
    document.getElementById('welcome-state').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
  },
  
  // Update chat header
  updateChatHeader(client) {
    document.getElementById('header-avatar').textContent = client.avatar;
    document.getElementById('header-name').textContent = client.name;
    
    const consultation = this.activeChat;
    const statusText = consultation.isConnectedToAPI ? 
      `${client.company} • ${client.accountType} • Live AI` : 
      `${client.company} • ${client.accountType} • Demo`;
    
    document.getElementById('header-details').textContent = statusText;
  },
  
  // Update sidebar selection
  updateSidebarSelection(chatId) {
    // Remove active class from all items
    document.querySelectorAll('.chat-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to selected item
    const activeItem = document.querySelector(`[data-chat-id="${chatId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  },
  
  // Render client info card
  renderClientCard(client) {
    const consultation = this.activeChat;
    const apiStatus = consultation?.isConnectedToAPI ? 
      '<div class="api-status live">🟢 Connected to Live AI</div>' :
      '<div class="api-status demo">🔵 Demo Mode</div>';
    
    return `
      <div class="client-card">
        <div class="card-header">
          <div class="card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h4>Client Information</h4>
        </div>
        ${apiStatus}
        <div class="client-details-grid">
          <div class="detail-item">
            <label>Full Name</label>
            <span>${client.name}</span>
          </div>
          <div class="detail-item">
            <label>Company</label>
            <span>${client.company}</span>
          </div>
          <div class="detail-item">
            <label>Account Type</label>
            <span>${client.accountType}</span>
          </div>
        </div>
      </div>
    `;
  },
  
  // Add message to consultation
  addMessage(chatId, content, isUser = false) {
    const consultation = this.chats.get(chatId);
    if (!consultation) return;
    
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content,
      isUser: isUser,
      timestamp: new Date()
    };
    
    consultation.messages.push(message);
    
    if (this.activeChat?.id === chatId) {
      this.renderMessage(message);
      this.scrollToBottom();
    }
    
    return message;
  },
  
  // Render single message
  renderMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${message.isUser ? 'user-message' : 'ai-message'}`;
    
    if (message.isUser) {
      messageEl.innerHTML = `
        <div class="message-content">
          <div class="message-text">${message.content}</div>
          <div class="message-time">${this.formatTime(message.timestamp)}</div>
        </div>
        <div class="message-avatar user-avatar">FA</div>
      `;
    } else {
      messageEl.innerHTML = `
        <div class="message-avatar ai-avatar">
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6">
            <path d="M50,10 C70,10 85,25 85,45 C85,65 70,80 50,80 C30,80 15,65 15,45 C15,30 25,20 40,20 C50,20 55,25 55,35 C55,45 50,50 40,50 C35,50 32,47 32,42"/>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-text">${message.content}</div>
          <div class="message-time">${this.formatTime(message.timestamp)}</div>
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageEl);
  },
  
  // Render all messages
  renderMessages(messages) {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';
    
    // Add client card first
    if (this.activeChat?.client) {
      const clientCardEl = document.createElement('div');
      clientCardEl.innerHTML = this.renderClientCard(this.activeChat.client);
      messagesContainer.appendChild(clientCardEl);
    }
    
    // Add all messages
    messages.forEach(message => {
      this.renderMessage(message);
    });
    
    this.scrollToBottom();
  },
  
  // Process AI response - now with real API integration
  async processAIResponse(userMessage, clientId) {
    if (!this.activeChat) return;
    
    // Show cycling typing indicator
    await this.showCyclingTypingIndicator();
    
    let aiResponse;
    
    // Use real API for James Jackson, fallback to demo for others
    if (this.activeChat.isConnectedToAPI && clientId === 'james-jackson') {
      try {
        aiResponse = await this.callVertesiaAPI(userMessage, this.activeChat.client);
      } catch (error) {
        console.error('API call failed:', error);
        aiResponse = this.createErrorResponse(error);
      }
    } else {
      // Use the existing demo responses for other clients
      aiResponse = generateAIResponse(userMessage, clientId);
    }
    
    this.addMessage(this.activeChat.id, aiResponse, false);
  },
  
  // Call Vertesia API
  async callVertesiaAPI(userMessage, client) {
    const apiUrl = `${this.apiConfig.baseUrl}/chat/completions`; // Adjust endpoint as needed
    
    // Prepare the conversation context
    const conversationContext = {
      client_info: {
        name: client.name,
        company: client.company,
        account_type: client.accountType,
        client_id: client.clientId
      },
      message: userMessage,
    };
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(conversationContext)
    };
    
    try {
      const response = await fetch(apiUrl, requestOptions);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Format the API response to match your expected structure
      return this.formatAPIResponse(data);
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Format API response to match your UI structure
  formatAPIResponse(apiData) {
    // This will depend on what your API returns
    // For now, I'll assume it returns a structured response
    
    if (apiData.response) {
      return `
        <div class="ai-response">
          <div class="response-header">
            <strong>Answer</strong>
          </div>
          <p>${apiData.response}</p>
          
          ${apiData.workflow ? `
            <div class="response-section">
              <div class="section-header">
                <strong>Workflow</strong>
              </div>
              <div>${apiData.workflow}</div>
            </div>
          ` : ''}
          
          ${apiData.reminders ? `
            <div class="response-section">
              <div class="section-header">
                <strong>Reminders</strong>
              </div>
              <div>${apiData.reminders}</div>
            </div>
          ` : ''}
          
          ${apiData.citations ? `
            <div class="response-section">
              <div class="section-header">
                <strong>Citations</strong>
              </div>
              <div>${apiData.citations}</div>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    // Fallback if API response format is different
    return `
      <div class="ai-response">
        <div class="response-header">
          <strong>Answer</strong>
        </div>
        <p>${JSON.stringify(apiData)}</p>
      </div>
    `;
  },
  
  // Create error response
  createErrorResponse(error) {
    return `
      <div class="ai-response error-response">
        <div class="response-header">
          <strong>Connection Error</strong>
        </div>
        <p>I'm having trouble connecting to the live AI system right now. This might be due to:</p>
        <ul>
          <li>Network connectivity issues</li>
          <li>API key configuration</li>
          <li>Service temporarily unavailable</li>
        </ul>
        <p><em>Error: ${error.message}</em></p>
        <p>Please try again in a moment, or contact your system administrator if the problem persists.</p>
      </div>
    `;
  },
  
  // Show cycling typing indicator with promise-based timing
  showCyclingTypingIndicator() {
    return new Promise((resolve) => {
      const messagesContainer = document.getElementById('chat-messages');
      
      // Create typing indicator
      const typingEl = document.createElement('div');
      typingEl.className = 'typing-indicator';
      typingEl.id = 'typing-indicator';
      typingEl.innerHTML = `
        <div class="message-avatar ai-avatar">
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6">
            <path d="M50,10 C70,10 85,25 85,45 C85,65 70,80 50,80 C30,80 15,65 15,45 C15,30 25,20 40,20 C50,20 55,25 55,35 C55,45 50,50 40,50 C35,50 32,47 32,42"/>
          </svg>
        </div>
        <div class="typing-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="typing-text" id="typing-text">Converge is retrieving client details...</div>
        </div>
      `;
      
      messagesContainer.appendChild(typingEl);
      this.scrollToBottom();
      
      // Define the typing steps
      const typingSteps = [
        "Converge is retrieving client details...",
        "Converge is researching scenario...",
        "Converge is identifying relevant information...",
        "Converge is compiling response..."
      ];
      
      let currentStep = 0;
      const typingTextEl = document.getElementById('typing-text');
      
      // Start with first step already shown
      currentStep = 1;
      
      // Create interval to cycle through steps
      const interval = setInterval(() => {
        if (currentStep < typingSteps.length && typingTextEl) {
          typingTextEl.textContent = typingSteps[currentStep];
          currentStep++;
        } else {
          // All steps complete
          clearInterval(interval);
          this.hideTypingIndicator();
          resolve();
        }
      }, 2500); // 2.5 seconds per step
      
      // Store interval for cleanup
      this.typingInterval = interval;
    });
  },
  
  // Hide typing indicator
  hideTypingIndicator() {
    // Clear any existing interval
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }
    
    // Remove the typing indicator element
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
      typingEl.remove();
    }
  },
  
  // Scroll to bottom of messages
  scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  
  // Format time
  formatTime(date) {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  },
  
  // Generate export summary
  generateExportSummary() {
    if (!this.activeChat) return '';
    
    const client = this.activeChat.client;
    const messages = this.activeChat.messages;
    const startTime = this.formatTime(this.activeChat.startTime);
    
    let summary = `CONSULTATION SUMMARY\n\n`;
    summary += `Client: ${client.name} (${client.clientId || 'N/A'})\n`;
    summary += `Company: ${client.company}\n`;
    summary += `Account Type: ${client.accountType}\n`;
    summary += `Mode: ${this.activeChat.isConnectedToAPI ? 'Live AI Assistant' : 'Demo Mode'}\n`;
    summary += `Date: ${new Date().toLocaleDateString()}\n`;
    summary += `Time: ${startTime}\n\n`;
    
    summary += `CONVERSATION TRANSCRIPT:\n`;
    messages.forEach((msg, index) => {
      const speaker = msg.isUser ? 'ADVISOR' : 'ASSISTANT';
      const cleanContent = msg.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      summary += `${index + 1}. ${speaker}: ${cleanContent}\n\n`;
    });
    
    summary += `NEXT STEPS:\n`;
    summary += `- Follow up on any pending questions\n`;
    summary += `- Update client records in CRM\n`;
    summary += `- Schedule additional consultations if needed\n`;
    
    return summary;
  }
};
