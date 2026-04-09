import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import { sendWelcomeEmail } from '@/lib/email/sendgrid';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        password_hash: hashedPassword,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zip_code: validatedData.zipCode,
        country: validatedData.country,
        updated_at: new Date(),
      },
    });

    // Send welcome email
    try {
      const fullName = `${validatedData.firstName} ${validatedData.lastName}`;
      await sendWelcomeEmail(validatedData.email, fullName);
      console.log('✅ Welcome email sent to:', validatedData.email);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
        message: 'User registered successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
