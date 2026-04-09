/**
 * SENDGRID EMAIL SERVICE
 *
 * This service handles sending emails using SendGrid API.
 *
 * Use cases:
 * - Order confirmation emails
 * - Password reset emails
 * - Welcome emails
 * - Contact form notifications
 *
 * For VIVA:
 * - SendGrid is a cloud email delivery service (like Gmail API but for businesses)
 * - Transactional emails: Automated emails triggered by user actions
 * - Free tier: 100 emails/day (perfect for demos)
 */

import sgMail from '@sendgrid/mail';

/**
 * INITIALIZE SENDGRID
 *
 * Set the API key from environment variables.
 * This key authenticates our app with SendGrid.
 */
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('⚠️ SendGrid API key not found. Email functionality will not work.');
}

/**
 * EMAIL CONFIGURATION
 *
 * Default sender information for all emails.
 * This appears in the "From" field when users receive emails.
 */
const DEFAULT_FROM = {
  email: process.env.SENDGRID_FROM_EMAIL || 'noreply@easybuystore.com',
  name: process.env.SENDGRID_FROM_NAME || 'EasyBuyStore',
};

/**
 * Email Template Interface
 *
 * Defines the structure for email data.
 */
interface EmailData {
  to: string;           // Recipient email
  subject: string;      // Email subject line
  text?: string;        // Plain text version (fallback)
  html: string;         // HTML version (with styling)
  from?: {              // Optional custom sender
    email: string;
    name: string;
  };
}

/**
 * SEND EMAIL FUNCTION
 *
 * Generic function to send any type of email via SendGrid.
 *
 * @param emailData - Email configuration object
 * @returns Promise<boolean> - True if sent successfully, false otherwise
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // Validate SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SendGrid API key not configured');
      return false;
    }

    // Prepare email message
    const msg = {
      to: emailData.to,
      from: emailData.from || DEFAULT_FROM,
      subject: emailData.subject,
      text: emailData.text || '',  // Plain text fallback
      html: emailData.html,         // HTML content
    };

    // Send email via SendGrid API
    await sgMail.send(msg);

    console.log(`✅ Email sent successfully to ${emailData.to}`);
    return true;

  } catch (error: any) {
    console.error('❌ Error sending email:', error);

    // Log detailed error information
    if (error.response) {
      console.error('SendGrid Error:', error.response.body);
    }

    return false;
  }
}

/**
 * SEND ORDER CONFIRMATION EMAIL
 *
 * Sends an email when user places an order.
 *
 * @param to - Customer email
 * @param orderData - Order details (order number, total, items)
 */
export async function sendOrderConfirmation(
  to: string,
  orderData: {
    orderNumber: string;
    total: number;
    items: any[];
    customerName: string;
  }
): Promise<boolean> {
  const subject = `Order Confirmation - ${orderData.orderNumber}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { border-bottom: 1px solid #eee; padding: 15px 0; }
        .total { font-size: 20px; font-weight: bold; color: #667eea; margin-top: 20px; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p>Thank you for your purchase, ${orderData.customerName}!</p>
        </div>

        <div class="content">
          <div class="order-info">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>

            <h3 style="margin-top: 30px;">Items Ordered:</h3>
            ${orderData.items.map(item => `
              <div class="item">
                <strong>${item.product_name}</strong><br>
                Quantity: ${item.quantity} × Rs ${item.price.toLocaleString()}<br>
                Subtotal: Rs ${item.subtotal.toLocaleString()}
              </div>
            `).join('')}

            <div class="total">
              Total: Rs ${orderData.total.toLocaleString()}
            </div>
          </div>

          <p>We're processing your order and will send you a shipping confirmation once it's on its way.</p>

          <a href="${process.env.NEXTAUTH_URL}/account/orders" class="button">View Order Status</a>
        </div>

        <div class="footer">
          <p>EasyBuyStore - Your trusted online shopping partner</p>
          <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Order Confirmation - ${orderData.orderNumber}. Thank you for your purchase, ${orderData.customerName}! Total: Rs ${orderData.total.toLocaleString()}. View your order at ${process.env.NEXTAUTH_URL}/account/orders`;
  return sendEmail({ to, subject, html, text });
}

/**
 * SEND WELCOME EMAIL
 *
 * Sends a welcome email when user registers.
 *
 * @param to - New user's email
 * @param name - User's name
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  const subject = 'Welcome to EasyBuyStore!';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👋 Welcome to EasyBuyStore!</h1>
        </div>

        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for joining EasyBuyStore! We're excited to have you as part of our community.</p>

          <p><strong>What you can do now:</strong></p>
          <ul>
            <li>Browse thousands of products</li>
            <li>Add items to your wishlist</li>
            <li>Get exclusive deals and offers</li>
            <li>Track your orders in real-time</li>
          </ul>

          <a href="${process.env.NEXTAUTH_URL}/products" class="button">Start Shopping</a>

          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>

        <div class="footer">
          <p>EasyBuyStore - Your trusted online shopping partner</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Hi ${name}, Welcome to EasyBuyStore! Thank you for joining us. Start shopping at ${process.env.NEXTAUTH_URL}/products`;
  return sendEmail({ to, subject, html, text });
}

/**
 * SEND PASSWORD RESET EMAIL
 *
 * Sends password reset link to user.
 *
 * @param to - User's email
 * @param resetToken - Password reset token
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string
): Promise<boolean> {
  const subject = 'Reset Your Password - EasyBuyStore';
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ff6b6b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>

        <div class="content">
          <p>You requested to reset your password for your EasyBuyStore account.</p>

          <p>Click the button below to reset your password:</p>

          <a href="${resetLink}" class="button">Reset Password</a>

          <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            This link will expire in 1 hour.<br>
            If you didn't request this, please ignore this email.
          </div>

          <p style="font-size: 12px; color: #666;">
            Or copy and paste this link in your browser:<br>
            ${resetLink}
          </p>
        </div>

        <div class="footer">
          <p>EasyBuyStore - Your trusted online shopping partner</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Password Reset Request. Click this link to reset your password: ${resetLink}. This link expires in 1 hour. If you didn't request this, please ignore this email.`;
  return sendEmail({ to, subject, html, text });
}

/**
 * SEND CONTACT FORM NOTIFICATION
 *
 * Sends notification when someone submits contact form.
 *
 * @param formData - Contact form submission data
 */
export async function sendContactFormNotification(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const subject = `New Contact Form Submission: ${formData.subject}`;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@easybuystore.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
      <p><strong>Subject:</strong> ${formData.subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
        ${formData.message.replace(/\n/g, '<br>')}
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Reply to: <a href="mailto:${formData.email}">${formData.email}</a>
      </p>
    </body>
    </html>
  `;

  return sendEmail({ to: adminEmail, subject, html });
}

export default {
  sendEmail,
  sendOrderConfirmation,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendContactFormNotification,
};
