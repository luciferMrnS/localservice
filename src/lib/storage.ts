import { put } from '@vercel/blob';

export async function uploadPhotos(files: File[]): Promise<string[]> {
  // Check if Vercel Blob token is configured
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken || blobToken === 'your_vercel_blob_token_here') {
    console.log('Vercel Blob token not configured - skipping photo upload');
    return []; // Return empty array instead of throwing error
  }

  const uploadPromises = files.map(async (file) => {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const filename = `${timestamp}-${randomId}-${file.name}`;
      
      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: 'public',
        token: blobToken,
      });
      
      return blob.url;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  });

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading photos:', error);
    throw error;
  }
}

export function validatePhotoFile(file: File): boolean {
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return false;
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return false;
  }

  return true;
}