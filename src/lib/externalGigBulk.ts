import * as XLSX from 'xlsx';

export const MAX_BULK_ROWS = 50;

export const PROJECT_STATUSES = [
  'draft',
  'open',
  'in_progress',
  'completed',
  'cancelled'
] as const;

export const TIMELINE_OPTIONS = [
  { value: '1-7-days', min: 1, max: 7 },
  { value: '1-2-weeks', min: 7, max: 14 },
  { value: '2-4-weeks', min: 14, max: 30 },
  { value: '1-2-months', min: 30, max: 60 },
  { value: '2-6-months', min: 60, max: 180 },
  { value: '6-12-months', min: 180, max: 365 },
  { value: '1-2-years', min: 365, max: 730 }
] as const;

export type TimelineValue = (typeof TIMELINE_OPTIONS)[number]['value'] | '';

export const BULK_TEMPLATE_COLUMNS = [
  'title',
  'description',
  'status',
  'external_url',
  'expires_at',
  'source_name',
  'budget_amount',
  'budget_to_be_confirmed',
  'timeline',
  'skills_required',
  'industries',
  'role_type',
  'gig_location'
] as const;

export type BulkTemplateColumn = (typeof BULK_TEMPLATE_COLUMNS)[number];

/** One row in the review grid (all strings for controlled inputs). */
export interface BulkGigRow {
  title: string;
  description: string;
  status: string;
  external_url: string;
  expires_at: string;
  source_name: string;
  budget_amount: string;
  budget_to_be_confirmed: string;
  timeline: string;
  skills_required: string;
  industries: string;
  role_type: string;
  gig_location: string;
}

export interface ExternalGigCreatePayload {
  title: string;
  description: string;
  status: string;
  external_url: string;
  expires_at: string | null;
  source_name: string | null;
  currency: string;
  budget_min: number | null;
  budget_max: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
  skills_required: number[];
  industries: number[];
  role_type: string | null;
  gig_location: string | null;
}

export function emptyBulkRow(): BulkGigRow {
  return {
    title: '',
    description: '',
    status: 'draft',
    external_url: '',
    expires_at: '',
    source_name: '',
    budget_amount: '',
    budget_to_be_confirmed: 'false',
    timeline: '',
    skills_required: '',
    industries: '',
    role_type: '',
    gig_location: ''
  };
}

function normalizeHeaderKey(key: string): string {
  return String(key)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return String(value).trim();
}

function normalizeExternalUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function mapTimelineToRange(value: string): { min: number | null; max: number | null } {
  if (!value.trim()) return { min: null, max: null };
  const option = TIMELINE_OPTIONS.find((item) => item.value === value.trim());
  if (!option) return { min: null, max: null };
  return { min: option.min, max: option.max };
}

export function parseIdList(raw: string): number[] {
  if (!raw.trim()) return [];
  const parts = raw.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  const nums = parts.map((p) => Number(p)).filter((n) => !Number.isNaN(n));
  return nums;
}

/** Stable comma-separated id string for row storage (matches spreadsheet convention). */
export function formatIdList(ids: number[]): string {
  return ids.join(',');
}

function parseBool(raw: string): boolean {
  const t = raw.trim().toLowerCase();
  return t === 'true' || t === '1' || t === 'yes';
}

export function rowToApiPayload(row: BulkGigRow): ExternalGigCreatePayload {
  const budgetTbc = parseBool(row.budget_to_be_confirmed);
  const budgetProvided = !budgetTbc && row.budget_amount.trim() !== '';
  const parsedBudget = budgetProvided ? Number(row.budget_amount) : null;
  const budgetValue =
    parsedBudget !== null && !Number.isNaN(parsedBudget) ? parsedBudget : null;

  let deliveryMin: number | null = null;
  let deliveryMax: number | null = null;
  if (row.timeline.trim()) {
    const r = mapTimelineToRange(row.timeline.trim());
    deliveryMin = r.min;
    deliveryMax = r.max;
  }

  const externalUrl = normalizeExternalUrl(row.external_url);

  let expiresAt: string | null = null;
  if (row.expires_at.trim()) {
    const d = new Date(row.expires_at.trim());
    if (!Number.isNaN(d.getTime())) {
      expiresAt = d.toISOString();
    }
  }

  const skills = parseIdList(row.skills_required);
  const industries = parseIdList(row.industries);

  const roleRaw = row.role_type.trim();
  const role_type = roleRaw === '' ? null : roleRaw;

  const locRaw = row.gig_location.trim();
  const gig_location = locRaw === '' ? null : locRaw;

  return {
    title: row.title.trim(),
    description: row.description,
    status: row.status.trim(),
    external_url: externalUrl,
    expires_at: expiresAt,
    source_name: row.source_name.trim() ? row.source_name.trim() : null,
    currency: 'USD',
    budget_min: budgetValue,
    budget_max: budgetValue,
    delivery_time_min: deliveryMin,
    delivery_time_max: deliveryMax,
    skills_required: skills,
    industries,
    role_type,
    gig_location
  };
}

