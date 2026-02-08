import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadPhotos(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      
      // Create a reference to the file location
      const storageRef = ref(storage, `service-photos/${filename}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
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