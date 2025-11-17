#!/bin/bash

# Pre-Deployment Security Check Script
# Run this before deploying to production
# Usage: ./scripts/pre-deploy-security-check.sh

set -e  # Exit on error

echo "🔒 GigExecs Pre-Deployment Security Check"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to check for errors
check_error() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ FAILED: $1${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    else
        echo -e "${GREEN}✅ PASSED: $1${NC}"
        return 0
    fi
}

# Function to check for warnings
check_warning() {
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
        WARNINGS=$((WARNINGS + 1))
        return 1
    else
        echo -e "${GREEN}✅ PASSED: $1${NC}"
        return 0
    fi
}

echo "1️⃣  Checking for hardcoded secrets..."
echo "--------------------------------------"

# Check for service role keys in frontend code
if grep -r "SUPABASE_SERVICE_ROLE_KEY" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "//.*SUPABASE_SERVICE_ROLE_KEY" | grep -v "process.env" > /dev/null; then
    echo -e "${RED}❌ FAILED: Service role key found in frontend code${NC}"
    grep -r "SUPABASE_SERVICE_ROLE_KEY" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "//.*SUPABASE_SERVICE_ROLE_KEY" | grep -v "process.env" || true
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ PASSED: No service role keys in frontend code${NC}"
fi

# Check for Stripe secret keys
if grep -r "sk_live\|sk_test" src/ netlify/functions/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "//.*sk_" | grep -v "process.env" > /dev/null; then
    echo -e "${RED}❌ FAILED: Stripe secret keys found in code${NC}"
    grep -r "sk_live\|sk_test" src/ netlify/functions/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "//.*sk_" | grep -v "process.env" || true
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ PASSED: No Stripe secret keys in code${NC}"
fi

# Check for JWT tokens (long base64 strings)
if grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "//.*eyJ" > /dev/null; then
    echo -e "${RED}❌ FAILED: Hardcoded JWT tokens found${NC}"
    grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "//.*eyJ" || true
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ PASSED: No hardcoded JWT tokens${NC}"
fi

# Check for API keys in frontend (should use VITE_ prefix)
if grep -r "RESEND_API_KEY\|STRIPE_SECRET_KEY" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "VITE_" | grep -v "//.*RESEND\|//.*STRIPE" > /dev/null; then
    echo -e "${RED}❌ FAILED: Backend API keys found in frontend code${NC}"
    grep -r "RESEND_API_KEY\|STRIPE_SECRET_KEY" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "VITE_" | grep -v "//.*RESEND\|//.*STRIPE" || true
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ PASSED: No backend API keys in frontend${NC}"
fi

echo ""
echo "2️⃣  Checking for unsafe code patterns..."
echo "------------------------------------------"

# Check for dangerouslySetInnerHTML without sanitization
if grep -r "dangerouslySetInnerHTML" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "DOMPurify\|sanitize" > /dev/null; then
    echo -e "${RED}❌ FAILED: dangerouslySetInnerHTML used without sanitization${NC}"
    grep -r "dangerouslySetInnerHTML" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "DOMPurify\|sanitize" || true
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ PASSED: All dangerouslySetInnerHTML uses sanitization${NC}"
fi

# Check for eval() usage
if grep -r "eval(" src/ netlify/functions/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "//.*eval" > /dev/null; then
    echo -e "${RED}❌ FAILED: eval() found in code${NC}"
    grep -r "eval(" src/ netlify/functions/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "//.*eval" || true
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ PASSED: No eval() usage${NC}"
fi

# Check for wildcard CORS
if grep -r "Access-Control-Allow-Origin.*\*" netlify/functions/ --include="*.js" 2>/dev/null | grep -v "//.*\*" > /dev/null; then
    echo -e "${RED}❌ FAILED: Wildcard CORS found in Netlify Functions${NC}"
    grep -r "Access-Control-Allow-Origin.*\*" netlify/functions/ --include="*.js" 2>/dev/null | grep -v "//.*\*" || true
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ PASSED: No wildcard CORS${NC}"
fi

echo ""
echo "3️⃣  Checking TypeScript configuration..."
echo "------------------------------------------"

# Check TypeScript strict mode
if grep -q '"strict":\s*true' tsconfig.json tsconfig.app.json 2>/dev/null; then
    echo -e "${GREEN}✅ PASSED: TypeScript strict mode enabled${NC}"
else
    echo -e "${RED}❌ FAILED: TypeScript strict mode not enabled${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "4️⃣  Checking dependencies for vulnerabilities..."
echo "------------------------------------------------"

