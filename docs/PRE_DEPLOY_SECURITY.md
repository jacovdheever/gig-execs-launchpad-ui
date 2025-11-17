# Pre-Deployment Security Check Guide

This document outlines the security checks that should be performed before deploying to production.

## Quick Start

Run the comprehensive security check script:

```bash
npm run security:check
```

Or run the script directly:

```bash
./scripts/pre-deploy-security-check.sh
```

## What Gets Checked

### 1. Hardcoded Secrets
- ✅ No service role keys in frontend code
- ✅ No Stripe secret keys in codebase
- ✅ No hardcoded JWT tokens
- ✅ Backend API keys not exposed to frontend
- ✅ Proper use of `VITE_` prefix for frontend environment variables

### 2. Unsafe Code Patterns
- ✅ No `dangerouslySetInnerHTML` without sanitization (DOMPurify)
- ✅ No `eval()` usage
- ✅ No wildcard CORS (`Access-Control-Allow-Origin: *`)

### 3. TypeScript Configuration
- ✅ Strict mode enabled

### 4. Dependency Vulnerabilities
- ✅ No moderate or high severity vulnerabilities in production dependencies

### 5. Security Headers
- ✅ Content-Security-Policy configured
- ✅ HTTP Strict Transport Security (HSTS) configured
- ✅ X-Frame-Options configured

### 6. Environment Variable Usage
- ✅ Frontend uses `VITE_` prefix correctly
- ✅ Netlify Functions use `process.env` (not `VITE_`)

### 7. Input Validation
- ✅ Netlify Functions validate user input

### 8. Authentication
- ✅ Netlify Functions verify JWT tokens

## Manual Security Checklist

Before deploying, manually verify:

### Database & RLS
- [ ] All tables have RLS policies enabled
- [ ] RLS policies are tested and working correctly
- [ ] Storage buckets have proper RLS policies
- [ ] No service role key used in frontend code

### Secrets Management
- [ ] No secrets committed to git
- [ ] All secrets stored in Netlify environment variables
- [ ] `.env` files in `.gitignore`
- [ ] No secrets in console logs

### Code Security
- [ ] All user input sanitized
- [ ] HTML content sanitized with DOMPurify
- [ ] SQL injection prevented (using parameterized queries)
- [ ] XSS protection in place
- [ ] CSRF protection for state-changing operations

### API Security
- [ ] All API endpoints require authentication
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive information

### Frontend Security
- [ ] No sensitive data in client-side code
- [ ] API keys properly scoped (frontend vs backend)
- [ ] Error boundaries prevent information disclosure
- [ ] Secure headers configured in `netlify.toml`

## Security Tools

### Automated Checks

1. **Secret Scanning**
   ```bash
   # Check for hardcoded secrets
   grep -r "sk_|pk_|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9|service_role" src/
   ```

2. **Dependency Scanning**
   ```bash
   npm audit --omit=dev
   npm audit fix --omit=dev  # Auto-fix where possible
   ```

3. **Code Pattern Scanning**
   ```bash
   # Check for unsafe patterns
   grep -r "dangerouslySetInnerHTML|eval(|new Function" src/
   grep -r "Access-Control-Allow-Origin.*\*" netlify/functions/
   ```

### Manual Review

Before deploying, review:

1. **Recent Changes**
   - Review all commits since last deployment
   - Check for any security-related changes
   - Verify RLS policies if database changes were made

2. **Environment Variables**
   - Verify all required environment variables are set in Netlify
   - Check that no secrets are exposed in build logs
   - Confirm production vs development environment separation

3. **Third-Party Dependencies**
   - Review any new dependencies added
   - Check for known vulnerabilities
   - Verify licenses are acceptable

## Deployment Process

### Pre-Deployment Steps

1. **Run Security Check**
   ```bash
   npm run security:check
   ```

2. **Fix Any Errors**
   - Errors block deployment
   - Warnings should be reviewed but don't block

3. **Manual Review**
   - Review the security checklist above
   - Test critical user flows
   - Verify RLS policies work correctly

4. **Deploy to Staging First**
   - Test on staging environment
   - Verify all features work
   - Check for console errors

5. **Deploy to Production**
   - Only after staging is verified
   - Monitor for errors after deployment
   - Have rollback plan ready

### Post-Deployment Verification

After deploying, verify:

- [ ] Application loads correctly
- [ ] Authentication works
- [ ] No console errors
- [ ] Security headers present (check with browser dev tools)
- [ ] RLS policies working (test with different user roles)
- [ ] File uploads/downloads work correctly

## Common Security Issues

### Issue: Service Role Key in Frontend
**Symptom**: `SUPABASE_SERVICE_ROLE_KEY` found in `src/` directory  
**Fix**: Move to Netlify Function, use `VITE_SUPABASE_ANON_KEY` in frontend

### Issue: Missing Input Validation
**Symptom**: Functions accept user input without validation  
**Fix**: Add validation using Zod or similar library

### Issue: Wildcard CORS
**Symptom**: `Access-Control-Allow-Origin: *` in function response  
**Fix**: Restrict to specific domains

### Issue: Unsanitized HTML
**Symptom**: `dangerouslySetInnerHTML` without DOMPurify  
**Fix**: Use `DOMPurify.sanitize()` before rendering

### Issue: RLS Policy Missing
**Symptom**: Users can access data they shouldn't  
**Fix**: Add/update RLS policies in Supabase

## Security Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Netlify Security Headers](https://docs.netlify.com/routing/headers/)

## Emergency Response

If a security issue is discovered after deployment:

1. **Immediately**: Assess the severity
2. **If Critical**: Take the application offline
3. **Fix**: Address the security issue
4. **Verify**: Run security checks again
5. **Deploy**: Push the fix
6. **Monitor**: Watch for any suspicious activity
7. **Document**: Record the incident and resolution

## Questions?

If you're unsure about a security check or finding, consult:
- The security checklist in `cursor_rules.md`
- Previous security reports in `SECURITY_REPORT.md`
- Supabase documentation for RLS and storage policies

