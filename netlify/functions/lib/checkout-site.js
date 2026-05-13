/**
 * Stripe Checkout / Billing Portal return URLs must match the site the user started from
 * (e.g. Netlify preview vs production). Prefer validated client origin over deploy env defaults.
 */

function defaultSiteUrl() {
  return (
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.SITE_URL ||
    'https://gigexecs.com'
  ).replace(/\/$/, '');
}

/**
 * @param {string | undefined | null} raw
 * @returns {string | null} origin without trailing slash, or null
 */
function normalizeAllowedPublicOrigin(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  try {
    const u = new URL(trimmed);
    const host = u.hostname.toLowerCase();
    const proto = u.protocol.toLowerCase();

    if (proto !== 'https:' && proto !== 'http:') return null;
    if (proto === 'http:' && host !== 'localhost' && host !== '127.0.0.1') return null;

    let outProto = proto;
    if (host === 'gigexecs.com' || host === 'www.gigexecs.com' || host.endsWith('.gigexecs.com')) {
      outProto = 'https:';
    } else if (host.endsWith('.netlify.app')) {
      outProto = 'https:';
    }

    return `${outProto}//${u.host}`;
  } catch {
    return null;
  }
}

/**
 * @param {object} event Netlify / Lambda HTTP event
 * @param {Record<string, unknown>} body parsed JSON body (may be empty)
 * @returns {string} base URL with no trailing slash
 */
function resolveCheckoutBaseUrl(event, body = {}) {
  const fromBody = normalizeAllowedPublicOrigin(
    typeof body.siteOrigin === 'string'
      ? body.siteOrigin
      : typeof body.site_origin === 'string'
        ? body.site_origin
        : null
  );
  if (fromBody) return fromBody.replace(/\/$/, '');

  const originHeader = event.headers.origin || event.headers.Origin;
  const fromHeader = normalizeAllowedPublicOrigin(originHeader);
  if (fromHeader) return fromHeader.replace(/\/$/, '');

  return defaultSiteUrl();
}

module.exports = {
  defaultSiteUrl,
  normalizeAllowedPublicOrigin,
  resolveCheckoutBaseUrl,
};
