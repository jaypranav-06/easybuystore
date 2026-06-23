import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  console.log('📤 Upload API called');
  const session = await auth();
  console.log('📤 Session:', session ? { email: session.user.email, role: session.user.role } : 'No session');

  if (!session || session.user.role !== 'admin') {
    console.log('📤 Authorization failed - Unauthorized');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('📤 Authorization passed - User is admin');

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s/g, '-');
    const filename = `products/${timestamp}-${originalName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log('📤 Upload successful:', blob.url);

    // Return public URL
    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
