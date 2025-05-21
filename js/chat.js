// Chat management functions
const ChatManager = {
  activeClient: null,
  chats: {},
  
  // Create a new chat for a client
  createChat: function(clientId) {
    const client = clients[clientId];
    if (!client) return null;
    
    const chatId = `chat-${Date.now()}`;
    const timestamp = this.formatTimestamp(new Date());
    
    this.chats[chatId] = {
      id: chatId,
      clientId: clientId,
      title: `${client.name} - ${client.inquiry || 'General Inquiry'}`,
      createdAt: new Date(),
      isStarred: false,
      isComplete: false,
      messages: initialMessages[clientId] ? [...initialMessages[clientId]] : []
    };
    
    return this.chats[chatId];
  },
  
  // Get client information card HTML
  getClientInfoCard: function(clientId) {
    const client = clients[clientId];
    if (!client) return '';
    
    return `
      <div class="client-info-card">
        <div class="client-info-header">
          <div class="client-info-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Client Information
          </div>
        </div>
        <div class="client-info-content">
          <div class="info-item">
            <div class="info-label">Full Name</div>
            <div class="info-value">${client.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Company</div>
            <div class="info-value">${client.company}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${client.email}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone</div>
            <div class="info-value">${client.phone}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Account Type</div>
            <div class="info-value">${client.accountType}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Last Contact</div>
            <div class="info-value">${client.lastContact}</div>
          </div>
        </div>
      </div>
    `;
  },
  
  // Add a chat to the sidebar
  addChatToSidebar: function(chat) {
    const chatList = document.getElementById('chat-list');
    const chatItem = document.createElement('div');
    chatItem.className = `chat-item${chat.isStarred ? ' starred' : ''}`;
    chatItem.dataset.chatId = chat.id;
    
    chatItem.innerHTML = `
      ${chat.isStarred ? `
        <svg class="star-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ` : ''}
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <div class="chat-item-title">${chat.title}</div>
      <div class="chat-timestamp">${this.formatTimestamp(chat.createdAt)}</div>
    `;
    
    chatItem.addEventListener('click', () => {
      this.activateChat(chat.id);
    });
    
    chatList.appendChild(chatItem);
    return chatItem;
  },
  // Add a message to the chat (continued)
  addMessage: function(chatId, messageContent, isUser) {
    if (!this.chats[chatId]) return;
    
    const timestamp = this.formatTimestamp(new Date());
    const newMessage = {
      content: messageContent,
      isUser: isUser,
      timestamp: timestamp
    };
    
    this.chats[chatId].messages.push(newMessage);
    
    // Add message to the DOM if this is the active chat
    if (this.activeClient && this.chats[chatId].clientId === this.activeClient) {
      this.renderMessage(newMessage);
    }
    
    return newMessage;
  },
  
  // Render a message in the chat area
  renderMessage: function(message) {
    const chatArea = document.getElementById('chat-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message${message.isUser ? ' user' : ''}`;
    
    // For AI responses, use the HTML content directly from predefined responses
    if (!message.isUser && message.content.startsWith('<div class="message-content">')) {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          ${message.isUser ? 'JD' : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          `}
        </div>
        <div>
          ${message.content}
          <div class="message-timestamp">${message.timestamp}</div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          ${message.isUser ? 'JD' : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          `}
        </div>
        <div>
          <div class="message-content">${message.content}</div>
          <div class="message-timestamp">${message.timestamp}</div>
        </div>
      `;
    }
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  },
  
  // Render all messages for a given chat
  renderAllMessages: function(chatId) {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = '';
    
    const chat = this.chats[chatId];
    if (!chat) return;
    
    // Add client info card
    chatArea.innerHTML = this.getClientInfoCard(chat.clientId);
    
    // Add all messages
    chat.messages.forEach(message => {
      this.renderMessage(message);
    });
  },
  
  // Activate a specific chat
  activateChat: function(chatId) {
    const chat = this.chats[chatId];
    if (!chat) return;
    
    // Update the active client
    this.activeClient = chat.clientId;
    
    // Show the chat content and hide empty state
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('chat-content').style.display = 'flex';
    
    // Update chat header
    document.getElementById('chat-header-title').textContent = chat.title;
    
    // Clear and re-render messages
    this.renderAllMessages(chatId);
    
    // Update sidebar selected state
    document.querySelectorAll('.chat-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`.chat-item[data-chat-id="${chatId}"]`).classList.add('active');
  },
  
  // Toggle star status for a chat
  toggleStar: function(chatId) {
    const chat = this.chats[chatId];
    if (!chat) return;
    
    chat.isStarred = !chat.isStarred;
    
    // Update UI
    const chatItem = document.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
    if (chat.isStarred) {
      chatItem.classList.add('starred');
      if (!chatItem.querySelector('.star-icon')) {
        const starIcon = document.createElement('svg');
        starIcon.className = 'star-icon';
        starIcon.setAttribute('width', '16');
        starIcon.setAttribute('height', '16');
        starIcon.setAttribute('viewBox', '0 0 24 24');
        starIcon.setAttribute('fill', 'currentColor');
        starIcon.setAttribute('stroke', 'none');
        starIcon.innerHTML = '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>';
        chatItem.insertBefore(starIcon, chatItem.firstChild);
      }
    } else {
      chatItem.classList.remove('starred');
      const starIcon = chatItem.querySelector('.star-icon');
      if (starIcon) {
        starIcon.remove();
      }
    }
  },
  
  // Mark a chat as complete
  markComplete: function(chatId) {
    const chat = this.chats[chatId];
    if (!chat) return;
    
    chat.isComplete = true;
    
    // Update UI
    const chatItem = document.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
    chatItem.classList.add('completed');
    
    // Add "Completed" badge to chat header
    const chatHeader = document.getElementById('chat-header-title');
    chatHeader.innerHTML = `${chat.title} <span class="complete-badge">Complete</span>`;
  },
  
  // Format timestamp from Date object to readable string
  formatTimestamp: function(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  },
  
  // Process AI response
  processAIResponse: function(message, clientId) {
    const response = getAIResponse(message);
    
    // Find the active chat for this client
    let activeChat = null;
    for (const chatId in this.chats) {
      if (this.chats[chatId].clientId === clientId) {
        activeChat = this.chats[chatId];
        break;
      }
    }
    
    if (activeChat) {
      setTimeout(() => {
        this.addMessage(activeChat.id, response, false);
        
        // Simulate typing indicator (optional)
        const chatArea = document.getElementById('chat-area');
        chatArea.scrollTop = chatArea.scrollHeight;
      }, 1500); // Realistic delay before AI response
    }
  }
};
  
  
