# SendGrid Email Service Setup Guide

## What is SendGrid?

SendGrid is a cloud-based email delivery service that allows your application to send transactional emails like:
- Order confirmations
- Welcome emails
- Password reset emails
- Contact form notifications

**Free Tier:** 100 emails/day (perfect for demos and small projects)

---

## Step 1: Create SendGrid Account

1. Go to: https://signup.sendgrid.com/
2. Fill in your details:
   - Email address
   - Password
   - First & Last name
3. Click "Create Account"
4. Verify your email address

---

## Step 2: Create API Key

1. Login to SendGrid: https://app.sendgrid.com/
2. Go to **Settings** → **API Keys** (left sidebar)
   - Direct link: https://app.sendgrid.com/settings/api_keys
3. Click **"Create API Key"** button
4. Configure API Key:
   - **Name:** `EasyBuyStore Production` (or any name)
   - **API Key Permissions:** Select **"Full Access"**
5. Click **"Create & View"**
6. **IMPORTANT:** Copy the API key immediately!
   - It starts with `SG.`
   - Example: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again!

---

## Step 3: Verify Sender Email

SendGrid requires you to verify the email address you'll send from.

### Option A: Single Sender Verification (Easiest)

1. Go to **Settings** → **Sender Authentication**
   - https://app.sendgrid.com/settings/sender_auth
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Name:** EasyBuyStore
   - **From Email:** Your email (e.g., `your-email@gmail.com`)
   - **Reply To:** Same email
   - **Company Address:** Any address
4. Click **"Create"**
5. Check your email and click the verification link
6. ✅ Your sender email is now verified!

### Option B: Domain Authentication (Professional)

Use this if you have a custom domain (e.g., `@easybuystore.com`).

1. Go to **Settings** → **Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Follow the DNS setup instructions
4. Wait for DNS propagation (can take up to 48 hours)

---

## Step 4: Add Environment Variables

Add these to your `.env.local` file:

```bash
# SendGrid Configuration
SENDGRID_API_KEY="SG.your-actual-api-key-here"
SENDGRID_FROM_EMAIL="your-verified-email@gmail.com"
SENDGRID_FROM_NAME="EasyBuyStore"
ADMIN_EMAIL="your-admin-email@gmail.com"
```

**Replace with your actual values:**
- `SENDGRID_API_KEY`: The API key you copied in Step 2
- `SENDGRID_FROM_EMAIL`: The email you verified in Step 3
- `SENDGRID_FROM_NAME`: Your store name (appears as sender name)
- `ADMIN_EMAIL`: Email to receive contact form submissions

---

## Step 5: Test Email Sending

Create a test API route to verify SendGrid works:

```bash
# Create test endpoint
touch app/api/test-email/route.ts
```

Add this code:

```typescript
// app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email/sendgrid';

export async function GET() {
  // Replace with your email
  const result = await sendWelcomeEmail('your-email@gmail.com', 'Test User');

  return NextResponse.json({
    success: result,
    message: result ? 'Email sent! Check your inbox.' : 'Failed to send email'
  });
}
```

Test it:
```bash
# Start dev server
npm run dev

# Open in browser:
http://localhost:3000/api/test-email

# Check your email inbox!
```

---

## Step 6: Integrate with Your App

### Example 1: Send Order Confirmation

```typescript
// app/api/checkout/route.ts (after creating order)
import { sendOrderConfirmation } from '@/lib/email/sendgrid';

// After order is created
await sendOrderConfirmation(user.email, {
  orderNumber: order.order_number,
  total: order.total,
  items: order.order_items,
  customerName: `${user.first_name} ${user.last_name}`,
});
```

### Example 2: Send Welcome Email

```typescript
// app/api/auth/signup/route.ts (after user registration)
import { sendWelcomeEmail } from '@/lib/email/sendgrid';

// After user is created
await sendWelcomeEmail(user.email, user.first_name);
```

### Example 3: Send Contact Form Notification

```typescript
// app/api/contact/route.ts
import { sendContactFormNotification } from '@/lib/email/sendgrid';

await sendContactFormNotification({
  name: formData.name,
  email: formData.email,
  subject: formData.subject,
  message: formData.message,
});
```

---

## Available Email Functions

Your project now has these email functions in `lib/email/sendgrid.ts`:

| Function | Purpose | Parameters |
|----------|---------|------------|
| `sendEmail()` | Generic email sender | `{ to, subject, html, text?, from? }` |
| `sendOrderConfirmation()` | Order confirmation | `to, orderData` |
| `sendWelcomeEmail()` | Welcome new users | `to, name` |
| `sendPasswordResetEmail()` | Password reset link | `to, resetToken` |
| `sendContactFormNotification()` | Contact form submission | `formData` |

