/**
 * Email Templates Module
 * 
 * Provides transactional email templates for GigExecs onboarding flows.
 * Uses consistent branding with the existing GigExecs email design system.
 * 
 * Brand colors:
 * - Primary: #0284C7
 * - Secondary: #0369A1
 * - Text: #1f2937, #374151
 * - Background: #f9fafb
 */

const BASE_URL = process.env.SITE_URL || 'https://gigexecs.com';

// =============================================================================
// Template Definitions
// =============================================================================

/**
 * All email template configurations
 */
const TEMPLATES = {
  // 1. Email Verified (All Users)
  email_verified: {
    subject: 'Email confirmed — next step: complete your profile',
    preheader: "You're in. Let's get you set up in minutes.",
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Thanks for confirming your email. You're now part of a growing community of senior professionals and companies embracing flexible, high-impact work.",
        "Next step: complete your profile so you can start getting real value from GigExecs."
      ],
      ctaText: 'Complete my profile',
      ctaUrl: `${BASE_URL}/profile`,
      secondaryCtaText: 'Go to dashboard',
      secondaryCtaUrl: `${BASE_URL}/dashboard`
    })
  },

  // 2. Welcome - Professional
  welcome_professional: {
    subject: "Welcome to GigExecs — let's get your profile ready",
    preheader: 'A strong profile helps you get shortlisted faster.',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Welcome to GigExecs — a community built for experienced professionals who value meaningful work, flexibility, and impact.",
        "Complete your profile so clients can quickly understand your strengths and you can be matched to the right gigs."
      ],
      ctaText: 'Complete my profile',
      ctaUrl: `${BASE_URL}/profile`,
      secondaryCtaText: 'Browse gigs',
      secondaryCtaUrl: `${BASE_URL}/find-gigs`
    })
  },

  // 3. Welcome - Client
  welcome_client: {
    subject: 'Welcome to GigExecs — hire senior talent, flexibly',
    preheader: 'Post a gig or browse profiles in minutes.',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Welcome to GigExecs. You now have access to senior professionals ready to support projects, fill expertise gaps, and take on fractional or contract roles.",
        "You can post a gig in minutes, or browse profiles to find the experience you need."
      ],
      ctaText: 'Post a gig',
      ctaUrl: `${BASE_URL}/gigs/create`,
      secondaryCtaText: 'Browse professionals',
      secondaryCtaUrl: `${BASE_URL}/professionals`
    })
  },

  // 4. Profile Completion Reminder - Professional
  reminder_professional: {
    subject: 'Finish your profile to get matched faster',
    preheader: 'A few minutes now increases your chances dramatically.',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Your profile isn't complete yet. A strong profile helps companies quickly understand your experience and improves your chances of being shortlisted.",
        "Add your key roles, skills, and a short intro — and you're good to go."
      ],
      ctaText: 'Complete my profile',
      ctaUrl: `${BASE_URL}/profile`,
      secondaryCtaText: 'Get help / contact support',
      secondaryCtaUrl: `${BASE_URL}/support`
    })
  },

  // 5. Profile Completion Reminder - Client
  reminder_client: {
    subject: 'Complete your company profile to unlock the best matches',
    preheader: 'It also makes posting your first gig faster.',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Your account is set up, but your company profile is still incomplete. A clear profile helps senior professionals understand who you are and what you value — and speeds up gig creation."
      ],
      ctaText: 'Complete company profile',
      ctaUrl: `${BASE_URL}/profile`,
      secondaryCtaText: 'Contact support',
      secondaryCtaUrl: `${BASE_URL}/support`
    })
  },

  // 6. Vetting Started - Professional
  vetting_started_professional: {
    subject: 'Profile received — vetting has started',
    preheader: "We'll update you as soon as a decision is made.",
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Thanks for completing your profile. We've started the vetting process to confirm your experience and ensure we maintain a high-quality community.",
        "This typically takes up to 7 days (often quicker). If we need clarification, we may contact you by email or phone."
      ],
      ctaText: 'View my profile',
      ctaUrl: `${BASE_URL}/profile`,
      secondaryCtaText: 'Go to dashboard',
      secondaryCtaUrl: `${BASE_URL}/dashboard`
    })
  },

  // 7. Review Started - Client
  review_started_client: {
    subject: "Company profile received — we're reviewing it",
    preheader: 'This typically takes up to 7 days (often quicker).',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Thanks for completing your company profile. We've started our review to confirm your details and understand how to best support your hiring needs.",
        "This typically takes up to 7 days (often quicker). We'll reach out if we need anything."
      ],
      ctaText: 'Go to dashboard',
      ctaUrl: `${BASE_URL}/dashboard`,
      secondaryCtaText: 'Post a gig',
      secondaryCtaUrl: `${BASE_URL}/gigs/create`
    })
  },

  // 8. Approved - Professional
  approved_professional: {
    subject: 'Approved — welcome to the GigExecs community',
    preheader: 'You now have full access to gigs and matching.',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Good news — your profile has been approved. You're now officially part of GigExecs, with full access to gigs, matching, and opportunities with companies looking for senior experience.",
        "We're still early in our journey, and your feedback really matters."
      ],
      ctaText: 'Browse gigs',
      ctaUrl: `${BASE_URL}/find-gigs`,
      secondaryCtaText: 'Share feedback',
      secondaryCtaUrl: `${BASE_URL}/feedback`
    })
  },

  // 9. Approved - Client
  approved_client: {
    subject: 'Approved — you can now hire with GigExecs',
    preheader: 'Post flexible roles and reach senior professionals fast.',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Good news — your company profile has been approved. You can now post flexible opportunities and connect with senior professionals across industries.",
        "We'd love your feedback on the hiring experience so we can keep improving."
      ],
      ctaText: 'Post a gig',
      ctaUrl: `${BASE_URL}/gigs/create`,
      secondaryCtaText: 'Browse professionals',
      secondaryCtaUrl: `${BASE_URL}/professionals`
    })
  },

  // 10. Needs Info - Professional
  needs_info_professional: {
    subject: 'Action needed: we need one more detail to complete vetting',
    preheader: 'Reply here or update your profile to continue.',
    getContent: ({ first_name, missing_item }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        `We're reviewing your profile and need one more detail to complete vetting: ${missing_item || '[additional information required]'}.`,
        "You can update your profile or reply to this email with the required info."
      ],
      ctaText: 'Update my profile',
      ctaUrl: `${BASE_URL}/profile`,
      secondaryCtaText: 'Reply to this email',
      secondaryCtaUrl: null
    })
  },

  // 11. Declined - Professional
  declined_professional: {
    subject: 'Update on your GigExecs application',
    preheader: 'Thank you for the time you put into your profile.',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Thanks for completing your profile and applying to GigExecs. After review, we're not able to approve your profile at this time.",
        "If you believe this is a mistake, or you'd like to reapply in future with additional detail, reply to this email and we'll advise the best next step."
      ],
      ctaText: 'Contact support',
      ctaUrl: `${BASE_URL}/support`,
      secondaryCtaText: 'View profile',
      secondaryCtaUrl: `${BASE_URL}/profile`
    })
  },

  // 12. Needs Info - Client
  needs_info_client: {
    subject: 'Quick question to complete your company review',
    preheader: 'One detail needed before approval.',
    getContent: ({ first_name, missing_item }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        `We're reviewing your company profile and need one more detail: ${missing_item || '[additional information required]'}.`,
        "Reply to this email or update your company profile to continue."
      ],
      ctaText: 'Update company profile',
      ctaUrl: `${BASE_URL}/profile`,
      secondaryCtaText: 'Reply to this email',
      secondaryCtaUrl: null
    })
  },

  // 13. Declined - Client
  declined_client: {
    subject: 'Update on your GigExecs company profile',
    preheader: 'Thanks for your interest in GigExecs.',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Thanks for setting up your company profile. After review, we're not able to approve the profile at this time.",
        "If you'd like to discuss your use case or reapply, reply to this email and we'll help."
      ],
      ctaText: 'Contact support',
      ctaUrl: `${BASE_URL}/support`,
      secondaryCtaText: 'View dashboard',
      secondaryCtaUrl: `${BASE_URL}/dashboard`
    })
  },

  // 14. Activation Nudge - Professional
  activation_nudge_professional: {
    subject: 'Next best step: apply to your first gig',
    preheader: '2 minutes to get momentum.',
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "Now that you're approved, the fastest way to get value is to apply to a gig that matches your expertise."
      ],
      ctaText: 'Browse gigs',
      ctaUrl: `${BASE_URL}/find-gigs`,
      secondaryCtaText: 'Update profile',
      secondaryCtaUrl: `${BASE_URL}/profile`
    })
  },

  // 15. Activation Nudge - Client
  activation_nudge_client: {
    subject: "Ready when you are — post your first gig",
    preheader: "You'll start seeing bids from senior talent fast.",
    getContent: ({ first_name }) => ({
      greeting: `Hi ${first_name},`,
      paragraphs: [
        "The quickest way to see GigExecs working is to post a gig. Keep it short — role, outcomes, timeframe — and we'll do the rest."
      ],
      ctaText: 'Post a gig',
      ctaUrl: `${BASE_URL}/gigs/create`,
      secondaryCtaText: 'Browse professionals',
      secondaryCtaUrl: `${BASE_URL}/professionals`
    })
  }
};