# Run npm audit
if npm audit --omit=dev --audit-level=moderate > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED: No moderate or high severity vulnerabilities${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: Dependencies have vulnerabilities${NC}"
    echo "Run 'npm audit --omit=dev' for details"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "5️⃣  Checking security headers in netlify.toml..."
echo "-------------------------------------------------"

# Check for CSP header
if grep -q "Content-Security-Policy" netlify.toml 2>/dev/null; then
    echo -e "${GREEN}✅ PASSED: Content-Security-Policy header configured${NC}"
else
    echo -e "${RED}❌ FAILED: Content-Security-Policy header missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check for HSTS header
if grep -q "Strict-Transport-Security" netlify.toml 2>/dev/null; then
    echo -e "${GREEN}✅ PASSED: HSTS header configured${NC}"
else
    echo -e "${RED}❌ FAILED: HSTS header missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check for X-Frame-Options
if grep -q "X-Frame-Options" netlify.toml 2>/dev/null; then
    echo -e "${GREEN}✅ PASSED: X-Frame-Options header configured${NC}"
else
    echo -e "${RED}❌ FAILED: X-Frame-Options header missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "6️⃣  Checking for environment variable usage..."
echo "----------------------------------------------"

# Check that VITE_ prefix is used correctly in frontend
if grep -r "import.meta.env\." src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -E "SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|RESEND_API_KEY" | grep -v "VITE_" > /dev/null; then
    echo -e "${RED}❌ FAILED: Backend secrets accessed without VITE_ prefix in frontend${NC}"
    grep -r "import.meta.env\." src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -E "SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|RESEND_API_KEY" | grep -v "VITE_" || true
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ PASSED: Frontend uses VITE_ prefix correctly${NC}"
fi

# Check that Netlify Functions use process.env (not VITE_)
if grep -r "VITE_SUPABASE_SERVICE_ROLE_KEY\|VITE_STRIPE_SECRET_KEY\|VITE_RESEND_API_KEY" netlify/functions/ --include="*.js" 2>/dev/null > /dev/null; then
    echo -e "${RED}❌ FAILED: Netlify Functions using VITE_ prefixed secrets${NC}"
    grep -r "VITE_SUPABASE_SERVICE_ROLE_KEY\|VITE_STRIPE_SECRET_KEY\|VITE_RESEND_API_KEY" netlify/functions/ --include="*.js" 2>/dev/null || true
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ PASSED: Netlify Functions use correct environment variable format${NC}"
fi

echo ""
echo "7️⃣  Checking for input validation..."
echo "-------------------------------------"

# Check Netlify Functions for input validation
FUNCTIONS_WITHOUT_VALIDATION=0
for func in netlify/functions/*.js; do
    if [ -f "$func" ]; then
        # Check if function handles POST/PUT requests
        if grep -q "POST\|PUT" "$func" 2>/dev/null; then
            # Check if it has validation (look for common patterns)
            if ! grep -q "validate\|zod\|joi\|yup\|required\|check" "$func" 2>/dev/null; then
                FUNCTIONS_WITHOUT_VALIDATION=$((FUNCTIONS_WITHOUT_VALIDATION + 1))
            fi
        fi
    fi
done

if [ $FUNCTIONS_WITHOUT_VALIDATION -gt 0 ]; then
    echo -e "${YELLOW}⚠️  WARNING: $FUNCTIONS_WITHOUT_VALIDATION function(s) may lack input validation${NC}"
    echo "Review functions that handle POST/PUT requests for proper validation"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ PASSED: Functions appear to have input validation${NC}"
fi

echo ""
echo "8️⃣  Checking for authentication in Netlify Functions..."
echo "-------------------------------------------------------"

# Check that functions verify JWT tokens
FUNCTIONS_WITHOUT_AUTH=0
for func in netlify/functions/*.js; do
    if [ -f "$func" ]; then
        # Skip public functions (like verify-captcha)
        if ! grep -q "verify-captcha\|public" "$func" 2>/dev/null; then
            # Check if it verifies auth
            if ! grep -q "auth\.uid()\|getUser\|verifyToken\|authenticate" "$func" 2>/dev/null; then
                FUNCTIONS_WITHOUT_AUTH=$((FUNCTIONS_WITHOUT_AUTH + 1))
            fi
        fi
    fi
done

if [ $FUNCTIONS_WITHOUT_AUTH -gt 0 ]; then
    echo -e "${YELLOW}⚠️  WARNING: $FUNCTIONS_WITHOUT_AUTH function(s) may lack authentication${NC}"
    echo "Review functions to ensure they verify user authentication"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ PASSED: Functions appear to verify authentication${NC}"
fi

echo ""
echo "=========================================="
echo "📊 Security Check Summary"
echo "=========================================="
echo -e "${GREEN}✅ Passed checks: Multiple${NC}"
echo -e "${RED}❌ Errors: $ERRORS${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}🚫 DEPLOYMENT BLOCKED: Fix errors before deploying${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  WARNINGS PRESENT: Review warnings before deploying${NC}"
    echo "You can proceed, but address warnings soon"
    exit 0
else
    echo -e "${GREEN}✅ ALL CHECKS PASSED: Safe to deploy${NC}"
    exit 0
fi

