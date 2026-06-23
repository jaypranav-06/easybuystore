import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

// Get current admin user profile information
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch admin data from database
    const adminData = await prisma.adminUser.findUnique({
      where: { admin_id: parseInt(session.user.id) },
      select: {
        admin_id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!adminData) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: adminData.admin_id,
        username: adminData.username,
        email: adminData.email,
        role: adminData.role,
        created_at: adminData.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// Update admin profile information
export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body
    const body = await request.json();
    const { username, email } = body;

    const adminId = parseInt(session.user.id);

    // Get current admin data
    const currentAdmin = await prisma.adminUser.findUnique({
      where: { admin_id: adminId },
    });

    if (!currentAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Check if email is already taken by another admin
    if (email && email !== currentAdmin.email) {
      const existingAdmin = await prisma.adminUser.findFirst({
        where: {
          email,
          admin_id: { not: adminId },
        },
      });

      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    // Update admin profile
    const updatedAdmin = await prisma.adminUser.update({
      where: { admin_id: adminId },
      data: {
        username: username || currentAdmin.username,
        email: email || currentAdmin.email,
      },
      select: {
        admin_id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: updatedAdmin.admin_id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
      },
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