// =============================================================================
// HTML Template Builder
// =============================================================================

/**
 * Base CSS styles for all emails (inline-friendly)
 */
const getBaseStyles = () => `
  <style>
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    
    /* Base styles */
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      height: 100% !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .email-wrapper {
      width: 100%;
      background-color: #f9fafb;
      padding: 20px 0;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
      color: white;
    }
    
    .tagline {
      font-size: 16px;
      opacity: 0.9;
      font-weight: 400;
      color: white;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 24px;
    }
    
    .paragraph {
      margin-bottom: 20px;
      font-size: 16px;
      color: #374151;
      line-height: 1.7;
    }
    
    .cta-container {
      margin: 32px 0;
      text-align: center;
    }
    
    .cta-button {
      display: inline-block;
      padding: 16px 32px;
      background-color: #0284C7;
      color: white !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.5;
      text-align: center;
      min-width: 200px;
    }
    
    .cta-button:hover {
      background-color: #0369A1;
    }
    
    .secondary-cta {
      margin-top: 16px;
      text-align: center;
    }
    
    .secondary-link {
      color: #0284C7;
      text-decoration: none;
      font-size: 14px;
    }
    
    .secondary-link:hover {
      text-decoration: underline;
    }
    
    .footer {
      background: #f8fafc;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-logo {
      font-weight: 800;
      color: #0284C7;
      font-size: 18px;
      margin-bottom: 8px;
    }
    
    .footer-tagline {
      margin-bottom: 15px;
      font-style: italic;
    }
    
    .footer-links {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 15px;
    }
    
    .footer-link {
      color: #0284C7;
      text-decoration: none;
    }
    
    .footer-link:hover {
      text-decoration: underline;
    }
    
    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
        margin: 0;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .logo {
        font-size: 28px;
      }
      
      .cta-button {
        display: block;
        width: 100%;
        padding: 14px 24px;
      }
      
      .footer {
        padding: 24px 20px;
      }
    }
  </style>
`;

