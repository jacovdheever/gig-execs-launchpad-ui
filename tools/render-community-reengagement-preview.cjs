/**
 * Writes a browser-openable HTML preview for the community re-engagement email.
 *
 * Usage (from repo root):
 *   npm run email:preview:community-reengagement
 *
 * Open: public/email-previews/community-re-engagement.html
 * (e.g. file:// or serve the site and visit /email-previews/community-re-engagement.html)
 *
 * For Resend: subject + preheader are logged below; use buildCommunityReengagementEmail()
 * from netlify/functions/lib/email-templates.js with per-recipient variables, then
 * send via netlify/functions/lib/email-sender.js sendEmail({ to, subject, html, text }).
 */

const fs = require('fs');
const path = require('path');
const {
  buildCommunityReengagementEmail,
  COMMUNITY_REENGAGEMENT_SUBJECT,
  COMMUNITY_REENGAGEMENT_PREHEADER
} = require('../netlify/functions/lib/email-templates.js');

const SITE = process.env.SITE_URL || 'https://gigexecs.com';

const { html, text, subject, preheader } = buildCommunityReengagementEmail({
  first_name: 'Jordan',
  login_url: `${SITE}/auth`,
  browse_gigs_url: `${SITE}/find-gigs`
});

const outDir = path.join(__dirname, '..', 'public', 'email-previews');
const outFile = path.join(outDir, 'community-re-engagement.html');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, html, 'utf8');

const textPreview = path.join(outDir, 'community-re-engagement.txt');
fs.writeFileSync(textPreview, text, 'utf8');

// eslint-disable-next-line no-console
console.log('Wrote', outFile);
// eslint-disable-next-line no-console
console.log('Wrote', textPreview);
// eslint-disable-next-line no-console
console.log('\nResend metadata (match transactional pattern):');
// eslint-disable-next-line no-console
console.log('  subject:', subject || COMMUNITY_REENGAGEMENT_SUBJECT);
// eslint-disable-next-line no-console
console.log('  preview / preheader:', preheader || COMMUNITY_REENGAGEMENT_PREHEADER);
// eslint-disable-next-line no-console
console.log('\nMerge placeholders for broadcasts (substitute before send or use Resend variables):');
// eslint-disable-next-line no-console
console.log('  {{first_name}}  {{login_url}}  optional: {{browse_gigs_url}}');
