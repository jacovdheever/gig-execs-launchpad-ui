/**
 * Production community re-engagement: send to all users with an email in `users`.
 * Same tracking as Netlify function (template community_reengagement + lifecycle key).
 *
 * Requires: node tools/run-community-reengagement-full-send.cjs --confirm
 *
 * Loads .env then .env.local. Uses ~550ms delay between Resend calls.
 * Safe to stop and re-run: skips users who already have a successful log row.
 *
 * Optional: --offset=N  resume from user batch offset (default 0)
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

const BATCH = 40;

function parseArg(name, def) {
  const m = process.argv.find((a) => a.startsWith(`${name}=`));
  if (!m) return def;
  const v = parseInt(m.split('=')[1], 10);
  return Number.isNaN(v) ? def : v;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!process.argv.includes('--confirm')) {
    console.error('Refusing to run without --confirm (sends real email to all users with email).');
    process.exit(1);
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY');
    process.exit(1);
  }
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  let offset = Math.max(0, parseArg('--offset', 0));

  const supabase = createClient(url, key);
  const {
    sendCommunityReengagementCampaignEmail,
    COMMUNITY_REENGAGEMENT_DELAY_MS,
    COMMUNITY_REENGAGEMENT_TEMPLATE_ID,
    COMMUNITY_REENGAGEMENT_LIFECYCLE_KEY
  } = require(path.join(root, 'netlify/functions/lib/email-sender.js'));

  const delayMs = COMMUNITY_REENGAGEMENT_DELAY_MS || 550;

  console.log('Campaign:', COMMUNITY_REENGAGEMENT_TEMPLATE_ID, 'lifecycle:', COMMUNITY_REENGAGEMENT_LIFECYCLE_KEY);
  console.log('Starting at offset', offset, 'batch size', BATCH, 'delay ms', delayMs);

  const totals = { processed: 0, sent: 0, skipped: 0, failed: 0 };

  for (;;) {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name')
      .not('email', 'is', null)
      .order('created_at', { ascending: true })
      .range(offset, offset + BATCH - 1);

    if (error) {
      console.error('Fetch error:', error.message);
      process.exit(1);
    }

    if (!users || users.length === 0) {
      console.log('Done. No more rows at offset', offset);
      break;
    }

    console.log(`Batch offset ${offset} … ${offset + users.length - 1} (${users.length} users)`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      totals.processed++;
      try {
        const r = await sendCommunityReengagementCampaignEmail(supabase, {
          userId: user.id,
          email: user.email,
          firstName: user.first_name,
          dryRun: false,
          skipIdempotency: false
        });
        if (r.skipped) totals.skipped++;
        else if (r.success) totals.sent++;
        else totals.failed++;
      } catch (e) {
        console.error('Error user', user.id, e.message);
        totals.failed++;
      }

      if (i < users.length - 1) {
        await sleep(delayMs);
      }
    }

    offset += users.length;
    if (users.length < BATCH) {
      break;
    }
    await sleep(delayMs);
  }

  console.log('Finished.', totals);
  process.exit(totals.failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
