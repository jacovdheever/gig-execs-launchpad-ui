/**
 * Regenerates docs/ and public/downloads/ bulk import XLSX from JSON lookups.
 * Run: npm run generate:external-gigs-template
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const GIG_HEADERS = [
  'title',
  'description',
  'status',
  'external_url',
  'expires_at',
  'source_name',
  'budget_amount',
  'budget_to_be_confirmed',
  'timeline',
  'delivery_time_min',
  'delivery_time_max',
  'skills_required',
  'industries',
  'role_type',
  'gig_location'
];

const REFERENCE_ROWS = [
  ['Field', 'Notes'],
  [
    'status',
    'draft | open | in_progress | completed | cancelled'
  ],
  [
    'timeline',
    '1-7-days | 1-2-weeks | 2-4-weeks | 1-2-months | 2-6-months | 6-12-months | 1-2-years'
  ],
  [
    'skills_required',
    'Comma-separated numeric IDs (see skills sheet). Max count enforced in UI.'
  ],
  [
    'industries',
    'Comma-separated numeric IDs (see industries sheet). Max count enforced in UI.'
  ],
  [
    'budget_to_be_confirmed',
    'true or false'
  ],
  [
    'expires_at',
    'ISO date or Excel date'
  ]
];

function loadJson(rel) {
  const p = path.join(root, rel);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function buildWorkbook() {
  const skills = loadJson('docs/data/external-gigs-skills.json');
  const industries = loadJson('docs/data/external-gigs-industries.json');

  const wb = XLSX.utils.book_new();

  const gigsSheet = XLSX.utils.aoa_to_sheet([GIG_HEADERS]);
  XLSX.utils.book_append_sheet(wb, gigsSheet, 'gigs');

  const refSheet = XLSX.utils.aoa_to_sheet(REFERENCE_ROWS);
  XLSX.utils.book_append_sheet(wb, refSheet, 'Reference');

  const skillRows = [['id', 'name'], ...skills.map((s) => [s.id, s.name])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(skillRows), 'skills');

  const indRows = [['id', 'name'], ...industries.map((i) => [i.id, i.name])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(indRows), 'industries');

  return wb;
}

const outDocs = path.join(root, 'docs/external-gigs-bulk-import-template.xlsx');
const outPublic = path.join(
  root,
  'public/downloads/external-gigs-bulk-import-template.xlsx'
);

const wb = buildWorkbook();
const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
fs.mkdirSync(path.dirname(outPublic), { recursive: true });
fs.writeFileSync(outDocs, buf);
fs.writeFileSync(outPublic, buf);
console.log('Wrote', outDocs);
console.log('Wrote', outPublic);
