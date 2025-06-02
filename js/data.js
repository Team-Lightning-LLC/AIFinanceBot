// Client data
const clients = {
  'james-jackson': {
    id: 'james-jackson',
    clientId: 'P00051',
    name: 'James Jackson',
    company: 'Texas University',
    accountType: 'UT Saver TSA 403(b)',
    birthDate: '1990-05-12',
    age: 35,
    avatar: 'JJ'
  },
  'eleanor-chen': {
    id: 'eleanor-chen',
    name: 'Dr. Eleanor Chen',
    company: 'Harvard University',
    accountType: 'Harvard TDA 403(b)',
    avatar: 'EC'
  },
  'blank': {
    id: 'blank',
    name: 'New Client',
    company: 'Company Name',
    accountType: 'Account Type',
    avatar: 'NC'
  }
};

// Predefined AI responses
const aiResponses = {
  'james-jackson': {
    'plan-matching': `
      <div class="ai-response">
        <div class="response-header">
          <strong>Answer</strong>
        </div>
        <p>James, based on your UT Saver TSA 403(b) plan, you can borrow up to $50,000 or 50% of your vested account balance, whichever is less. The minimum loan amount isn't explicitly stated in your plan document, but is typically $1,000 for most 403(b) plans.</p>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Workflow</strong>
          </div>
          <ol>
            <li>Complete the loan application form</li>
            <li>Submit the completed application to your plan administrator</li>
            <li>Once approved, receive loan proceeds</li>
            <li>Begin repayment according to the terms established in your loan agreement</li>
          </ol>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Reminders</strong>
          </div>
          <ul>
            <li>Outstanding loans reduce maximum borrowing amount</li>
            <li>Loans must be repaid with interest</li>
            <li>Early repayment may be available without penalty</li>
          </ul>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Citations</strong>
          </div>
          <ul class="citations">
            <li>tsa-plandoc-2022.pdf (Maximum loan amount: $50,000 or 50% of vested account balance)</li>
            <li>retirement_programs_spd.pdf (General loan provisions for 403(b) plans)</li>
          </ul>
        </div>
      </div>
    `
  },
  'eleanor-chen': {
    'plan-matching': `
      <div class="ai-response">
        <div class="response-header">
          <strong>Answer</strong>
        </div>
        <p> Dr. Chen, based on your Harvard TDA - 403b plan, you can borrow a minimum of $1,000 up to a maximum of 50% of your account balance, not to exceed $50,000. The $50,000 limit would be reduced if you've had any other TDA loans outstanding in the past 12 months. You're currently showing no active loans in our system.</p>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Workflow</strong>
          </div>
          <ol>
            <li>Verify loan eligibility (must be actively employed)</li>
            <li>Determine maximum loan amount (50% of TDA accumulations, up to $50,000)</li>
            <li>Select loan type (general-purpose or residential)</li>
            <li>Complete loan application with spousal consent if married</li>
            <li>Pay applicable loan fees ($75 for general-purpose, $125 for residential)</li>
          </ol>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Reminders</strong>
          </div>
          <ul>
            <li>Maximum of two outstanding loans allowed</li>
            <li>Loan repayment period: 5 years (general) or 10 years (residential)</li>
            <li>$25 annual maintenance fee applies</li>
          </ul>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Citations</strong>
          </div>
          <ul class="citations">
            <li>retirement_programs_spd.pdf (Harvard University Retirement Programs Summary Plan Description)</li>
            <li>harvard_university_retirement_plan_distribution_guide.pdf (Harvard University Retirement Plan Distribution Guide)</li>
          </ul>
        </div>
      </div>
    `
  }
};

// Generate AI response based on message content and client
function generateAIResponse(message, clientId) {
  const lowerMessage = message.toLowerCase();
  
 // Check for borrowing/loan questions
  if (lowerMessage.includes('borrow') || lowerMessage.includes('loan') || lowerMessage.includes('403b')) {
    return aiResponses[clientId]?.['borrowing'] || getGenericResponse();
  }
  
  return getGenericResponse();
}

function getGenericResponse() {
  return `
    <div class="ai-response">
      <div class="response-header">
        <strong>Answer</strong>
      </div>
      <p>I'd be happy to help you with that question. Based on the client's plan details, let me provide you with the most relevant information.</p>
      
      <div class="response-section">
        <div class="section-header">
          <strong>Recommendations</strong>
        </div>
        <ul>
          <li>Review the specific plan documentation for detailed provisions</li>
          <li>Consider scheduling a follow-up consultation if additional details are needed</li>
          <li>Ensure all regulatory compliance requirements are met</li>
        </ul>
      </div>
    </div>
  `;
}
