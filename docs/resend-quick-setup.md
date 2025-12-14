# Resend Quick Setup Guide

## 🚀 **Step 1: Create Resend Account**

1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

## 🔑 **Step 2: Get Your API Key**

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it "GigExecs Broadcast"
4. Copy the API key (starts with `re_`)

## 📧 **Step 3: Verify Your Domain (Optional but Recommended)**

1. Go to [resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter `gigexecs.com`
4. Add the required DNS records to your domain
5. Wait for verification (usually takes a few minutes)

## ⚙️ **Step 4: Add Environment Variables**

Add these to your `.env` file:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM="GigExecs <no-reply@gigexecs.com>"
```

## 🧪 **Step 5: Test the Setup**

```bash
# Test Resend connection
node scripts/test-resend-setup.js

# Preview the email
node scripts/preview-email.js
# Then open email-preview.html in your browser
```

## 📤 **Step 6: Send Broadcast Email**

```bash
# Dry run with 5 users (recommended first)
node scripts/send-broadcast-email.js --dry-run --limit 5

# Send to all users
node scripts/send-broadcast-email.js
```

## 📊 **Email Features**

✅ **Professional Design**: Clean, modern layout with GigExecs branding  
✅ **Mobile Responsive**: Looks great on all devices  
✅ **Personalized**: Uses actual user data from your database  
✅ **Action Required**: Clear call-to-action about password reset  
✅ **Nuno's Signature**: Professional signature with contact details  
✅ **Branded Footer**: Consistent with your brand identity  

## 🎯 **Email Content**

- **Subject**: "🎉 GigExecs is Back - Better Than Ever!"
- **Personalized greeting** to each user
- **Community-focused message** about the rebuild
- **Clear action required** for password reset
- **Professional signature** from Nuno G. Rodrigues
- **Branded footer** with contact information

## 📈 **Expected Results**

- **High deliverability** through Resend's infrastructure
- **Professional appearance** that builds trust
- **Clear communication** about next steps
- **Brand consistency** across all touchpoints
- **Mobile-friendly** experience for all users

## 🚨 **Important Notes**

1. **Test First**: Always run with `--dry-run` and `--limit 5` first
2. **Rate Limits**: Resend has rate limits, so the script processes in batches
3. **Domain Verification**: Verify your domain for better deliverability
4. **Monitor Results**: Check the generated report files for delivery status
5. **Backup Option**: CSV export is available if needed

## 🎉 **Ready to Send!**

Once you've completed the setup, you'll be able to send professional broadcast emails to all your users, informing them about the new platform and the password reset process.

The email template is already created and ready to use! 🚀





