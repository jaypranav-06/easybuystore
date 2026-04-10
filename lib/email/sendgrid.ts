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
  console.warn('WARNING: SendGrid API key not found. Email functionality will not work.');
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
      console.error('ERROR: SendGrid API key not configured');
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

    console.log(`SUCCESS: Email sent successfully to ${emailData.to}`);
    return true;

  } catch (error: any) {
    console.error('ERROR: Error sending email:', error);

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
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #2C2C2C;
          margin: 0;
          padding: 0;
          background-color: #F8F8F8;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #FFFFFF;
          border: 1px solid #E5E5E5;
        }
        .logo-section {
          background: #FFFFFF;
          padding: 30px;
          text-align: center;
          border-bottom: 2px solid #D4AF37;
        }
        .logo-section img {
          height: 50px;
          width: auto;
        }
        .header {
          background: linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%);
          color: #FFFFFF;
          padding: 50px 30px;
          text-align: center;
        }
        .header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 10px 0;
          letter-spacing: -0.02em;
        }
        .header p {
          margin: 0;
          font-size: 16px;
          color: #E6C968;
        }
        .content {
          background: #FFFFFF;
          padding: 40px 30px;
        }
        .order-info {
          background: #F8F8F8;
          padding: 25px;
          margin: 20px 0;
          border: 1px solid #E5E5E5;
        }
        .order-info h2 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #2C2C2C;
          margin: 0 0 15px 0;
          padding-bottom: 15px;
          border-bottom: 2px solid #D4AF37;
        }
        .order-meta {
          display: table;
          width: 100%;
          margin-bottom: 20px;
        }
        .order-meta p {
          margin: 8px 0;
          color: #6B6B6B;
        }
        .order-meta strong {
          color: #2C2C2C;
        }
        .item {
          background: #FFFFFF;
          border-left: 3px solid #D4AF37;
          padding: 15px;
          margin: 10px 0;
        }
        .item strong {
          font-size: 16px;
          color: #2C2C2C;
          display: block;
          margin-bottom: 8px;
        }
        .item-details {
          color: #6B6B6B;
          font-size: 14px;
          line-height: 1.8;
        }
        .total {
          background: #2C2C2C;
          color: #FFFFFF;
          padding: 20px;
          margin-top: 20px;
          text-align: center;
        }
        .total-label {
          font-size: 14px;
          color: #E6C968;
          margin-bottom: 5px;
        }
        .total-amount {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #D4AF37;
        }
        .button {
          display: inline-block;
          background: #D4AF37;
          color: #2C2C2C;
          padding: 15px 40px;
          text-decoration: none;
          font-weight: 600;
          margin: 20px 0;
          transition: background 0.3s;
          letter-spacing: 0.5px;
        }
        .button:hover {
          background: #E6C968;
        }
        .divider {
          height: 2px;
          background: linear-gradient(to right, #D4AF37, #8B7355);
          margin: 30px 0;
        }
        .footer {
          background: #2C2C2C;
          color: #FFFFFF;
          padding: 30px;
          text-align: center;
        }
        .footer p {
          margin: 5px 0;
          font-size: 14px;
          color: #E5E5E5;
        }
        .footer .brand {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 600;
          color: #D4AF37;
          margin-bottom: 10px;
        }
        .footer .tagline {
          font-size: 12px;
          color: #6B6B6B;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="${process.env.NEXTAUTH_URL}/logo.svg" alt="EasyBuyStore" />
        </div>

        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase, ${orderData.customerName}</p>
        </div>

        <div class="content">
          <div class="order-info">
            <h2>Order Details</h2>
            <div class="order-meta">
              <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; color: #2C2C2C; margin: 25px 0 15px 0;">Items Ordered:</h3>
            ${orderData.items.map(item => `
              <div class="item">
                <strong>${item.product_name}</strong>
                <div class="item-details">
                  Quantity: ${item.quantity} × ₹${item.price.toLocaleString()}<br>
                  Subtotal: ₹${item.subtotal.toLocaleString()}
                </div>
              </div>
            `).join('')}

            <div class="total">
              <div class="total-label">ORDER TOTAL</div>
              <div class="total-amount">₹${orderData.total.toLocaleString()}</div>
            </div>
          </div>

          <div class="divider"></div>

          <p style="text-align: center; color: #6B6B6B;">
            We're processing your order and will send you a shipping confirmation once it's on its way.
          </p>

          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/account/orders" class="button">TRACK YOUR ORDER</a>
          </p>
        </div>

        <div class="footer">
          <p class="brand">EasyBuyStore</p>
          <p>Your Destination for Timeless Fashion</p>
          <p class="tagline">This is an automated email. Please do not reply.</p>
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
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #2C2C2C;
          margin: 0;
          padding: 0;
          background-color: #F8F8F8;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #FFFFFF;
          border: 1px solid #E5E5E5;
        }
        .logo-section {
          background: #FFFFFF;
          padding: 30px;
          text-align: center;
          border-bottom: 2px solid #D4AF37;
        }
        .logo-section img {
          height: 50px;
          width: auto;
        }
        .header {
          background: linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%);
          color: #FFFFFF;
          padding: 50px 30px;
          text-align: center;
        }
        .header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 10px 0;
          letter-spacing: -0.02em;
        }
        .header p {
          margin: 0;
          font-size: 16px;
          color: #E6C968;
        }
        .content {
          background: #FFFFFF;
          padding: 40px 30px;
        }
        .content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #2C2C2C;
          margin: 0 0 20px 0;
        }
        .content p {
          color: #6B6B6B;
          line-height: 1.8;
          margin: 0 0 20px 0;
        }
        .features {
          background: #F8F8F8;
          padding: 25px;
          margin: 30px 0;
          border-left: 4px solid #D4AF37;
        }
        .features ul {
          margin: 0;
          padding: 0 0 0 20px;
          color: #2C2C2C;
        }
        .features li {
          margin: 10px 0;
          line-height: 1.8;
        }
        .button {
          display: inline-block;
          background: #D4AF37;
          color: #2C2C2C;
          padding: 15px 40px;
          text-decoration: none;
          font-weight: 600;
          margin: 20px 0;
          transition: background 0.3s;
          letter-spacing: 0.5px;
        }
        .button:hover {
          background: #E6C968;
        }
        .divider {
          height: 2px;
          background: linear-gradient(to right, #D4AF37, #8B7355);
          margin: 30px 0;
        }
        .footer {
          background: #2C2C2C;
          color: #FFFFFF;
          padding: 30px;
          text-align: center;
        }
        .footer p {
          margin: 5px 0;
          font-size: 14px;
          color: #E5E5E5;
        }
        .footer .brand {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 600;
          color: #D4AF37;
          margin-bottom: 10px;
        }
        .footer .tagline {
          font-size: 12px;
          color: #6B6B6B;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="${process.env.NEXTAUTH_URL}/logo.svg" alt="EasyBuyStore" />
        </div>

        <div class="header">
          <h1>Welcome to EasyBuyStore</h1>
          <p>Discover Timeless Fashion</p>
        </div>

        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Welcome to EasyBuyStore, where elegance meets convenience. We're thrilled to have you join our community of fashion enthusiasts.</p>

          <div class="features">
            <p style="margin: 0 0 15px 0; font-weight: 600; color: #2C2C2C;">Your exclusive benefits:</p>
            <ul>
              <li>Curated collection of premium fashion</li>
              <li>Personalized wishlist for your favorites</li>
              <li>Exclusive offers and early access to sales</li>
              <li>Real-time order tracking and updates</li>
            </ul>
          </div>

          <div class="divider"></div>

          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/products" class="button">EXPLORE COLLECTION</a>
          </p>

          <p style="text-align: center; color: #6B6B6B; font-size: 14px;">
            Questions? Our customer service team is here to help.
          </p>
        </div>

        <div class="footer">
          <p class="brand">EasyBuyStore</p>
          <p>Your Destination for Timeless Fashion</p>
          <p class="tagline">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Welcome to EasyBuyStore! Hi ${name}, Welcome to EasyBuyStore, where elegance meets convenience. Explore our collection at ${process.env.NEXTAUTH_URL}/products`;
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
            <strong>SECURITY NOTICE:</strong><br>
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
