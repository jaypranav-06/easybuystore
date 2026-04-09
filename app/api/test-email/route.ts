/**
 * TEST EMAIL API ENDPOINT
 *
 * This endpoint is for testing SendGrid email functionality.
 * Use it to verify your SendGrid setup works correctly.
 *
 * Usage: http://localhost:3000/api/test-email?email=your-email@gmail.com
 *
 * For VIVA Demo:
 * - Shows how we send transactional emails
 * - Demonstrates error handling
 * - Can test all email templates
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendPasswordResetEmail,
} from '@/lib/email/sendgrid';

export async function GET(request: NextRequest) {
  try {
    // Get email from query parameter
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const type = searchParams.get('type') || 'welcome'; // Default: welcome email

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required. Usage: ?email=your@email.com' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send different email types based on 'type' parameter
    let result = false;
    let emailType = '';

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(email, 'Test User');
        emailType = 'Welcome Email';
        break;

      case 'order':
        result = await sendOrderConfirmation(email, {
          orderNumber: 'TEST-ORDER-' + Date.now(),
          total: 5500,
          customerName: 'Test User',
          items: [
            {
              product_name: 'Gaming Laptop',
              quantity: 1,
              price: 50000,
              subtotal: 50000,
            },
            {
              product_name: 'Wireless Mouse',
              quantity: 2,
              price: 500,
              subtotal: 1000,
            },
          ],
        });
        emailType = 'Order Confirmation';
        break;

      case 'reset':
        result = await sendPasswordResetEmail(email, 'test-token-12345');
        emailType = 'Password Reset';
        break;

      default:
        return NextResponse.json(
          {
            error: 'Invalid type. Use: welcome, order, or reset',
          },
          { status: 400 }
        );
    }

    // Return result
    if (result) {
      return NextResponse.json({
        success: true,
        message: `✅ ${emailType} sent successfully to ${email}!`,
        note: 'Check your email inbox (and spam folder)',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email. Check server logs for details.',
          troubleshooting: [
            'Verify SENDGRID_API_KEY in .env.local',
            'Verify SENDGRID_FROM_EMAIL is verified in SendGrid dashboard',
            'Check SendGrid Activity: https://app.sendgrid.com/email_activity',
          ],
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Test email error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message,
        troubleshooting: [
          'Check if SendGrid is configured correctly',
          'Verify environment variables are set',
          'Check SendGrid API key is valid',
        ],
      },
      { status: 500 }
    );
  }
}
