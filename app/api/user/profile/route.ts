import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zip_code: true,
        country: true,
        created_at: true,
        password_hash: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has a password (OAuth users have empty password_hash)
    const hasPassword = user.password_hash !== '' && user.password_hash !== null;

    // Remove password_hash from response and add has_password flag
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      ...userWithoutPassword,
      has_password: hasPassword,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();

    const { firstName, lastName, phone, address, city, state, zipCode, country } = body;

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zipCode || null,
        country: country || null,
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zip_code: true,
        country: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
