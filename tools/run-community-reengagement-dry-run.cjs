/**
 * One-off / local dry run: send community re-engagement test email via Resend + Supabase.
 * Loads .env then .env.local (local overrides). Does not go through Netlify auth.
 *
 * Usage: node tools/run-community-reengagement-dry-run.cjs
 *         node tools/run-community-reengagement-dry-run.cjs --force   (ignore prior dry_run sent log)
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvFile(filePath, { override = false } = {}) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    for (const line of txt.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!key) continue;
      if (override || process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch {
    // missing file is OK
  }
}

const root = path.join(__dirname, '..');
loadEnvFile(path.join(root, '.env'), { override: false });
loadEnvFile(path.join(root, '.env.local'), { override: true });

const TEST_EMAIL_DEFAULT = 'jaco.vandenheever@gigexecs.com';

async function main() {
  const force = process.argv.includes('--force');

  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY (check .env.local)');
    process.exit(1);
  }
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const { sendCommunityReengagementCampaignEmail } = require(path.join(
    root,
    'netlify/functions/lib/email-sender.js'
  ));

  const testEmail = (
    process.env.COMMUNITY_REENGAGEMENT_TEST_EMAIL || TEST_EMAIL_DEFAULT
  )
    .trim()
    .toLowerCase();

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, first_name')
    .ilike('email', testEmail)
    .maybeSingle();

  if (error) {
    console.error('Supabase lookup error:', error.message);
    process.exit(1);
  }
  if (!user?.email) {
    console.error('No user found for email:', testEmail);
    process.exit(1);
  }

  console.log('Sending dry run to', user.email, 'first_name:', user.first_name || '(empty)');

  const result = await sendCommunityReengagementCampaignEmail(supabase, {
    userId: user.id,
    email: user.email,
    firstName: user.first_name,
    dryRun: true,
    skipIdempotency: force
  });

  console.log(JSON.stringify(result, null, 2));
  if (result.skipped) {
    console.log('Skipped (already sent). Re-run with --force to send again.');
  }
  process.exit(result.success || result.skipped ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