---

## Email Templates

All emails include:
- ✅ Professional HTML design with inline CSS
- ✅ Responsive layout (mobile-friendly)
- ✅ Gradient header with your brand colors
- ✅ Clear call-to-action buttons
- ✅ Footer with company info
- ✅ Plain text fallback

---

## Troubleshooting

### "Unauthorized" Error
- ❌ API key is incorrect or not set
- ✅ Check `.env.local` has correct `SENDGRID_API_KEY`
- ✅ Make sure it starts with `SG.`

### "Sender Email Not Verified"
- ❌ FROM email not verified in SendGrid
- ✅ Go to Sender Authentication and verify your email
- ✅ Check verification email in your inbox

### Emails Not Arriving
1. **Check Spam/Junk folder**
2. **Check SendGrid Activity:**
   - https://app.sendgrid.com/email_activity
   - Shows all emails sent and their status
3. **Check email address is correct**
4. **Verify API key permissions** (should be "Full Access")

### "Daily Limit Exceeded"
- ❌ You've sent more than 100 emails today (free tier limit)
- ✅ Wait 24 hours for reset
- ✅ Or upgrade to a paid plan

---

## SendGrid Dashboard Overview

### Key Pages to Know:

1. **Email Activity** - View all sent emails
   - https://app.sendgrid.com/email_activity
   - See delivery status, opens, clicks

2. **Stats** - Email analytics
   - https://app.sendgrid.com/statistics
   - Delivery rate, bounce rate, etc.

3. **Sender Authentication** - Manage verified senders
   - https://app.sendgrid.com/settings/sender_auth

4. **API Keys** - Manage API keys
   - https://app.sendgrid.com/settings/api_keys

---

## For Your VIVA

### Questions You Might Get:

**Q: "What is SendGrid and why use it?"**
> SendGrid is a cloud-based email delivery service. We use it to send transactional emails like order confirmations and password resets. It's more reliable than sending from our own server, handles email authentication (SPF, DKIM), and has high deliverability rates.

**Q: "How do you send emails in your application?"**
> We use the SendGrid API. First, we import the email service from `lib/email/sendgrid.ts`, then call functions like `sendOrderConfirmation()` with the recipient's email and order data. SendGrid handles the actual email delivery.

**Q: "What's the difference between transactional and marketing emails?"**
> Transactional emails are triggered by user actions (order confirmation, password reset) and are one-to-one. Marketing emails are promotional (newsletters, sales) and are one-to-many. We only send transactional emails in this project.

**Q: "How do you handle email failures?"**
> Our email functions return a boolean. If sending fails, we log the error but don't stop the user flow. For example, if order confirmation email fails, the order is still created - email is secondary.

---

## Production Deployment (Vercel)

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add these variables:
   ```
   SENDGRID_API_KEY=SG.your-key
   SENDGRID_FROM_EMAIL=your-email@example.com
   SENDGRID_FROM_NAME=EasyBuyStore
   ADMIN_EMAIL=admin@example.com
   ```
4. Redeploy your app

---

## Cost & Limits

### Free Tier (Always Free):
- ✅ 100 emails/day
- ✅ 2,000 contacts
- ✅ API access
- ✅ Email validation
- ✅ 30 days of email activity

### Paid Plans (If Needed Later):
- **Essentials:** $19.95/month - 50,000 emails/month
- **Pro:** $89.95/month - 100,000 emails/month
- **Premier:** Custom pricing - 1M+ emails/month

For your demo/viva, **free tier is more than enough!**

---

## Quick Reference

### Import Email Functions:
```typescript
import {
  sendEmail,
  sendOrderConfirmation,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendContactFormNotification
} from '@/lib/email/sendgrid';
```

### Send an Email:
```typescript
await sendOrderConfirmation(user.email, {
  orderNumber: 'ORD-12345',
  total: 5000,
  items: orderItems,
  customerName: 'John Doe',
});
```

### Check if Email Sent:
```typescript
const success = await sendWelcomeEmail(email, name);

if (success) {
  console.log('✅ Email sent!');
} else {
  console.error('❌ Email failed');
}
```

---

## Resources

- **SendGrid Docs:** https://docs.sendgrid.com/
- **Email Templates:** https://sendgrid.com/dynamic_templates
- **Node.js SDK:** https://github.com/sendgrid/sendgrid-nodejs

---

✅ **Setup Complete!** Your application can now send professional emails via SendGrid!

For questions or issues, check the troubleshooting section or SendGrid's support docs.
