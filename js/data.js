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
        <p>Mr. Jackson, based on your enrollment in the UT Saver TSA 403(b) plan through Texas University, there is <strong>no employer matching contribution available</strong> for this plan. The UT Saver TSA 403(b) is a voluntary supplemental retirement program that allows you to make contributions, but does not include any employer or state matching contributions.</p>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Workflow</strong>
          </div>
          <ol>
            <li>Review UT Saver TSA plan documentation</li>
            <li>Confirm contribution structure (employee-only contributions)</li>
            <li>Verify no matching provisions exist for TSA plan</li>
          </ol>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Reminders</strong>
          </div>
          <ul>
            <li>Annual contribution limit is $23,000 for 2024</li>
            <li>Additional catch-up contributions available if over 50</li>
            <li>Optional Retirement Program (ORP) offers 8.5% employer match if eligible</li>
          </ul>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Citations</strong>
          </div>
          <ul class="citations">
            <li>2024-utsaver-highlights-070224.pdf</li>
            <li>tsa-plandoc-2022.pdf (Section 2.2(a))</li>
            <li>retsummaryataglance2024.pdf</li>
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
        <p>Dr. Chen, based on our records, the Harvard University Tax-Deferred Annuity (TDA) 403(b) Plan that you participate in <strong>does not offer employer matching contributions</strong>. Your TDA Plan is funded solely through your own pre-tax or Roth after-tax contributions that you elect to make through payroll deductions. While Harvard University does make employer contributions to some of their other retirement programs, the TDA Plan is designed as a voluntary supplemental retirement savings vehicle without an employer match component.</p>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Workflow</strong>
          </div>
          <ol>
            <li>Review Harvard University TDA Plan Summary Plan Description</li>
            <li>Confirm TDA Plan contribution structure (employee contributions only)</li>
            <li>Verify no employer matching provision exists for this plan</li>
          </ol>
        </div>
        
        <div class="response-section">
          <div class="section-header">
            <strong>Reminders</strong>
          </div>
          <ul>
            <li>Contributions are 100% employee-funded</li>
            <li>Both pre-tax and Roth after-tax options available</li>
            <li>Annual IRS contribution limits apply</li>
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
  
  // Check for plan matching questions
  if (lowerMessage.includes('plan match') || lowerMessage.includes('matching') || lowerMessage.includes('contribution')) {
    return aiResponses[clientId]?.['plan-matching'] || getGenericResponse();
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

// Initial consultation questions (only for Eleanor Chen now)
const initialQuestions = {
  'eleanor-chen': "Does the client's plan match their contributions and how does that work in general?"
};
