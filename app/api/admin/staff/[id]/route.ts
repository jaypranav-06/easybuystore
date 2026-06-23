import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import fs from 'fs';
import path from 'path';

const PERMISSIONS_FILE = path.join(process.cwd(), 'data', 'staff-permissions.json');

// Delete a staff member by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Extract and parse staff ID from URL params
  const { id } = await params;
  const staffId = parseInt(id);

  if (isNaN(staffId)) {
    return NextResponse.json({ error: 'Invalid staff ID' }, { status: 400 });
  }

  const adminId = parseInt(session.user.id);

  try {
    // Prevent deleting yourself
    if (staffId === adminId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if staff member exists
    const staffMember = await prisma.adminUser.findUnique({
      where: { admin_id: staffId },
    });

    if (!staffMember) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Prevent deleting the last admin
    if (staffMember.role === 'admin') {
      const adminCount = await prisma.adminUser.count({
        where: { role: 'admin' },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin account' },
          { status: 400 }
        );
      }
    }

    // Delete staff member
    await prisma.adminUser.delete({
      where: { admin_id: staffId },
    });

    // Remove permissions from file if exists
    if (fs.existsSync(PERMISSIONS_FILE)) {
      const data = fs.readFileSync(PERMISSIONS_FILE, 'utf-8');
      const allPermissions = JSON.parse(data);
      delete allPermissions[staffId.toString()];
      fs.writeFileSync(PERMISSIONS_FILE, JSON.stringify(allPermissions, null, 2));
    }

    return NextResponse.json({
      success: true,
      message: 'Staff member removed successfully',
    });
  } catch (error) {
    console.error('Error removing staff:', error);
    return NextResponse.json(
      { error: 'Failed to remove staff member' },
      { status: 500 }
    );
  }
}
