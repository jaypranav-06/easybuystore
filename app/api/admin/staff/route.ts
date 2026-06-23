import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const PERMISSIONS_FILE = path.join(process.cwd(), 'data', 'staff-permissions.json');

// Create data directory if it doesn't exist
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Save staff member permissions to JSON file
function savePermissions(adminId: number, permissions: string[]) {
  ensureDataDir();
  let allPermissions: Record<string, string[]> = {};

  if (fs.existsSync(PERMISSIONS_FILE)) {
    const data = fs.readFileSync(PERMISSIONS_FILE, 'utf-8');
    allPermissions = JSON.parse(data);
  }

  allPermissions[adminId.toString()] = permissions;
  fs.writeFileSync(PERMISSIONS_FILE, JSON.stringify(allPermissions, null, 2));
}

// Get list of all staff members
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all staff members from database
    const staff = await prisma.adminUser.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        admin_id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

// Create new staff member account
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body
    const body = await request.json();
    const { username, email, password, role, permissions } = body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Username, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'staff'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // For staff role, require at least one permission
    if (role === 'staff' && (!permissions || permissions.length === 0)) {
      return NextResponse.json(
        { error: 'Staff members must have at least one permission' },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const existingUser = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new staff member
    const newStaff = await prisma.adminUser.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
        role,
        updated_at: new Date(),
      },
      select: {
        admin_id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    // Save permissions if staff role
    if (role === 'staff' && permissions) {
      savePermissions(newStaff.admin_id, permissions);
    }

    return NextResponse.json({
      success: true,
      message: 'Staff member added successfully',
      staff: newStaff,
    });
  } catch (error) {
    console.error('Error adding staff:', error);
    return NextResponse.json(
      { error: 'Failed to add staff member' },
      { status: 500 }
    );
  }
}
