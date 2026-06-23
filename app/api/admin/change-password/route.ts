import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

// Change admin user password
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Get admin with password hash
    const adminData = await prisma.adminUser.findUnique({
      where: { admin_id: parseInt(session.user.id) },
    });

    if (!adminData) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      adminData.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.adminUser.update({
      where: { admin_id: parseInt(session.user.id) },
      data: { password_hash: newPasswordHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
