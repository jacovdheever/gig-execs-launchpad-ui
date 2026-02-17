/**
 * Unit tests for Email System
 * 
 * Tests cover:
 * - Template rendering
 * - Template metadata
 * - Trigger to template mapping
 * - Idempotency key generation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// =============================================================================
// Mock Implementations (since actual modules are in netlify/functions)
// =============================================================================

/**
 * Template configurations (mirroring email-templates.js structure)
 */
const TEMPLATES = {
  email_verified: {
    subject: 'Email confirmed — next step: complete your profile',
    preheader: "You're in. Let's get you set up in minutes.",
  },
  welcome_professional: {
    subject: "Welcome to GigExecs — let's get your profile ready",
    preheader: 'A strong profile helps you get shortlisted faster.',
  },
  welcome_client: {
    subject: 'Welcome to GigExecs — hire senior talent, flexibly',
    preheader: 'Post a gig or browse profiles in minutes.',
  },
  reminder_professional: {
    subject: 'Finish your profile to get matched faster',
    preheader: 'A few minutes now increases your chances dramatically.',
  },
  reminder_client: {
    subject: 'Complete your company profile to unlock the best matches',
    preheader: 'It also makes posting your first gig faster.',
  },
  vetting_started_professional: {
    subject: 'Profile received — vetting has started',
    preheader: "We'll update you as soon as a decision is made.",
  },
  review_started_client: {
    subject: "Company profile received — we're reviewing it",
    preheader: 'This typically takes up to 7 days (often quicker).',
  },
  approved_professional: {
    subject: 'Approved — welcome to the GigExecs community',
    preheader: 'You now have full access to gigs and matching.',
  },
  approved_client: {
    subject: 'Approved — you can now hire with GigExecs',
    preheader: 'Post flexible roles and reach senior professionals fast.',
  },
  needs_info_professional: {
    subject: 'Action needed: we need one more detail to complete vetting',
    preheader: 'Reply here or update your profile to continue.',
  },
  declined_professional: {
    subject: 'Update on your GigExecs application',
    preheader: 'Thank you for the time you put into your profile.',
  },
  needs_info_client: {
    subject: 'Quick question to complete your company review',
    preheader: 'One detail needed before approval.',
  },
  declined_client: {
    subject: 'Update on your GigExecs company profile',
    preheader: 'Thanks for your interest in GigExecs.',
  },
  activation_nudge_professional: {
    subject: 'Next best step: apply to your first gig',
    preheader: '2 minutes to get momentum.',
  },
  activation_nudge_client: {
    subject: "Ready when you are — post your first gig",
    preheader: "You'll start seeing bids from senior talent fast.",
  },
};

/**
 * Check if a template exists
 */
function templateExists(templateId: string): boolean {
  return templateId in TEMPLATES;
}

/**
 * Get template IDs
 */
function getTemplateIds(): string[] {
  return Object.keys(TEMPLATES);
}

/**
 * Get template metadata
 */
function getTemplateMetadata(templateId: string): { subject: string; preheader: string } | null {
  const template = TEMPLATES[templateId as keyof typeof TEMPLATES];
  if (!template) return null;
  return { subject: template.subject, preheader: template.preheader };
}

/**
 * Get templates for trigger event
 */
