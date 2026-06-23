import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
);

// Handle admin login with email and password
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Query admin_users table directly
    const adminUser = await prisma.$queryRaw<Array<{
      admin_id: number;
      username: string;
      email: string;
      password_hash: string;
      role: string;
    }>>`
      SELECT admin_id, username, email, password_hash, role
      FROM admin_users
      WHERE email = ${email}
    `;

    if (!adminUser || adminUser.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const admin = adminUser[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await new SignJWT({
      id: admin.admin_id,
      email: admin.email,
      username: admin.username,
      role: admin.role,
      type: 'admin',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.admin_id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