/**
 * Builds the complete HTML email from template content
 * @param {Object} templateConfig - Template configuration
 * @param {Object} variables - Template variables
 * @returns {Object} - { subject, html, text }
 */
function buildEmailHtml(templateConfig, variables) {
  const content = templateConfig.getContent(variables);
  const { subject, preheader } = templateConfig;
  
  const paragraphsHtml = content.paragraphs
    .map(p => `<div class="paragraph">${p}</div>`)
    .join('\n        ');
  
  const secondaryCtaHtml = content.secondaryCtaText && content.secondaryCtaUrl
    ? `<div class="secondary-cta">
        <a href="${content.secondaryCtaUrl}" class="secondary-link" style="color: #0284C7; text-decoration: none;">${content.secondaryCtaText}</a>
      </div>`
    : content.secondaryCtaText
    ? `<div class="secondary-cta">
        <span style="color: #6b7280; font-size: 14px;">Or ${content.secondaryCtaText.toLowerCase()}</span>
      </div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  ${getBaseStyles()}
</head>
<body>
  <!-- Preheader text (hidden but shown in email preview) -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${preheader}
  </div>
  <!-- End preheader -->
  
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <div class="logo">GigExecs</div>
        <div class="tagline">Flexible work for senior professionals</div>
      </div>
      
      <!-- Content -->
      <div class="content">
        <div class="greeting">${content.greeting}</div>
        
        ${paragraphsHtml}
        
        <!-- CTA Button -->
        <div class="cta-container">
          <a href="${content.ctaUrl}" class="cta-button" style="color: white !important; text-decoration: none;">${content.ctaText}</a>
        </div>
        
        ${secondaryCtaHtml}
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="footer-logo">GigExecs</div>
        <div class="footer-tagline">The Premier Hub for Highly Experienced Professionals</div>
        <div style="margin-top: 15px;">
          <a href="${BASE_URL}" class="footer-link" style="color: #0284C7; text-decoration: none;">www.gigexecs.com</a>
        </div>
        <div class="footer-links">
          You're receiving this because you're part of the GigExecs community.<br>
          <a href="${BASE_URL}/settings/notifications" class="footer-link" style="color: #0284C7; text-decoration: none;">Update preferences</a> | 
          <a href="${BASE_URL}/unsubscribe" class="footer-link" style="color: #0284C7; text-decoration: none;">Unsubscribe</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Generate plain text version
  const text = `${content.greeting}

${content.paragraphs.join('\n\n')}

${content.ctaText}: ${content.ctaUrl}
${content.secondaryCtaText && content.secondaryCtaUrl ? `\n${content.secondaryCtaText}: ${content.secondaryCtaUrl}` : ''}

---
GigExecs - The Premier Hub for Highly Experienced Professionals
www.gigexecs.com

You're receiving this because you're part of the GigExecs community.
Update preferences: ${BASE_URL}/settings/notifications
Unsubscribe: ${BASE_URL}/unsubscribe`;

  return { subject, html, text };
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Get available template IDs
 * @returns {string[]}
 */
function getTemplateIds() {
  return Object.keys(TEMPLATES);
}

/**
 * Check if a template exists
 * @param {string} templateId 
 * @returns {boolean}
 */
function templateExists(templateId) {
  return templateId in TEMPLATES;
}

/**
 * Render an email template
 * @param {string} templateId - Template identifier
 * @param {Object} variables - Template variables (first_name, email, etc.)
 * @returns {Object} - { subject, html, text }
 * @throws {Error} - If template not found
 */
function renderTemplate(templateId, variables) {
  const template = TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Email template not found: ${templateId}`);
  }
  
  return buildEmailHtml(template, variables);
}