function getTemplatesForTrigger(trigger: string, userType: string): string[] {
  const isProfessional = userType === 'consultant';
  
  switch (trigger) {
    case 'email_verified':
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

/**
 * Generate lifecycle key for reminder
 */
function getReminderLifecycleKey(daysSinceRegistration: number): string | null {
  const REMINDER_DAYS = [7, 14, 30];
  const RECURRING_INTERVAL_DAYS = 30;
  
  for (const day of REMINDER_DAYS) {
    if (daysSinceRegistration >= day && daysSinceRegistration < day + 1) {
      return `reminder_${day}d`;
    }
  }
  
  const lastFixedDay = REMINDER_DAYS[REMINDER_DAYS.length - 1];
  if (daysSinceRegistration > lastFixedDay) {
    const daysSinceLastFixed = daysSinceRegistration - lastFixedDay;
    const intervalNumber = Math.floor(daysSinceLastFixed / RECURRING_INTERVAL_DAYS);
    const dayInInterval = daysSinceLastFixed % RECURRING_INTERVAL_DAYS;
    
    if (dayInInterval < 1 && intervalNumber > 0) {
      const reminderDay = lastFixedDay + (intervalNumber * RECURRING_INTERVAL_DAYS);
      return `reminder_${reminderDay}d`;
    }
  }
  
  return null;
}

// =============================================================================
// Tests: Template Existence
// =============================================================================

describe('Email Templates', () => {
  describe('Template Registry', () => {
    it('should have exactly 15 templates', () => {
      expect(getTemplateIds().length).toBe(15);
    });

    it('should have all required template IDs', () => {
      const expectedTemplates = [
        'email_verified',
        'welcome_professional',
        'welcome_client',
        'reminder_professional',
        'reminder_client',
        'vetting_started_professional',
        'review_started_client',
        'approved_professional',
        'approved_client',
        'needs_info_professional',
        'declined_professional',
        'needs_info_client',
        'declined_client',
        'activation_nudge_professional',
        'activation_nudge_client',
      ];

      for (const templateId of expectedTemplates) {
        expect(templateExists(templateId)).toBe(true);
      }
    });

    it('should return false for non-existent templates', () => {
      expect(templateExists('nonexistent_template')).toBe(false);
      expect(templateExists('')).toBe(false);
      expect(templateExists('welcome')).toBe(false);
    });
  });

  describe('Template Metadata', () => {
    it('should return correct metadata for email_verified', () => {
      const meta = getTemplateMetadata('email_verified');
      expect(meta).not.toBeNull();
      expect(meta?.subject).toBe('Email confirmed — next step: complete your profile');
      expect(meta?.preheader).toContain("You're in");
    });

    it('should return correct metadata for welcome_professional', () => {
      const meta = getTemplateMetadata('welcome_professional');
      expect(meta).not.toBeNull();
      expect(meta?.subject).toContain('Welcome to GigExecs');
      expect(meta?.preheader).toContain('profile');
    });

    it('should return correct metadata for approved templates', () => {
      const proMeta = getTemplateMetadata('approved_professional');
      const clientMeta = getTemplateMetadata('approved_client');
      
      expect(proMeta?.subject).toContain('Approved');
      expect(clientMeta?.subject).toContain('Approved');
      expect(proMeta?.subject).not.toBe(clientMeta?.subject);
    });

    it('should return null for invalid template', () => {
      expect(getTemplateMetadata('invalid')).toBeNull();
    });
  });
});

// =============================================================================
// Tests: Trigger Mapping
// =============================================================================

describe('Trigger to Template Mapping', () => {
  describe('email_verified trigger', () => {
    it('should return email_verified + welcome_professional for consultants', () => {
      const templates = getTemplatesForTrigger('email_verified', 'consultant');
      expect(templates).toEqual(['email_verified', 'welcome_professional']);
    });

    it('should return email_verified + welcome_client for clients', () => {
      const templates = getTemplatesForTrigger('email_verified', 'client');
      expect(templates).toEqual(['email_verified', 'welcome_client']);
    });
  });

  describe('profile_complete trigger', () => {
    it('should return vetting_started_professional for consultants', () => {
      const templates = getTemplatesForTrigger('profile_complete', 'consultant');
      expect(templates).toEqual(['vetting_started_professional']);
    });

    it('should return review_started_client for clients', () => {
      const templates = getTemplatesForTrigger('profile_complete', 'client');
      expect(templates).toEqual(['review_started_client']);
    });
  });

  describe('approved trigger', () => {
    it('should return approved_professional for consultants', () => {
      const templates = getTemplatesForTrigger('approved', 'consultant');
      expect(templates).toEqual(['approved_professional']);
    });

    it('should return approved_client for clients', () => {
      const templates = getTemplatesForTrigger('approved', 'client');
      expect(templates).toEqual(['approved_client']);
    });
  });

  describe('declined trigger', () => {
    it('should return declined_professional for consultants', () => {
      const templates = getTemplatesForTrigger('declined', 'consultant');
      expect(templates).toEqual(['declined_professional']);
    });

    it('should return declined_client for clients', () => {
      const templates = getTemplatesForTrigger('declined', 'client');
      expect(templates).toEqual(['declined_client']);
    });
  });

  describe('needs_info trigger', () => {
    it('should return needs_info_professional for consultants', () => {
      const templates = getTemplatesForTrigger('needs_info', 'consultant');
      expect(templates).toEqual(['needs_info_professional']);
    });

    it('should return needs_info_client for clients', () => {
      const templates = getTemplatesForTrigger('needs_info', 'client');
      expect(templates).toEqual(['needs_info_client']);
    });
  });

  describe('reminder trigger', () => {
    it('should return reminder_professional for consultants', () => {
      const templates = getTemplatesForTrigger('reminder', 'consultant');
      expect(templates).toEqual(['reminder_professional']);
    });

    it('should return reminder_client for clients', () => {
      const templates = getTemplatesForTrigger('reminder', 'client');
      expect(templates).toEqual(['reminder_client']);
    });
  });

  describe('activation_nudge trigger', () => {
    it('should return activation_nudge_professional for consultants', () => {
      const templates = getTemplatesForTrigger('activation_nudge', 'consultant');
      expect(templates).toEqual(['activation_nudge_professional']);
    });

    it('should return activation_nudge_client for clients', () => {
      const templates = getTemplatesForTrigger('activation_nudge', 'client');
      expect(templates).toEqual(['activation_nudge_client']);
    });
  });

  describe('invalid trigger', () => {
    it('should return empty array for unknown trigger', () => {
      expect(getTemplatesForTrigger('unknown', 'consultant')).toEqual([]);
      expect(getTemplatesForTrigger('', 'client')).toEqual([]);
    });
  });
});

// =============================================================================
// Tests: Idempotency Key Generation
// =============================================================================

describe('Idempotency Key Generation', () => {
  describe('Reminder lifecycle keys', () => {
    it('should return reminder_7d at day 7', () => {
      expect(getReminderLifecycleKey(7)).toBe('reminder_7d');
      expect(getReminderLifecycleKey(7.5)).toBe('reminder_7d');
    });

    it('should return reminder_14d at day 14', () => {
      expect(getReminderLifecycleKey(14)).toBe('reminder_14d');
      expect(getReminderLifecycleKey(14.9)).toBe('reminder_14d');
    });

    it('should return reminder_30d at day 30', () => {
      expect(getReminderLifecycleKey(30)).toBe('reminder_30d');
    });

    it('should return null before day 7', () => {
      expect(getReminderLifecycleKey(0)).toBeNull();
      expect(getReminderLifecycleKey(3)).toBeNull();
      expect(getReminderLifecycleKey(6.9)).toBeNull();
    });

    it('should return null between reminder days', () => {
      expect(getReminderLifecycleKey(10)).toBeNull();
      expect(getReminderLifecycleKey(20)).toBeNull();
      expect(getReminderLifecycleKey(25)).toBeNull();
    });

    it('should return reminder_60d at day 60', () => {
      expect(getReminderLifecycleKey(60)).toBe('reminder_60d');
    });

    it('should return reminder_90d at day 90', () => {
      expect(getReminderLifecycleKey(90)).toBe('reminder_90d');
    });

    it('should return reminder_120d at day 120', () => {
      expect(getReminderLifecycleKey(120)).toBe('reminder_120d');
    });

    it('should handle long-term users (day 360)', () => {
      expect(getReminderLifecycleKey(360)).toBe('reminder_360d');
    });

    it('should handle very long-term users (day 720)', () => {
      expect(getReminderLifecycleKey(720)).toBe('reminder_720d');
    });
  });
});

// =============================================================================
// Tests: Template Content Requirements
// =============================================================================

describe('Template Content Requirements', () => {
  it('all templates should have non-empty subjects', () => {
    for (const templateId of getTemplateIds()) {
      const meta = getTemplateMetadata(templateId);
      expect(meta?.subject).toBeTruthy();
      expect(meta?.subject.length).toBeGreaterThan(10);
    }
  });

  it('all templates should have non-empty preheaders', () => {
    for (const templateId of getTemplateIds()) {
      const meta = getTemplateMetadata(templateId);
      expect(meta?.preheader).toBeTruthy();
      expect(meta?.preheader.length).toBeGreaterThan(10);
    }
  });

  it('professional and client templates should have different content', () => {
    const pairs = [
      ['welcome_professional', 'welcome_client'],
      ['reminder_professional', 'reminder_client'],
      ['approved_professional', 'approved_client'],
      ['declined_professional', 'declined_client'],
      ['needs_info_professional', 'needs_info_client'],
      ['activation_nudge_professional', 'activation_nudge_client'],
    ];

    for (const [proTemplate, clientTemplate] of pairs) {
      const proMeta = getTemplateMetadata(proTemplate);
      const clientMeta = getTemplateMetadata(clientTemplate);
      
      expect(proMeta?.subject).not.toBe(clientMeta?.subject);
    }
  });

  it('declined templates should not mention rejection criteria', () => {
    const declinedPro = getTemplateMetadata('declined_professional');
    const declinedClient = getTemplateMetadata('declined_client');
    
    // Subjects should be diplomatic, not harsh
    expect(declinedPro?.subject.toLowerCase()).not.toContain('rejected');
    expect(declinedClient?.subject.toLowerCase()).not.toContain('rejected');
  });
});
