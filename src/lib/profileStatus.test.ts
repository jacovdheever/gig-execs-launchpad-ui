/**
 * Unit tests for Profile Status computation
 */

import { describe, it, expect } from 'vitest';
import {
  computeProfessionalProfileStatus,
  checkBasicFieldsComplete,
  checkFullProfileComplete,
  shouldAutoSubmitForVetting,
  getProgressSteps,
  getCtaRoute,
  type UserData,
  type ConsultantProfile,
  type RelatedCounts,
} from './profileStatus';

// =============================================================================
// Test Data Factories
// =============================================================================

const createUserData = (overrides: Partial<UserData> = {}): UserData => ({
  id: 'test-user-id',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  vetting_status: null,
  ...overrides,
});

const createProfile = (overrides: Partial<ConsultantProfile> = {}): ConsultantProfile => ({
  user_id: 'test-user-id',
  job_title: 'Senior Consultant',
  bio: 'Experienced professional',
  address1: '123 Main St',
  country: 'United States',
  country_id: 1,
  hourly_rate_min: 100,
  hourly_rate_max: 200,
  id_doc_url: null,
  ...overrides,
});

const createCounts = (overrides: Partial<RelatedCounts> = {}): RelatedCounts => ({
  workExperienceCount: 1,
  skillsCount: 3,
  languagesCount: 1,
  industriesCount: 2,
  referencesCount: 0,
  educationCount: 0,
  certificationsCount: 0,
  ...overrides,
});

// =============================================================================
// Tests: computeProfessionalProfileStatus
// =============================================================================

describe('computeProfessionalProfileStatus', () => {
  describe('Status #1: Registered', () => {
    it('should return registered when user has no profile data', () => {
      const user = createUserData({ first_name: null, last_name: null });
      const profile = null;
      const counts = createCounts({ workExperienceCount: 0, skillsCount: 0, languagesCount: 0, industriesCount: 0 });

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('registered');
      expect(result.completedSteps).toBe(1);
      expect(result.ctaText).toBe('Complete your profile');
      expect(result.ctaDisabled).toBe(false);
    });

    it('should return registered when profile fields are incomplete', () => {
      const user = createUserData();
      const profile = createProfile({ job_title: null, address1: null });
      const counts = createCounts({ workExperienceCount: 0 });

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('registered');
      expect(result.missingRequirements).toContain('Job title');
    });

    it('should list missing requirements', () => {
      const user = createUserData({ first_name: null });
      const profile = createProfile({ job_title: null });
      const counts = createCounts({ skillsCount: 0 });

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.missingRequirements).toContain('First name');
      expect(result.missingRequirements).toContain('Job title');
      expect(result.missingRequirements).toContain('At least 1 skill');
    });
  });

  describe('Status #2: Basic Profile Complete', () => {
    it('should return basic_complete when all basic fields are filled', () => {
      const user = createUserData();
      const profile = createProfile();
      const counts = createCounts();

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('basic_complete');
      expect(result.completedSteps).toBe(2);
      expect(result.ctaText).toBe('Finish full profile');
      expect(result.ctaDisabled).toBe(false);
    });

    it('should work with country_id instead of country text', () => {
      const user = createUserData();
      const profile = createProfile({ country: null, country_id: 1 });
      const counts = createCounts();

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('basic_complete');
    });

    it('should list missing full profile requirements', () => {
      const user = createUserData();
      const profile = createProfile({ id_doc_url: null });
      const counts = createCounts({ referencesCount: 0 });

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('basic_complete');
      expect(result.missingRequirements).toContain('2 more references');
      expect(result.missingRequirements).toContain('ID document');
    });
  });

  describe('Status #3: Pending Vetting', () => {
    it('should return pending_vetting when full profile complete and vetting_status is pending', () => {
      const user = createUserData({ vetting_status: 'pending' });
      const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
      const counts = createCounts({ referencesCount: 2, educationCount: 1 });

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('pending_vetting');
      expect(result.completedSteps).toBe(3);
      expect(result.ctaText).toBe('Vetting in progress');
      expect(result.ctaDisabled).toBe(true);
    });

    it('should return pending_vetting when vetting_status is in_progress', () => {
      const user = createUserData({ vetting_status: 'in_progress' });
      const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
      const counts = createCounts({ referencesCount: 2, certificationsCount: 1 });

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('pending_vetting');
    });

    it('should accept certifications instead of education', () => {
      const user = createUserData({ vetting_status: 'pending' });
      const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
      const counts = createCounts({ referencesCount: 2, educationCount: 0, certificationsCount: 1 });

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('pending_vetting');
    });
  });

  describe('Status #4A: Vetted Approved', () => {
    it('should return vetted_approved when vetting_status is verified', () => {
      const user = createUserData({ vetting_status: 'verified' });
      const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
      const counts = createCounts({ referencesCount: 2, educationCount: 1 });

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('vetted_approved');
      expect(result.completedSteps).toBe(4);
      expect(result.ctaText).toBe('Find gigs');
      expect(result.ctaDisabled).toBe(false);
      expect(result.badgeColor).toBe('green');
    });

    it('should return vetted_approved when vetting_status is vetted (legacy)', () => {
      const user = createUserData({ vetting_status: 'vetted' });
      const profile = createProfile();
      const counts = createCounts();

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('vetted_approved');
    });
  });

  describe('Status #4B: Vetted Declined', () => {
    it('should return vetted_declined when vetting_status is rejected', () => {
      const user = createUserData({ vetting_status: 'rejected' });
      const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
      const counts = createCounts({ referencesCount: 2, educationCount: 1 });

      const result = computeProfessionalProfileStatus(user, profile, counts);

      expect(result.statusKey).toBe('vetted_declined');
      expect(result.completedSteps).toBe(3);
      expect(result.ctaText).toBe('Review profile');
      expect(result.ctaDisabled).toBe(false);
      expect(result.badgeColor).toBe('red');
    });
  });

  describe('Edge cases', () => {
    it('should handle null user', () => {
      const result = computeProfessionalProfileStatus(null, null, createCounts());

      expect(result.statusKey).toBe('registered');
      expect(result.missingRequirements).toContain('User data not loaded');
    });

    it('should handle null profile', () => {
      const user = createUserData();
      const result = computeProfessionalProfileStatus(user, null, createCounts());

      expect(result.statusKey).toBe('registered');
    });
  });
});

