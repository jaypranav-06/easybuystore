import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Handle admin logout by clearing authentication cookie
export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete the admin-token cookie
    cookieStore.delete('admin-token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
