export async function uploadPhotos(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const filename = `${timestamp}-${randomId}-${file.name}`;
      
      // Upload using API route
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(filename)}`,
        {
          method: 'POST',
          body: file,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const blob = await response.json();
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