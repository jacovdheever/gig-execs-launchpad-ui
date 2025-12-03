# Resend Broadcast Email Setup Guide

## 🚀 **Option 1: Direct Resend Integration (Recommended)**

### Step 1: Set up Resend Account
1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain (gigexecs.com) or use their sandbox domain for testing
3. Get your API key from the dashboard

### Step 2: Add Environment Variables
Add these to your `.env` file:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM="GigExecs <no-reply@gigexecs.com>"
```

### Step 3: Test the Setup
```bash
cd scripts
node test-resend-setup.js
```

### Step 4: Send Broadcast Email

#### Dry Run (Test with 5 users):
```bash
node send-broadcast-email.js --dry-run --limit 5
```

#### Send to All Users:
```bash
node send-broadcast-email.js
```

#### Send to Limited Users (e.g., 50):
```bash
node send-broadcast-email.js --limit 50
```

---

## 📊 **Option 2: Export CSV and Use Resend Web Portal**

### Step 1: Export User Data
```bash
node export-users-for-resend.js
```

### Step 2: Upload to Resend
1. Go to Resend dashboard
2. Create a new campaign
3. Upload the CSV file
4. Design your email template
5. Send the broadcast

---

## 📧 **Email Template Features**

The broadcast email includes:
- **Professional HTML design** with GigExecs branding
- **Personalized greeting** with user's first name
- **Clear action required** message about password reset
- **Feature highlights** of the new platform
- **Step-by-step instructions** for users
- **Mobile-responsive design**
- **Plain text version** for better deliverability

## 🔧 **Script Features**

- **Batch processing** to respect rate limits
- **Error handling** with detailed reporting
- **Dry run mode** for testing
- **User limit** for controlled rollouts
- **Delivery tracking** and success rates
- **Detailed reports** saved as JSON files

## 📈 **Expected Results**

- **Professional appearance** with branded email design
- **High deliverability** through Resend's infrastructure
- **Detailed analytics** on email performance
- **Error tracking** for failed deliveries
- **Scalable solution** for future broadcasts

## 🚨 **Important Notes**

1. **Rate Limits**: Resend has rate limits, so the script processes emails in batches
2. **Domain Verification**: You need to verify your domain for production use
3. **Testing**: Always test with `--dry-run` first
4. **Monitoring**: Check the generated report files for delivery status
5. **Compliance**: Ensure you comply with email marketing regulations

## 🎯 **Next Steps After Setup**

1. Set up Resend account and get API key
2. Add environment variables to `.env`
3. Test with dry run on 5 users
4. Send to a small batch (50 users) first
5. Monitor results and then send to all users
6. Prepare for password reset email migration

---

## 💡 **Why Use Resend Integration vs CSV Export?**

### Resend Integration (Recommended):
✅ **Real-time sending** with immediate delivery  
✅ **Detailed analytics** and delivery tracking  
✅ **Error handling** and retry logic  
✅ **Rate limiting** to prevent API issues  
✅ **Personalized emails** with user data  
✅ **Automated reporting** and monitoring  
✅ **Scalable** for future campaigns  

### CSV Export:
❌ **Manual process** requiring web portal  
❌ **Limited personalization** options  
❌ **No real-time tracking** of delivery  
❌ **Manual error handling** required  
❌ **Time-consuming** for large lists  
❌ **No automated reporting**  

The Resend integration provides a much more professional and efficient solution for your broadcast email needs.





