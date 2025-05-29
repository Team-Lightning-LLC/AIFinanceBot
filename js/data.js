// Demo client data - Updated with simplified information
const clients = {
  'james-jackson': {
    id: 'james-jackson',
    name: 'James Jackson',
    company: 'Texas University',
    accountType: 'UT Saver TSA 403b'
  },
  'eleanor-chen': {
    id: 'eleanor-chen',
    name: 'Dr. Eleanor Chen',
    company: 'Harvard University',
    accountType: 'Harvard TDA - 403b'
  }
};

// Updated predefined responses
const predefinedResponses = {
  // James Jackson specific response
  'jackson-matching': `
    <div class="message-content">
      <p><strong>Answer:</strong> Mr. Jackson, based on your enrollment in the UT Saver TSA 403(b) plan through Texas University, there is no employer matching contribution available for this plan. The UT Saver TSA 403(b) is a voluntary supplemental retirement program that allows you to make contributions, but does not include any employer or state matching contributions.</p>
      <br>
      <p><strong>Reminders:</strong></p>
      <ul>
        <li>Annual contribution limit is $23,000 for 2024</li>
        <li>Additional catch-up contributions available if over 50</li>
        <li>Optional Retirement Program (ORP) offers 8.5% employer match if eligible</li>
      </ul>
      <br>
      <p><strong>Citations:</strong></p>
      <ul>
        <li>2024-utsaver-highlights-070224.pdf</li>
        <li>tsa-plandoc-2022.pdf (Section 2.2(a))</li>
        <li>retsummaryataglance2024.pdf</li>
      </ul>
    </div>
  `,

  // Eleanor Chen specific response
  'chen-matching': `
    <div class="message-content">
      <p><strong>Answer:</strong> Dr. Chen, based on our records, the Harvard University Tax-Deferred Annuity (TDA) 403(b) Plan that you participate in does not offer employer matching contributions. Your TDA Plan is funded solely through your own pre-tax or Roth after-tax contributions that you elect to make through payroll deductions. While Harvard University does make employer contributions to some of their other retirement programs, the TDA Plan is designed as a voluntary supplemental retirement savings vehicle without an employer match component.</p>
      <br>
      <p><strong>Workflow:</strong></p>
      <ol>
        <li>Review Harvard University TDA Plan Summary Plan Description</li>
        <li>Confirm TDA Plan contribution structure (employee contributions only)</li>
        <li>Verify no employer matching provision exists for this plan</li>
      </ol>
      <br>
      <p><strong>Reminders:</strong></p>
      <ul>
        <li>Contributions are 100% employee-funded</li>
        <li>Both pre-tax and Roth after-tax options available</li>
        <li>Annual IRS contribution limits apply</li>
      </ul>
      <br>
      <p><strong>Citations:</strong></p>
      <ul>
        <li>retirement_programs_spd.pdf (Harvard University Retirement Programs Summary Plan Description)</li>
        <li>harvard_university_retirement_plan_distribution_guide.pdf (Harvard University Retirement Plan Distribution Guide)</li>
      </ul>
    </div>
  `,
  
  // Generic fallback response
  'generic-response': `
    <div class="message-content">
      <p>Thank you for your question. I'd be happy to help with that.</p>
      <br>
      <p>Based on our company policies and industry regulations, here are the key points to consider:</p>
      <br>
      <ul>
        <li>The specific requirements depend on the client's individual circumstances</li>
        <li>There may be tax implications to consider before proceeding</li>
        <li>Documentation requirements will vary based on the account type</li>
        <li>For this particular situation, I would recommend scheduling a follow-up call with a specialist</li>
      </ul>
      <br>
      <p>Would you like me to arrange that call or provide more specific information about any of these points?</p>
    </div>
  `
};

// Updated initial messages for each client
const initialMessages = {
  'james-jackson': [
    {
      content: "Does the client's plan match their contributions and how does that work in general?",
      isUser: true,
      timestamp: "12:30 PM"
    }
  ],
  'eleanor-chen': [
    {
      content: "Does the client's plan match their contributions and how does that work in general?",
      isUser: true,
      timestamp: "12:30 PM"
    }
  ]
};

// Updated predefined AI responses based on client
function getAIResponse(message, clientId) {
  message = message.toLowerCase();
  
  // James Jackson specific responses
  if (clientId === 'james-jackson') {
    if (message.includes("match") || message.includes("contribution") || message.includes("plan")) {
      return predefinedResponses['jackson-matching'];
    }
  }
  
  // Eleanor Chen specific responses
  if (clientId === 'eleanor-chen') {
    if (message.includes("match") || message.includes("contribution") || message.includes("plan")) {
      return predefinedResponses['chen-matching'];
    }
  }
  
  // Generic fallback response
  return predefinedResponses['generic-response'];
}
