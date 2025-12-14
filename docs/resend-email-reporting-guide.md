# Resend Email Reporting Guide

## 📊 Accessing Email Reports

Resend provides email delivery reports through their **Dashboard** and **Webhooks**. Unlike SendGrid, Resend doesn't have a direct API endpoint to list all emails, but you can access comprehensive reports through:

### **Option 1: Resend Dashboard (Recommended for Quick Reports)**

1. **Log in to Resend Dashboard**
   - Go to [resend.com](https://resend.com)
   - Log in with your account

2. **View Email Activity**
   - Navigate to **"Emails"** section in the dashboard
   - You'll see:
     - ✅ **Delivered** emails
     - ❌ **Bounced** emails (with bounce reasons)
     - ⚠️ **Failed** deliveries
     - 📧 **Opened** emails (if tracking enabled)
     - 🔗 **Clicked** links (if tracking enabled)

3. **View Suppression Lists**
   - Go to **"Suppressions"** section
   - View:
     - **Bounces** - Hard bounces (permanent failures)
     - **Complaints** - Spam reports
     - **Unsubscribes** - Users who unsubscribed

4. **Export Data**
   - You can export suppression lists as CSV
   - Filter by date range
   - Download for analysis

### **Option 2: Resend Webhooks (Real-time Tracking)**

For programmatic access to email events, set up **Resend Webhooks**:

1. **Create a Webhook Endpoint**
   - Create a Netlify Function to receive webhook events
   - Example: `netlify/functions/resend-webhook.js`

2. **Configure Webhook in Resend Dashboard**
   - Go to Resend Dashboard → **Webhooks**
   - Add webhook URL: `https://your-site.netlify.app/.netlify/functions/resend-webhook`
   - Select events to track:
     - `email.sent`
     - `email.delivered`
     - `email.delivery_delayed`
     - `email.complained`
     - `email.bounced`
     - `email.opened`
     - `email.clicked`

3. **Store Events in Database**
   - Save webhook events to a `email_events` table
   - Track bounces, unsubscribes, and failures
   - Generate reports from database

### **Option 3: Check Individual Email Status**

You can check the status of specific emails if you have their email IDs:

```javascript
const { data, error } = await resend.emails.get(emailId);
// Returns: status, last_event, created_at, etc.
```

## 📋 What Information is Available

### **From Dashboard:**
- ✅ Delivery status (delivered, bounced, failed)
- ✅ Bounce reasons (hard bounce, soft bounce, etc.)
- ✅ Spam complaints
- ✅ Unsubscribe requests
- ✅ Open rates (if tracking enabled)
- ✅ Click rates (if tracking enabled)
- ✅ Suppression lists (bounces, complaints, unsubscribes)

### **From Webhooks:**
- Real-time event notifications
- Detailed event data (timestamp, reason, etc.)
- Ability to update your database automatically

## 🚀 Quick Access

**Dashboard URL:** https://resend.com/emails

**For November Update Campaign:**
- Filter by date: November 26, 2025
- Filter by subject: "We've Been Building — Your New GigExecs Experience Is Live!"
- View all delivery statuses

## 💡 Recommendation

For your November update campaign:
1. **Check Dashboard** for immediate bounce/failure reports
2. **Set up Webhooks** for future campaigns to track events automatically
3. **Export suppression lists** to update your database