// =============================================================================
// Tests: checkBasicFieldsComplete
// =============================================================================

describe('checkBasicFieldsComplete', () => {
  it('should return complete when all fields are filled', () => {
    const user = createUserData();
    const profile = createProfile();
    const counts = createCounts();

    const result = checkBasicFieldsComplete(user, profile, counts);

    expect(result.complete).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('should list all missing fields', () => {
    const user = createUserData({ first_name: null, last_name: null });
    const profile = createProfile({ 
      job_title: null, 
      address1: null, 
      country: null, 
      country_id: null,
      hourly_rate_min: null,
      hourly_rate_max: null 
    });
    const counts = createCounts({
      workExperienceCount: 0,
      skillsCount: 0,
      languagesCount: 0,
      industriesCount: 0,
    });

    const result = checkBasicFieldsComplete(user, profile, counts);

    expect(result.complete).toBe(false);
    expect(result.missing).toContain('First name');
    expect(result.missing).toContain('Last name');
    expect(result.missing).toContain('Job title');
    expect(result.missing).toContain('Address');
    expect(result.missing).toContain('Country');
    expect(result.missing).toContain('Minimum hourly rate');
    expect(result.missing).toContain('Maximum hourly rate');
    expect(result.missing).toContain('At least 1 work experience');
    expect(result.missing).toContain('At least 1 skill');
    expect(result.missing).toContain('At least 1 language');
    expect(result.missing).toContain('At least 1 industry');
  });
});

// =============================================================================
// Tests: checkFullProfileComplete
// =============================================================================

describe('checkFullProfileComplete', () => {
  it('should return complete when all full profile fields are filled', () => {
    const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
    const counts = createCounts({ referencesCount: 2, educationCount: 1 });

    const result = checkFullProfileComplete(profile, counts, true);

    expect(result.complete).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('should require basic complete first', () => {
    const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
    const counts = createCounts({ referencesCount: 2, educationCount: 1 });

    const result = checkFullProfileComplete(profile, counts, false);

    expect(result.complete).toBe(false);
    expect(result.missing).toContain('Complete basic profile first');
  });

  it('should require 2 references', () => {
    const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
    const counts = createCounts({ referencesCount: 1, educationCount: 1 });

    const result = checkFullProfileComplete(profile, counts, true);

    expect(result.complete).toBe(false);
    expect(result.missing).toContain('1 more reference');
  });

  it('should not require education or certification (optional)', () => {
    const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
    
    // With education
    const result1 = checkFullProfileComplete(profile, createCounts({ referencesCount: 2, educationCount: 1, certificationsCount: 0 }), true);
    expect(result1.complete).toBe(true);

    // With certification
    const result2 = checkFullProfileComplete(profile, createCounts({ referencesCount: 2, educationCount: 0, certificationsCount: 1 }), true);
    expect(result2.complete).toBe(true);

    // Neither - should still be complete (education/certification is optional)
    const result3 = checkFullProfileComplete(profile, createCounts({ referencesCount: 2, educationCount: 0, certificationsCount: 0 }), true);
    expect(result3.complete).toBe(true);
  });
});

// =============================================================================
// Tests: shouldAutoSubmitForVetting
// =============================================================================

describe('shouldAutoSubmitForVetting', () => {
  it('should return true when profile is complete and not yet submitted', () => {
    const user = createUserData({ vetting_status: null });
    const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
    const counts = createCounts({ referencesCount: 2, educationCount: 1 });

    const result = shouldAutoSubmitForVetting(user, profile, counts);

    expect(result).toBe(true);
  });

  it('should return false when already pending', () => {
    const user = createUserData({ vetting_status: 'pending' });
    const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
    const counts = createCounts({ referencesCount: 2, educationCount: 1 });

    const result = shouldAutoSubmitForVetting(user, profile, counts);

    expect(result).toBe(false);
  });

  it('should return false when already verified', () => {
    const user = createUserData({ vetting_status: 'verified' });
    const profile = createProfile({ id_doc_url: 'https://example.com/id.pdf' });
    const counts = createCounts({ referencesCount: 2, educationCount: 1 });

    const result = shouldAutoSubmitForVetting(user, profile, counts);

    expect(result).toBe(false);
  });

  it('should return false when profile is incomplete', () => {
    const user = createUserData({ vetting_status: null });
    const profile = createProfile({ id_doc_url: null });
    const counts = createCounts({ referencesCount: 1 });

    const result = shouldAutoSubmitForVetting(user, profile, counts);

    expect(result).toBe(false);
  });
});

// =============================================================================
// Tests: Utility Functions
// =============================================================================

describe('getProgressSteps', () => {
  it('should return the 4 progress step labels', () => {
    const steps = getProgressSteps();

    expect(steps).toEqual(['Registered', 'Basic', 'Full', 'Vetted']);
  });
});

describe('getCtaRoute', () => {
  it('should return correct routes for each status', () => {
    const registeredStatus = computeProfessionalProfileStatus(
      createUserData({ first_name: null }),
      null,
      createCounts()
    );
    expect(getCtaRoute(registeredStatus)).toBe('/onboarding/step1');

    const basicStatus = computeProfessionalProfileStatus(
      createUserData(),
      createProfile(),
      createCounts()
    );
    expect(getCtaRoute(basicStatus)).toBe('/profile');

    const vettedStatus = computeProfessionalProfileStatus(
      createUserData({ vetting_status: 'verified' }),
      createProfile(),
      createCounts()
    );
    expect(getCtaRoute(vettedStatus)).toBe('/find-gigs');
  });
});
