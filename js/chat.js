const ChatManager = {
  activeChat: null,
  chats: new Map(),
  typingInterval: null,
  jwtToken: null, // Store JWT token
  
  // API Configuration
  apiConfig: {
    baseUrl: 'https://studio-server-production.api.vertesia.io/api/v1',
    apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual API key
    authUrl: 'https://studio-server-production.api.vertesia.io/auth/token'
  },

  // Get JWT token from API key
  async getJwtToken() {
    if (this.jwtToken) {
      return this.jwtToken; // Return cached token if available
    }

    try {
      const response = await fetch(`${this.apiConfig.authUrl}?token=${this.apiConfig.apiKey}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to get JWT token: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.jwtToken = data.token; // Cache the JWT token
      return this.jwtToken;

    } catch (error) {
      console.error('Error getting JWT token:', error);
      throw error;
    }
  },

  // Call Vertesia API with the correct endpoint and format
  async callVertesiaAPI(userMessage, client) {
    try {
      // Get JWT token first
      const jwtToken = await this.getJwtToken();
      
      const apiUrl = `${this.apiConfig.baseUrl}/execute`;
      
      // Prepare the request payload according to Vertesia's /execute endpoint
      const requestPayload = {
        interaction: "RetAgentV2", // Your interaction name
        data: {
          userMessage: userMessage,
          clientInfo: {
            name: client.name,
            company: client.company,
            accountType: client.accountType,
            clientId: client.clientId || 'unknown'
          }
        },
        config: {
          // Add any configuration options here if needed
        },
        stream: false // Set to true if you want streaming responses
      };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`, // Use JWT token, not API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      };

      const response = await fetch(apiUrl, requestOptions);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Format the response for your UI
      return this.formatAPIResponse(data);
      
    } catch (error) {
      console.error('Vertesia API Error:', error);
      throw error;
    }
  },

  // Format API response for your UI
  formatAPIResponse(apiData) {
    // The /execute endpoint returns a run object with an ID and status
    // You might need to poll for results or handle streaming responses
    
    if (apiData.id && apiData.status === 'created') {
      // If the execution was created, you might need to poll for results
      // or handle this differently based on your interaction setup
      return `
        <div class="ai-response">
          <div class="response-header">
            <strong>Processing...</strong>
          </div>
          <p>Your request is being processed. Run ID: ${apiData.id}</p>
        </div>
      `;
    }
    
    // If you get immediate results (depends on your interaction configuration)
    if (apiData.result) {
      return `
        <div class="ai-response">
          <div class="response-header">
            <strong>Retirement Guidance</strong>
          </div>
          <p>${apiData.result}</p>
        </div>
      `;
    }
    
    // Fallback response
    return `
      <div class="ai-response">
        <div class="response-header">
          <strong>Response</strong>
        </div>
        <p>Request submitted successfully. ${JSON.stringify(apiData)}</p>
      </div>
    `;
  },

  // Update the processAIResponse method to use the corrected API call
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

  // Rest of your existing code remains the same...
  // (all the other methods like createConsultation, addToSidebar, etc.)
};
