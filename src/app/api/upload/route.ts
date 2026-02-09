import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Check if Vercel Blob is configured
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json(
        { error: 'Vercel Blob not configured' },
        { status: 500 }
      );
    }

    // Get the file body
    const body = await request.arrayBuffer();
    if (!body) {
      return NextResponse.json(
        { error: 'No file body provided' },
        { status: 400 }
      );
    }

    // Upload file to Vercel Blob
    const blob = await put(filename, body, {
      access: 'public',
      token: blobToken,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}