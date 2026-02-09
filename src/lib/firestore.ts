import { collection, addDoc, serverTimestamp, doc, updateDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import { ServiceRequest } from '@/types';

const REQUESTS_COLLECTION = 'serviceRequests';

export async function createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) {
  // Check if Firebase is properly initialized
  if (!db) {
    console.error('Firebase not initialized - cannot create service request');
    throw new Error('Firebase not configured. Please check your environment variables.');
  }

  try {
    console.log('Creating service request with data:', requestData);
    
    const docRef = await addDoc(collection(db!, REQUESTS_COLLECTION), {
      ...requestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Service request created successfully with ID:', docRef.id);
    return { id: docRef.id, ...requestData };
  } catch (error) {
    console.error('Error creating service request:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        throw new Error('Firebase permission denied. Please check your Firestore security rules.');
      } else if (error.message.includes('unavailable')) {
        throw new Error('Firebase unavailable. Please check your internet connection.');
      } else if (error.message.includes('unauthenticated')) {
        throw new Error('Firebase authentication failed. Please check your API keys.');
      }
    }
    
    throw error;
  }
}

export async function updateServiceRequest(id: string, updates: Partial<ServiceRequest>) {
  if (!db) {
    console.error('Firebase not initialized - cannot update service request');
    throw new Error('Firebase not configured. Please check your environment variables.');
  }

  try {
    const docRef = doc(db!, REQUESTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating service request:', error);
    throw error;
  }
}

export async function getServiceRequests(status?: ServiceRequest['status']) {
  if (!db) {
    console.error('Firebase not initialized - cannot fetch service requests');
    throw new Error('Firebase not configured. Please check your environment variables.');
  }

  try {
    let q = query(collection(db!, REQUESTS_COLLECTION), orderBy('createdAt', 'desc'));
    
    if (status) {
      q = query(collection(db!, REQUESTS_COLLECTION), where('status', '==', status), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const requests: ServiceRequest[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ServiceRequest);
    });
    
    return requests;
  } catch (error) {
    console.error('Error fetching service requests:', error);
    throw error;
  }
}