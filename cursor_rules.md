# 🧩 GigExecs Cursor Project Rules

## 🧠 General Development Principles
- Security-first and RLS-first design across all features.
- Stack: React + Vite + Tailwind + shadcn/ui, Supabase backend, Netlify Functions.
- Follow camelCase for JS objects, snake_case for DB fields.
- Never disable authentication or security features for testing.

## 🔐 Security & Secrets Management Rules
- ❌ Never expose service role keys, Stripe secrets, or Resend API keys to the frontend.
- ❌ Never prefix secret environment variables with VITE_.
- ❌ Never use dangerouslySetInnerHTML or innerHTML without sanitization.
- ❌ Never use wildcard CORS in production.
- ✅ Sensitive operations handled only on server (Netlify Functions or Supabase Edge).
- ✅ Environment separation: Frontend (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY), Backend (SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, RESEND_API_KEY).
- ✅ RLS for all tables; only bypass via service functions.
- ✅ Sanitize user-generated content with DOMPurify or safe markdown renderers.
- ✅ TypeScript strict mode enabled.
- ✅ Security headers (CSP, HSTS, Permissions-Policy) enforced.

## 🧩 Database & Supabase Rules
- Always check latest schema before migrations.
- Include created_at, updated_at, and deleted_at fields.
- RLS enabled immediately after table creation.
- auth.uid() for user-scoped access in RLS.
- Use Netlify functions with service role for privileged actions.
- Join tables plural (e.g., project_skills, user_languages).
- Supabase Storage with signed URLs and owner RLS.

## 🧱 Component & Architecture Rules
- Reuse logic like computeCompleteness.
- Maintain feature parity between mobile and desktop.
- Use dynamic data; no placeholders.
- React Query for server state; Zod for validation.
- Validate all forms and API inputs.

## 🔍 Debugging & Troubleshooting Rules
- **RLS FIRST**: When debugging "Object not found", "Permission denied", "Row-level security policy violation", or any access/retrieval errors, ALWAYS check RLS policies FIRST before making code changes.
- **Storage Access Issues**: For Supabase Storage errors (file uploads/downloads), verify RLS policies allow the operation for the current user context (uploader vs viewer vs project owner).
- **Database Query Failures**: If queries fail with permission errors, check RLS policies on the table before assuming code logic is wrong.
- **Systematic Debugging**: Check permissions → Check data exists → Check code logic, in that order.

## 📱 UX & Branding Rules
- Mobile-first design, consistent GigExecs color and typography.
- Terms: "Professional" not "Consultant"; "Project/Role" not "Gig".
- Profile tiers: Basic (core), Full (references, ID, qualifications), All-Star (portfolio).

## 🧩 Debugging & Logging Standards
- Structured console logs with emoji prefixes.
- Never log secrets or personal data.
- All staff/admin actions logged in audit_logs.

## 🛠️ Code Quality Standards
- TypeScript strict mode on.
- Error boundaries prevent crash loops.
- Regular npm audit and depcheck.
- Rate limit sensitive routes.
- Route protection by role.

## 🧩 Staff & Admin System Rules
- staff_users auth separate from public users.
- Roles: support < admin < super_user.
- All actions logged in audit_logs (immutable).
- Only super_user can manage staff accounts.
- Impersonation tokens expire after 15min, clearly indicated in UI.

## 📦 Deployment & Environment Rules
- Netlify build: npm run build or bun run build.
- Separate .env files for dev/prod; never commit secrets.
- Run secret scan before deploy.
- Verify: no hardcoded secrets, proper VITE_ usage, RLS active, CSP headers in netlify.toml.

## 🔎 Security Audit Checklist
- [ ] No exposed keys or secrets
- [ ] Sanitized HTML only
- [ ] CORS restricted
- [ ] Input validation on all endpoints
- [ ] JWT authentication enforced
- [ ] RLS verified
- [ ] Secure headers present
- [ ] Dependencies updated
- [ ] Rate limiting implemented
- [ ] Error boundaries active

## 🧠 Golden Development Rules
1. Inspect data before coding.
2. Reuse existing logic.
3. Maintain consistency.
4. Test with real data.
5. Never commit sensitive data.
6. Check RLS first on query errors.
7. Ask before disabling security.
8. Document new learnings in /docs/PROJECT_APPROACH.md.