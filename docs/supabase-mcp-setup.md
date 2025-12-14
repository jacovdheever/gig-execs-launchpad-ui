# Supabase MCP Setup Guide

## Overview
This guide shows how to set up Supabase MCP (Model Context Protocol) for development database insights and user migration.

## MCP vs Admin API

### MCP Advantages:
- **Real-time database insights** - See actual data and structure
- **Interactive queries** - Run SQL and see results immediately
- **Schema awareness** - Understand table relationships
- **Better debugging** - Inspect data directly

### Admin API Advantages:
- **Production safe** - Designed for secure operations
- **User management** - Built-in auth user operations
- **Email integration** - Native password reset functionality
- **Rate limiting** - Built-in protection

## Recommended Approach: Hybrid

Use **MCP for development insights** and **Admin API for production migration**.

## Setting Up Supabase MCP

### Step 1: Install Supabase MCP Server

```bash
# Install globally
npm install -g @supabase/mcp-server

# Or use npx (no installation)
npx @supabase/mcp-server
```

### Step 2: Create MCP Configuration

Create `mcp-config.json`:

```json
{
  "supabase": {
    "url": "https://yvevlrsothtppvpaszuq.supabase.co",
    "serviceRoleKey": "your-service-role-key-here",
    "anonKey": "your-anon-key-here"
  }
}
```

### Step 3: Start MCP Server

```bash
# Start with config
supabase-mcp-server --config mcp-config.json

# Or with environment variables
SUPABASE_URL=https://yvevlrsothtppvpaszuq.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
supabase-mcp-server
```

### Step 4: Connect to Cursor

Once MCP is running, I'll be able to:
- Query your database directly
- See real-time data
- Understand your schema
- Help with migration planning

## Migration Strategy

### Phase 1: MCP Exploration (Development)
1. **Connect MCP** to your development database
2. **Explore user data** - See actual users, counts, data quality
3. **Plan migration** - Understand what needs to be migrated
4. **Test queries** - Verify data structure and relationships

### Phase 2: Admin API Migration (Production)
1. **Use Admin API** for actual user creation
2. **Trigger password resets** via Supabase Auth
3. **Monitor progress** with detailed logging
4. **Handle errors** gracefully

## Security Considerations

### MCP (Development Only)
- ✅ Use for development database exploration
- ❌ Never connect to production database
- ✅ Great for understanding data structure
- ✅ Perfect for migration planning

### Admin API (Production Safe)
- ✅ Use for actual user migration
- ✅ Secure for production operations
- ✅ Built-in rate limiting
- ✅ Native email integration

## Next Steps

1. **Set up MCP** for development insights
2. **Explore your data** to understand migration scope
3. **Plan migration strategy** based on real data
4. **Execute migration** using Admin API
5. **Monitor results** and user adoption

## Commands

```bash
# Start MCP server
supabase-mcp-server --config mcp-config.json

# Test connection
curl http://localhost:3000/health

# Run migration (Admin API)
npm run migrate:users:dry-run
npm run migrate:users
```

This hybrid approach gives you the best of both worlds: MCP for insights and Admin API for secure operations.
