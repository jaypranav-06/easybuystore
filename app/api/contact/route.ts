import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

// Validation schema for contact form submission
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Handle contact form submissions
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Save contact message to database
    const contact = await prisma.contact.create({
      data: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        status: 'new',
        updated_at: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully',
        contact: {
          id: contact.id,
          created_at: contact.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
