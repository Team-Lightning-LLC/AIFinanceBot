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
  
  // Add a message to the chat
  addMessage: function(chatId, messageContent, isUser) {
    if (!this.chats[chatId]) return;
    
    const timestamp = this.formatTimestamp(new Date());
    const newMessage = {
      content: messageContent,
      isUser: isUser,
      timestamp: timestamp
    };
    
    this.chats[chatId].messages.push(