export interface ValidateRowOptions {
  validSkillIds: Set<number>;
  validIndustryIds: Set<number>;
}

export function validateBulkPayload(
  p: ExternalGigCreatePayload,
  opts: ValidateRowOptions
): string[] {
  const errors: string[] = [];

  if (!p.title || p.title.length > 255) {
    errors.push('title must be a non-empty string up to 255 characters');
  }

  if (!p.description || typeof p.description !== 'string') {
    errors.push('description is required');
  } else if (p.description.length > 10000) {
    errors.push('description must be at most 10,000 characters');
  }

  if (!PROJECT_STATUSES.includes(p.status as (typeof PROJECT_STATUSES)[number])) {
    errors.push(`status must be one of: ${PROJECT_STATUSES.join(', ')}`);
  }

  if (!isValidHttpUrl(p.external_url)) {
    errors.push('external_url must be a valid HTTP or HTTPS URL');
  }

  if (p.expires_at !== null) {
    const t = Date.parse(p.expires_at);
    if (Number.isNaN(t)) {
      errors.push('expires_at must be a valid date if provided');
    }
  }

  if (p.source_name && p.source_name.length > 255) {
    errors.push('source_name must be at most 255 characters');
  }

  if (p.budget_min !== null && Number.isNaN(Number(p.budget_min))) {
    errors.push('budget must be numeric when provided');
  }

  if (p.skills_required.length > 15) {
    errors.push('at most 15 skills allowed');
  }
  for (const id of p.skills_required) {
    if (!opts.validSkillIds.has(id)) {
      errors.push(`unknown skill id: ${id}`);
    }
  }

  if (p.industries.length > 10) {
    errors.push('at most 10 industries allowed');
  }
  for (const id of p.industries) {
    if (!opts.validIndustryIds.has(id)) {
      errors.push(`unknown industry id: ${id}`);
    }
  }

  if (p.role_type !== null && p.role_type !== '') {
    const ok = ['in_person', 'hybrid', 'remote'].includes(p.role_type);
    if (!ok) {
      errors.push('role_type must be in_person, hybrid, remote, or empty');
    }
  }

  if (p.gig_location && p.gig_location.length > 255) {
    errors.push('gig_location must be at most 255 characters');
  }

  return errors;
}

export function validateBulkRow(row: BulkGigRow, opts: ValidateRowOptions): string[] {
  const tl = row.timeline.trim();
  const timelineErr =
    tl && !TIMELINE_OPTIONS.some((o) => o.value === tl)
      ? ['timeline must be one of the template presets or empty']
      : [];

  const payload = rowToApiPayload(row);
  return [...timelineErr, ...validateBulkPayload(payload, opts)];
}

function recordToBulkRow(rec: Record<string, unknown>): BulkGigRow {
  const out = emptyBulkRow();
  const norm: Record<string, string> = {};
  for (const [k, v] of Object.entries(rec)) {
    norm[normalizeHeaderKey(k)] = cellToString(v);
  }
  for (const col of BULK_TEMPLATE_COLUMNS) {
    if (norm[col] !== undefined) {
      (out as Record<string, string>)[col] = norm[col];
    }
  }
  return out;
}

function isRowBlank(row: BulkGigRow): boolean {
  return (
    !row.title.trim() &&
    !row.description.trim() &&
    !row.external_url.trim()
  );
}

/**
 * Parse .xlsx / .xls / .csv into bulk rows (blank rows skipped).
 */
export function parseBulkFile(buffer: ArrayBuffer, fileName: string): BulkGigRow[] {
  const wb = XLSX.read(buffer, { type: 'array', raw: false });
  const sheetName = wb.SheetNames.includes('gigs') ? 'gigs' : wb.SheetNames[0];
  if (!sheetName) return [];

  const sheet = wb.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false
  });

  const rows: BulkGigRow[] = [];
  for (const rec of json) {
    const r = recordToBulkRow(rec);
    if (!isRowBlank(r)) {
      rows.push(r);
    }
  }

  return rows;
}
