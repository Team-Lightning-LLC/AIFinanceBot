// Demo client data
const clients = {
  'john-smith': {
    id: 'john-smith',
    name: 'John Smith',
    company: 'Acme Corporation',
    email: 'john.smith@acme.com',
    phone: '+1 (555) 123-4567',
    accountType: 'Premium',
    lastContact: 'April 28, 2025'
  },
  'eleanor-chen': {
    id: 'eleanor-chen',
    name: 'Dr. Eleanor Chen',
    company: 'Harvard University',
    email: 'echen@fas.harvard.edu',
    phone: '+1 (555) 123-4567',
    accountType: 'Harvard TDA - 403b',
    lastContact: 'April 28, 2025',
    inquiry: 'Roth IRA for Daughter'
  }
};

// Predefined chat responses for demo
const predefinedResponses = {
  // John Smith responses
  'roth-ira': `
    <div class="message-content">
      <p>Yes, John can open a custodial Roth IRA for his teenage daughter. Here are the key points:</p>
      <br>
      <ul>
        <li><strong>Eligibility:</strong> The daughter must have earned income from working</li>
        <li><strong>Contribution Limit:</strong> The lesser of $6,500 or the total of her earned income for the year</li>
        <li><strong>Account Control:</strong> John will manage the account until his daughter reaches the age of majority (18 or 21, depending on state)</li>
        <li><strong>Tax Benefits:</strong> Tax-free growth and tax-free qualified withdrawals in retirement</li>
      </ul>
      <br>
      <p>Would you like me to provide more specific information about the documentation needed to open a custodial Roth IRA?</p>
    </div>
  `,

  // Eleanor Chen responses
  'daughter-roth': `
    <div class="message-content">
      <p><strong>Yes</strong>, Dr. Chen can contribute money to her daughter's Roth IRA as long as the total contributions don't exceed her daughter's earned income for the year or $7,000 (2024 limit), whichever is less. Since her daughter is 13 and earning money from work, a custodial Roth IRA can be opened with Dr. Chen as the custodian until her daughter reaches the age of majority.
</p>
      <br>
      <p>Workflow:</p>
      <br>
      <p>1. Verify the minor has earned income</p>
      <p>2. Document the minor's earnings (especially important for informal work)</p>
      <p>3. Open a custodial Roth IRA with an adult as custodian</p>
      <p>4. Make contributions that don't exceed the minor's earned income or annual limit </p>
      <p>5. Maintain account until child reaches age of majority (18-21 depending on state)</p>
      <br>
      <p><strong>Clarifications:</strong> Proper documentation of the child's income is critical for IRS compliance. Horizon Financial policy would require verification of income source and filing status before opening the account under custodial guidelines.</p>
    </div>
  `,
  '403b-impact': `
    <div class="message-content">
      <p><strong>No</strong>, opening and contributing to a custodial Roth IRA for her daughter will not affect Dr. Chen's 403(b) plan in any way.</p>
      <br>
      <ul>
        <li>The <strong>403(b) plan</strong> is tied to Dr. Chen's <strong>own employment</strong> and income through Harvard University.</li>
        <li><strong>The Roth IRA</strong> for her daughter is an entirely <strong>separate tax-advantaged account</strong>, established under the daughter's Social Security Number, not Dr. Chen's.</li>
        <li>Contributions to the custodial Roth IRA are <strong>not aggregated with 403(b)</strong> contributions for IRS limits—they are governed under separate code sections.</li>
      </ul>
      <br>
      <p><strong>Key Consideration:</strong> There is <strong>no IRS interaction or conflict</strong> between a parent's qualified retirement plan and a minor child's custodial Roth IRA as long as contribution limits and earned income rules are followed.</p>
    </div>
  `,
  'roth-401k-question': `
    <div class="message-content">
      <p>Regarding moving the Roth IRA to a 401(k):</p>
      <br>
      <p><strong>1. Future options:</strong> When the daughter gets older and has her own 401(k) through an employer, she can't directly "move" her Roth IRA into her 401(k). These are different account types with different tax treatments.</p>
      <br>
      <p><strong>2. What she can do:</strong></p>
      <ul>
        <li>Keep both accounts: She can maintain her Roth IRA and contribute to her future employer's 401(k) separately</li>
        <li>Roll a future 401(k) to Roth IRA: If she leaves an employer, she could roll her Roth 401(k) contributions INTO her existing Roth IRA, but not the other way around</li>
        <li>Contribute to both: Once employed, she can contribute to both a 401(k) and Roth IRA simultaneously (subject to income limits)</li>
      </ul>
      <br>
      <p><strong>3. Recommendation:</strong> The Roth IRA is an excellent long-term wealth-building vehicle with more investment flexibility than most 401(k) plans. I would recommend keeping it separate from any future 401(k) to maximize tax-advantaged savings opportunities.</p>
    </div>
  `,
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

// Initial messages for each client
const initialMessages = {
  'john-smith': [
    {
      content: "Client is calling about opening a Roth IRA for his teenage daughter who has started working part-time. He wants to know if this is possible and what the requirements would be.",
      isUser: true,
      timestamp: "12:30 PM"
    }
  ],
  'eleanor-chen': [
    {
      content: "Client is calling in and wants to open a Roth for their daughter. Daughter is 13 and making a bit of money from working on her own. Can Dr. Chen contribute money to her daughter's account?",
      isUser: true,
      timestamp: "12:30 PM"
    }
  ]
};

// Predefined AI responses based on keywords
function getAIResponse(message) {
  message = message.toLowerCase();
  
  // Eleanor Chen specific responses
  if (message.includes("daughter") && message.includes("roth")) {
    return predefinedResponses['daughter-roth'];
  }
  if (message.includes("403b") || message.includes("403(b)") || message.includes("mess")) {
    return predefinedResponses['403b-impact'];
  }
  if (message.includes("401k") || message.includes("401(k)") || message.includes("move")) {
    return predefinedResponses['roth-401k-question'];
  }
  
  // John Smith specific responses
  if (message.includes("roth") && message.includes("ira")) {
    return predefinedResponses['roth-ira'];
  }
  
  // Generic fallback response
  return predefinedResponses['generic-response'];
}