/**
 * Get template metadata (subject, preheader) without rendering
 * @param {string} templateId 
 * @returns {Object} - { subject, preheader }
 */
function getTemplateMetadata(templateId) {
  const template = TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Email template not found: ${templateId}`);
  }
  
  return {
    subject: template.subject,
    preheader: template.preheader
  };
}

/**
 * Determine which templates to send based on user type
 * @param {string} trigger - Trigger event (e.g., 'email_verified', 'approved')
 * @param {string} userType - 'consultant' or 'client'
 * @returns {string[]} - Array of template IDs to send
 */
function getTemplatesForTrigger(trigger, userType) {
  const isProfessional = userType === 'consultant';
  
  switch (trigger) {
    case 'email_verified':
      // Send email_verified + welcome based on user type
      return isProfessional
        ? ['email_verified', 'welcome_professional']
        : ['email_verified', 'welcome_client'];
    
    case 'profile_complete':
      return isProfessional
        ? ['vetting_started_professional']
        : ['review_started_client'];
    
    case 'approved':
      return isProfessional
        ? ['approved_professional']
        : ['approved_client'];
    
    case 'declined':
      return isProfessional
        ? ['declined_professional']
        : ['declined_client'];
    
    case 'needs_info':
      return isProfessional
        ? ['needs_info_professional']
        : ['needs_info_client'];
    
    case 'reminder':
      return isProfessional
        ? ['reminder_professional']
        : ['reminder_client'];
    
    case 'activation_nudge':
      return isProfessional
        ? ['activation_nudge_professional']
        : ['activation_nudge_client'];
    
    default:
      return [];
  }
}

module.exports = {
  getTemplateIds,
  templateExists,
  renderTemplate,
  getTemplateMetadata,
  getTemplatesForTrigger,
  TEMPLATES,
  BASE_URL
};
